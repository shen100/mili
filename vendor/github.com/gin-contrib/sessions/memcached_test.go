package sessions

import (
	"github.com/bradfitz/gomemcache/memcache"
	"testing"
)

const memcachedTestServer = "localhost:11211"

var newMemcachedStore = func(_ *testing.T) Store {
	store := NewMemcacheStore(memcache.New(memcachedTestServer), "", []byte("secret"))
	return store
}

func TestMemcached_SessionGetSet(t *testing.T) {
	sessionGetSet(t, newMemcachedStore)
}

func TestMemcached_SessionDeleteKey(t *testing.T) {
	sessionDeleteKey(t, newMemcachedStore)
}

func TestMemcached_SessionFlashes(t *testing.T) {
	sessionFlashes(t, newMemcachedStore)
}

func TestMemcached_SessionClear(t *testing.T) {
	sessionClear(t, newMemcachedStore)
}

func TestMemcached_SessionOptions(t *testing.T) {
	sessionOptions(t, newMemcachedStore)
}
