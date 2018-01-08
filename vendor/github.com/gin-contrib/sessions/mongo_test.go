package sessions

import (
	"testing"

	mgo "gopkg.in/mgo.v2"
)

const mongoTestServer = "localhost:27017"

var newMongoStore = func(_ *testing.T) Store {
	session, err := mgo.Dial(mongoTestServer)
	if err != nil {
		panic(err)
	}

	c := session.DB("test").C("sessions")
	return NewMongoStore(c, 3600, true, []byte("secret"))
}

func TestMongo_SessionGetSet(t *testing.T) {
	sessionGetSet(t, newMongoStore)
}

func TestMongo_SessionDeleteKey(t *testing.T) {
	sessionDeleteKey(t, newMongoStore)
}

func TestMongo_SessionFlashes(t *testing.T) {
	sessionFlashes(t, newMongoStore)
}

func TestMongo_SessionClear(t *testing.T) {
	sessionClear(t, newMongoStore)
}

func TestMongo_SessionOptions(t *testing.T) {
	sessionOptions(t, newMongoStore)
}
