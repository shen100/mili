gorilla-sessions-memcache
=========================

Memcache session support for Gorilla Web Toolkit.  

Dependencies
------------

The usual gorilla stuff:

    go get github.com/gorilla/sessions

Plus Brad Fitz' memcache client:

    go get github.com/bradfitz/gomemcache/memcache

Usage
-----

    import (
      "github.com/bradfitz/gomemcache/memcache"
      gsm "github.com/bradleypeabody/gorilla-sessions-memcache"
    )

    ...

    // set up your memcache client
    memcacheClient := memcache.New("localhost:11211")
    
    // set up your session store
    store := gsm.NewMemcacheStore(memcacheClient, "session_prefix_", []byte("secret-key-goes-here"))
    
    // and the rest of it is the same as any other gorilla session handling:
    func MyHandler(w http.ResponseWriter, r *http.Request) {
      session, _ := store.Get(r, "session-name")
      session.Values["foo"] = "bar"
      session.Values[42] = 43
      session.Save(r, w)
    }


    ......
    // you can also setup a MemCacheStore, which does not rely on the browser accepting cookies.
    // this means, your client has to extract and send a configurable http Headerfield manually.
    // e.g.

    // set up your memcache client
    memcacheClient := memcache.New("localhost:11211")
    
    // set up your session store relying on a http Headerfield: `X-CUSTOM-HEADER`
    store := gsm.NewMemcacheStoreWithValueStorer(memcacheClient, &gsm.HeaderStorer{HeaderPrefix:"X-CUSTOM-HEADER"}, "session_prefix_", []byte("secret-key-goes-here"))
    
    // and the rest of it is the same as any other gorilla session handling:
    // The client has to send the session information in the header-field: `X-CUSTOM-HEADER`
    func MyHandler(w http.ResponseWriter, r *http.Request) {
      session, _ := store.Get(r, "session-name")
      session.Values["foo"] = "bar"
      session.Values[42] = 43
      session.Save(r, w)
    }

Storage Methods
---------------

I've added a few different methods of storage of the session data in memcache.  You
use them by setting the StoreMethod field.

* SecureCookie - uses the default securecookie encoding.  Values are more secure
  as they are not readable from memcache without the secret key.
* Gob - uses the Gob encoder directly without any post processing.  Faster.
  Result is Gob's usual binary gibber (not human readable)
* Json - uses the Json Marshaller.  Result is human readable, slower but still
  pretty fast.  Be careful - it will munch your data into stuff that works
  with JSON, and the keys must be strings.  Example: you put in an int64 value
  and you'll get back a float64. 

Example:

    store := gsm.NewMemcacheStore(memcacheClient, "session_prefix_", []byte("..."))
    // do one of these:
    store.StoreMethod = gsm.StoreMethodSecureCookie // default, more secure
    store.StoreMethod = gsm.StoreMethodGob // faster
    store.StoreMethod = gsm.StoreMethodJson // human readable
    							// (but watch out, it munches your types
    							// to JSON compatible stuff)

Logging
-------

Logging is available by setting the Logging field to > 0 after making your MemcacheStore.

    store := gsm.NewMemcacheStore(memcacheClient, "session_prefix_", []byte("..."))
    store.Logging = 1

That will output (using log.Printf) data about each session read/written from/to memcache.
Useful for debugging

Things to Know
--------------

* This is still experimental as of May 2014.

* You can also call NewDumbMemorySessionStore() for local development without a memcache server (it's a stub that just stuffs your session data in a map - definitely do not use this for anything but local dev and testing).
