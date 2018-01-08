package gsm

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gorilla/sessions"
)

var (
	// ErrHeaderFieldNameEmpty is returned, if the HeaderFieldName, which should be used to store session information, is empty.
	ErrHeaderFieldNameEmpty = errors.New("header fieldname empty")

	// ErrValueNotFound is returned, if no value was found for a given sessionName.
	ErrValueNotFound = errors.New("value not found")
)

// ValueStorer stores a value for a given name inside a http.Request.
// The value is typically the encrypted sessionID, which can then be
// fetched by a Gorialla sessions.Store implementation.
type ValueStorer interface {
	// GetValueForSessionName gets a value string using it's underlying ValueStorer implementation.
	GetValueForSessionName(r *http.Request, name string) (string, error)

	// SetValueForSessionName sets a value string using it's underlying ValueStorer implementation.
	SetValueForSessionName(w http.ResponseWriter, name, value string, options *sessions.Options) error
}

// CookieStorer is a ValueStorer, which stores values inside an http.Cookie
type CookieStorer struct{}

// GetValueForSessionName gets a value string from an http.Cookie, which should be present in the http.Request.
func (s *CookieStorer) GetValueForSessionName(r *http.Request, name string) (string, error) {
	c, err := r.Cookie(name)
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

// SetValueForSessionName sets a value string by creating a new http.Cookie and setting a `Set-Cookie` header
func (s *CookieStorer) SetValueForSessionName(w http.ResponseWriter, name, value string, options *sessions.Options) error {
	http.SetCookie(w, sessions.NewCookie(name, value, options))
	return nil
}

// HeaderStorer is a ValueStorer, which stores values inside an http Header.
// The key of the header contains can be configured using the `HeaderFieldName` variable.
// The header value is a Base64 encoded JSON map, whereas the keys of the map are the sessionName.
type HeaderStorer struct {
	HeaderFieldName string
}

// GetValueForSessionName gets a value string from an http.Header.
func (s *HeaderStorer) GetValueForSessionName(r *http.Request, name string) (string, error) {
	// fetch header field from header.
	headerBase64Encoded := r.Header.Get(s.HeaderFieldName)
	if headerBase64Encoded == "" {
		return "", ErrValueNotFound
	}

	// fetch value for name from JSON map.
	headerMap, err := s.headerToMap(headerBase64Encoded)
	if err != nil {
		return "", err
	}
	value, exists := headerMap[name]
	if !exists {
		return "", ErrValueNotFound
	}
	return value, nil
}

// SetValueForSessionName sets a value string by creating a new http.Header using the header key given by the headerStorer.HeaderKey function.
func (s *HeaderStorer) SetValueForSessionName(w http.ResponseWriter, name, value string, options *sessions.Options) error {
	var newHeaderMap map[string]string

	// try to fetch an existing headerMap to we can append our values
	headerBase64Encoded := w.Header().Get(s.HeaderFieldName)
	if headerBase64Encoded != "" {
		currentHeaderMap, err := s.headerToMap(headerBase64Encoded)
		if err != nil {
			return err
		}
		// we found old values. Prepare newHeaderMap, so we can add/update values.
		newHeaderMap = currentHeaderMap
	} else {
		// no header found. add a new one.
		newHeaderMap = make(map[string]string)
	}

	// add/update value to map.
	newHeaderMap[name] = value

	// encode to base64 string
	newHeaderEncoded, err := s.mapToHeader(newHeaderMap)
	if err != nil {
		return err
	}
	// add/replace current header
	w.Header().Set(s.HeaderFieldName, newHeaderEncoded)
	return nil
}

// headerToMap decodes a base64 encoded JSON map into a regular JSON map.
func (s *HeaderStorer) headerToMap(headerBase64Encoded string) (map[string]string, error) {
	headerJson, err := base64.StdEncoding.DecodeString(headerBase64Encoded)
	if err != nil {
		return nil, err
	}
	var result map[string]string
	if err := json.Unmarshal([]byte(headerJson), &result); err != nil {
		return nil, err
	}
	return result, nil
}

// mapToHeader encoded a JSON map into a base64 encoded string.
func (s *HeaderStorer) mapToHeader(headerMap map[string]string) (string, error) {
	result, err := json.Marshal(headerMap)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(result), nil
}
