// Memcache session support for Gorilla Web Toolkit,
// without Google App Engine dependency.
package gsm

import (
	"bytes"
	"encoding/base32"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"log"
	"net/http"
	"strings"
)

// NewMemcacheStoreWithValueStorer returns a new MemcacheStore backed by a ValueStorer.
// You need to provide the memcache client and
// an optional prefix for the keys we store.
// A ValueStorer is used to store an encrypted sessionID. The encrypted sessionID is used to access
// memcache and get the session values.
func NewMemcacheStoreWithValueStorer(client *memcache.Client, valueStorer ValueStorer, keyPrefix string, keyPairs ...[]byte) *MemcacheStore {

	if client == nil {
		panic("Cannot have nil memcache client")
	}

	if valueStorer == nil {
		panic("Cannot have nil ValueStorer")
	}

	return &MemcacheStore{
		Codecs: securecookie.CodecsFromPairs(keyPairs...),
		Options: &sessions.Options{
			Path:   "/",
			MaxAge: 86400 * 30,
		},
		KeyPrefix:   keyPrefix,
		Client:      client,
		StoreMethod: StoreMethodSecureCookie,
		ValueStorer: valueStorer,
	}
}

// NewMemcacheStore returns a new MemcacheStore.
// You need to provide the memcache client and
// an optional prefix for the keys we store
func NewMemcacheStore(client *memcache.Client, keyPrefix string, keyPairs ...[]byte) *MemcacheStore {
	return NewMemcacheStoreWithValueStorer(client, &CookieStorer{}, keyPrefix, keyPairs...)
}

type StoreMethod string

// take your pick on how to store the values in memcache
const (
	StoreMethodSecureCookie = StoreMethod("securecookie") // security
	StoreMethodGob          = StoreMethod("gob")          // speed
	StoreMethodJson         = StoreMethod("json")         // simplicity; warning: only string keys allowed and rest of data must be JSON.Marshal compatible
)

// MemcacheStore stores sessions in memcache
//
type MemcacheStore struct {
	Codecs      []securecookie.Codec
	Options     *sessions.Options // default configuration
	Client      *memcache.Client
	KeyPrefix   string
	Logging     int // set to > 0 to enable logging (using log.Printf)
	StoreMethod StoreMethod
	ValueStorer ValueStorer
}

// MaxLength restricts the maximum length of new sessions to l.
// If l is 0 there is no limit to the size of a session, use with caution.
// The default for a new MemcacheStore is 4096.
func (s *MemcacheStore) MaxLength(l int) {
	for _, c := range s.Codecs {
		if codec, ok := c.(*securecookie.SecureCookie); ok {
			codec.MaxLength(l)
		}
	}
}

// Get returns a session for the given name after adding it to the registry.
//
// See CookieStore.Get().
func (s *MemcacheStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	return sessions.GetRegistry(r).Get(s, name)
}

// New returns a session for the given name without adding it to the registry.
//
// See CookieStore.New().
func (s *MemcacheStore) New(r *http.Request, name string) (*sessions.Session, error) {
	session := sessions.NewSession(s, name)
	opts := *s.Options
	session.Options = &opts
	session.IsNew = true
	var err error
	if value, errCookie := s.ValueStorer.GetValueForSessionName(r, name); errCookie == nil {
		err = securecookie.DecodeMulti(name, value, &session.ID, s.Codecs...)
		if err == nil {
			err = s.load(session)
			if err == nil {
				session.IsNew = false
			}
		}
	}
	return session, err
}

// Save adds a single session to the response.
func (s *MemcacheStore) Save(r *http.Request, w http.ResponseWriter,
	session *sessions.Session) error {
	if session.ID == "" {
		// Because the ID is used in the filename, encode it to
		// use alphanumeric characters only.
		session.ID = strings.TrimRight(
			base32.StdEncoding.EncodeToString(
				securecookie.GenerateRandomKey(32)), "=")
	}
	if err := s.save(session); err != nil {
		return err
	}
	encoded, err := securecookie.EncodeMulti(session.Name(), session.ID,
		s.Codecs...)
	if err != nil {
		return err
	}
	if err := s.ValueStorer.SetValueForSessionName(w, session.Name(), encoded, session.Options); err != nil {
		return err
	}
	return nil
}

