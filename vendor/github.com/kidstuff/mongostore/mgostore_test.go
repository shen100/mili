// Copyright (c) 2013 Gregor Robinson.
// Copyright (c) 2013 Brian Jones.
// All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package mongostore

import (
	"encoding/gob"
	"github.com/gorilla/sessions"
	"gopkg.in/mgo.v2"
	"net/http"
	"net/http/httptest"
	"testing"
)

type FlashMessage struct {
	Type    int
	Message string
}

func TestMongoStore(t *testing.T) {
	var req *http.Request
	var rsp *httptest.ResponseRecorder
	var hdr http.Header
	var err error
	var ok bool
	var cookies []string
	var session *sessions.Session
	var flashes []interface{}

	// Copyright 2012 The Gorilla Authors. All rights reserved.
	// Use of this source code is governed by a BSD-style
	// license that can be found in the LICENSE file.

	// Round 1 ----------------------------------------------------------------
	dbsess, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer dbsess.Close()

	store := NewMongoStore(dbsess.DB("test").C("test_session"), 3600, true,
		[]byte("secret-key"))

	req, _ = http.NewRequest("GET", "http://localhost:8080/", nil)
	rsp = httptest.NewRecorder()
	// Get a session.
	if session, err = store.Get(req, "session-key"); err != nil {
		t.Fatalf("Error getting session: %v", err)
	}
	// Get a flash.
	flashes = session.Flashes()
	if len(flashes) != 0 {
		t.Errorf("Expected empty flashes; Got %v", flashes)
	}
	// Add some flashes.
	session.AddFlash("foo")
	session.AddFlash("bar")
	// Custom key.
	session.AddFlash("baz", "custom_key")
	// Save.
	if err = sessions.Save(req, rsp); err != nil {
		t.Fatalf("Error saving session: %v", err)
	}
	hdr = rsp.Header()
	cookies, ok = hdr["Set-Cookie"]
	if !ok || len(cookies) != 1 {
		t.Fatalf("No cookies. Header:", hdr)
	}

	// Round 2 ----------------------------------------------------------------

	req, _ = http.NewRequest("GET", "http://localhost:8080/", nil)
	req.Header.Add("Cookie", cookies[0])
	rsp = httptest.NewRecorder()
	// Get a session.
	if session, err = store.Get(req, "session-key"); err != nil {
		t.Fatalf("Error getting session: %v", err)
	}
	// Check all saved values.
	flashes = session.Flashes()
	if len(flashes) != 2 {
		t.Fatalf("Expected flashes; Got %v", flashes)
	}
	if flashes[0] != "foo" || flashes[1] != "bar" {
		t.Errorf("Expected foo,bar; Got %v", flashes)
	}
	flashes = session.Flashes()
	if len(flashes) != 0 {
		t.Errorf("Expected dumped flashes; Got %v", flashes)
	}
	// Custom key.
	flashes = session.Flashes("custom_key")
	if len(flashes) != 1 {
		t.Errorf("Expected flashes; Got %v", flashes)
	} else if flashes[0] != "baz" {
		t.Errorf("Expected baz; Got %v", flashes)
	}
	flashes = session.Flashes("custom_key")
	if len(flashes) != 0 {
		t.Errorf("Expected dumped flashes; Got %v", flashes)
	}

	session.Options.MaxAge = -1
	// Save.
	if err = sessions.Save(req, rsp); err != nil {
		t.Fatalf("Error saving session: %v", err)
	}

	// Round 3 ----------------------------------------------------------------
	// Custom type

	req, _ = http.NewRequest("GET", "http://localhost:8080/", nil)
	rsp = httptest.NewRecorder()
	// Get a session.
	if session, err = store.Get(req, "session-key"); err != nil {
		t.Fatalf("Error getting session: %v", err)
	}
	// Get a flash.
	flashes = session.Flashes()
	if len(flashes) != 0 {
		t.Errorf("Expected empty flashes; Got %v", flashes)
	}
	// Add some flashes.
	session.AddFlash(&FlashMessage{42, "foo"})
	// Save.
	if err = sessions.Save(req, rsp); err != nil {
		t.Fatalf("Error saving session: %v", err)
	}
	hdr = rsp.Header()
	cookies, ok = hdr["Set-Cookie"]
	if !ok || len(cookies) != 1 {
		t.Fatalf("No cookies. Header:", hdr)
	}

	// Round 4 ----------------------------------------------------------------
	// Custom type

	req, _ = http.NewRequest("GET", "http://localhost:8080/", nil)
	req.Header.Add("Cookie", cookies[0])
	rsp = httptest.NewRecorder()
	// Get a session.
	if session, err = store.Get(req, "session-key"); err != nil {
		t.Fatalf("Error getting session: %v", err)
	}
	// Check all saved values.
	flashes = session.Flashes()
	if len(flashes) != 1 {
		t.Fatalf("Expected flashes; Got %v", flashes)
	}
	custom := flashes[0].(FlashMessage)
	if custom.Type != 42 || custom.Message != "foo" {
		t.Errorf("Expected %#v, got %#v", FlashMessage{42, "foo"}, custom)
	}

	// Delete session.
	session.Options.MaxAge = -1
	// Save.
	if err = sessions.Save(req, rsp); err != nil {
		t.Fatalf("Error saving session: %v", err)
	}
}

func init() {
	gob.Register(FlashMessage{})
}
