package sessions

import (
	"github.com/gorilla/sessions"
	"github.com/kidstuff/mongostore"
	mgo "gopkg.in/mgo.v2"
)

type MongoStore interface {
	Store
}

func NewMongoStore(c *mgo.Collection, maxAge int, ensureTTL bool, keyPairs ...[]byte) MongoStore {
	store := mongostore.NewMongoStore(c, maxAge, ensureTTL, keyPairs...)

	return &mongoStore{store}
}

type mongoStore struct {
	*mongostore.MongoStore
}

func (c *mongoStore) Options(options Options) {
	c.MongoStore.Options = &sessions.Options{
		Path:     options.Path,
		Domain:   options.Domain,
		MaxAge:   options.MaxAge,
		Secure:   options.Secure,
		HttpOnly: options.HttpOnly,
	}
}