// save writes encoded session.Values using the memcache client
func (s *MemcacheStore) save(session *sessions.Session) error {

	key := s.KeyPrefix + session.ID

	switch s.StoreMethod {

	case StoreMethodSecureCookie:

		encoded, err := securecookie.EncodeMulti(session.Name(), session.Values,
			s.Codecs...)
		if err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: set (method: securecookie, encoding error: %v)", err)
			}
			return err
		}

		err = s.Client.Set(&memcache.Item{Key: key, Value: []byte(encoded), Expiration: int32(session.Options.MaxAge)})
		if s.Logging > 0 {
			log.Printf("gorilla-sessions-memcache: set (method: securecookie, session name: %v, memcache key: %v, memcache value: %v, error: %v)", session.Name(), key, encoded, err)
		}
		if err != nil {
			return err
		}

		return nil

	case StoreMethodGob:

		buf := &bytes.Buffer{}
		enc := gob.NewEncoder(buf)
		if err := enc.Encode(session.Values); err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: set (method: gob, encoding error: %v)", err)
			}
			return err
		}
		bufbytes := buf.Bytes()

		err := s.Client.Set(&memcache.Item{Key: key, Value: bufbytes, Expiration: int32(session.Options.MaxAge)})
		if s.Logging > 0 {
			log.Printf("gorilla-sessions-memcache: set (method: gob, session name: %v, memcache key: %v, memcache value len: %v, error: %v)", session.Name(), key, len(bufbytes), err)
		}
		if err != nil {
			return err
		}

		return nil

	case StoreMethodJson:

		vals := make(map[string]interface{}, len(session.Values))
		for k, v := range session.Values {
			ks, ok := k.(string)
			if !ok {
				err := fmt.Errorf("Non-string key value, cannot jsonize: %v", k)
				log.Printf("gorilla-sessions-memcache: set (method: json, encoding error: %v)", err)
				return err
			}
			vals[ks] = v
		}

		bufbytes, err := json.Marshal(vals)
		if err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: set (method: json, encoding error: %v)", err)
			}
			return err
		}

		err = s.Client.Set(&memcache.Item{Key: key, Value: bufbytes, Expiration: int32(session.Options.MaxAge)})
		if s.Logging > 0 {
			log.Printf("gorilla-sessions-memcache: set (method: json, session name: %v, memcache key: %v, memcache value: %v, error: %v)", session.Name(), key, string(bufbytes), err)
		}
		if err != nil {
			return err
		}

		return nil

	default:
		panic("Unknown StoreMethod: " + string(s.StoreMethod))
	}

	panic("Unreachable")
	return nil
}

// load reads a file and decodes its content into session.Values.
func (s *MemcacheStore) load(session *sessions.Session) error {

	key := s.KeyPrefix + session.ID

	it, err := s.Client.Get(key)
	if s.Logging > 0 {
		if s.StoreMethod == StoreMethodJson {
			log.Printf("gorilla-sessions-memcache: get (method: %s, session name: %v, memcache key: %v, memcache value: %v, error: %v)", s.StoreMethod, session.Name(), key, string(it.Value), err)
		} else {
			log.Printf("gorilla-sessions-memcache: get (method: %s, session name: %v, memcache key: %v, memcache value len: %v, error: %v)", s.StoreMethod, session.Name(), key, len(it.Value), err)
		}
	}
	if err != nil {
		return err
	}

	switch s.StoreMethod {

	case StoreMethodSecureCookie:

		if err = securecookie.DecodeMulti(session.Name(), string(it.Value),
			&session.Values, s.Codecs...); err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: get (method: securecookie, decoding error: %v)", err)
			}
			return err
		}
		return nil

	case StoreMethodGob:

		buf := bytes.NewBuffer(it.Value)
		dec := gob.NewDecoder(buf)

		err = dec.Decode(&session.Values)
		if err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: get (method: gob, decoding error: %v)", err)
			}
		}
		return err

	case StoreMethodJson:

		vals := make(map[string]interface{})

		err := json.Unmarshal(it.Value, &vals)
		if err != nil {
			if s.Logging > 0 {
				log.Printf("gorilla-sessions-memcache: get (method: json, decoding error: %v)", err)
			}
			return err
		}

		for k, v := range vals {
			session.Values[k] = v
		}

		return nil

	default:
		panic("Unknown StoreMethod: " + string(s.StoreMethod))

	}

	panic("Unreachable")
	return nil
}
