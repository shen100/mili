package sessions

import (
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/bradleypeabody/gorilla-sessions-memcache"
	"github.com/gorilla/sessions"
)

type MemcachedStore interface {
	Store
}

// client: memcache client.
// keyPrefix: prefix for the keys we store.
func NewMemcacheStore(client *memcache.Client, keyPrefix string, keyPairs ...[]byte) MemcachedStore {
	store := gsm.NewMemcacheStore(client, keyPrefix, keyPairs...)
	return &memcacheStore{store}
}

type memcacheStore struct {
	*gsm.MemcacheStore
}

func (c *memcacheStore) Options(options Options) {
	c.MemcacheStore.Options = &sessions.Options{
		Path:     options.Path,
		Domain:   options.Domain,
		MaxAge:   options.MaxAge,
		Secure:   options.Secure,
		HttpOnly: options.HttpOnly,
	}
}
