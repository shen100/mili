package gsm

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"testing"
)

func TestStubMain(t *testing.T) {

	sessionStore := NewDumbMemorySessionStore()

	http.HandleFunc("/testdumb", func(w http.ResponseWriter, r *http.Request) {
		// fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))

		session, _ := sessionStore.Get(r, "example")

		storeval := r.FormValue("store")
		if len(storeval) > 0 {
			session.Values["thevalue"] = storeval
		} else {
			storeval, _ = session.Values["thevalue"].(string)
		}

		err := session.Save(r, w)
		if err != nil {
			fmt.Printf("Error while saving session: %v\n", err)
		}

		fmt.Fprintf(w, "%s", storeval)

	})

	// run the server
	go http.ListenAndServe(":18210", nil)

	// now do some tests as a client make sure things work as expected

	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}
	httpClient := &http.Client{
		Jar: jar,
	}

	doReq := func(u string) string {
		resp, err := httpClient.Get(u)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()
		b, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			panic(err)

		}

		fmt.Printf("Got Set-Cookie: %s\n", resp.Header.Get("Set-Cookie"))

		return string(b)
	}

	v := doReq("http://localhost:18210/testdumb?store=blah")
	if v != "blah" {
		t.Fatalf("Expected v=blah but got v='%s'\n", v)
	}

	v = doReq("http://localhost:18210/testdumb")
	if v != "blah" {
		t.Fatalf("Expected session to give us v=blah but got v='%s'\n", v)
	}

}

func TestStubHeaderStorer(t *testing.T) {
	headerName := "X-TEST-HEADER"
	headerStorer := &HeaderStorer{HeaderFieldName: headerName}

	sessionStore := NewDumbMemorySessionStoreWithValueStorer(headerStorer)

	http.HandleFunc("/testdumbHeaderStorer", func(w http.ResponseWriter, r *http.Request) {
		// fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))

		session, _ := sessionStore.Get(r, "example")

		storeval := r.FormValue("store")
		if len(storeval) > 0 {
			session.Values["thevalue"] = storeval
		} else {
			storeval, _ = session.Values["thevalue"].(string)
		}

		err := session.Save(r, w)
		if err != nil {
			fmt.Printf("Error while saving session: %v\n", err)
		}

		fmt.Fprintf(w, "%s", storeval)

	})

	// run the server
	go http.ListenAndServe(":18210", nil)

	// now do some tests as a client make sure things work as expected
	httpClient := &http.Client{}

	doReq := func(req *http.Request) (string, string, string) {
		resp, err := httpClient.Do(req)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()
		b, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			panic(err)

		}

		value := resp.Header.Get(headerName)
		fmt.Printf("Got %s: %s\n", headerName, value)

		return string(b), headerName, value
	}

	// the first request should return a headerKey and headerValue, which contain a securely encrypted sessionID.
	// subsequent requests should sent this sessionID along so the server can fetch the session from the memcache store.
	req, _ := http.NewRequest("GET", "http://localhost:18210/testdumbHeaderStorer?store=blah", nil)
	v, headerKey, headerValue := doReq(req)
	if v != "blah" {
		t.Fatalf("Expected v=blah but got v='%s'\n", v)
	}

	req, _ = http.NewRequest("GET", "http://localhost:18210/testdumbHeaderStorer", nil)
	// sent header along with secure sessionID
	req.Header.Add(headerKey, headerValue)
	v, _, _ = doReq(req)
	if v != "blah" {
		t.Fatalf("Expected session to give us v=blah but got v='%s'\n", v)
	}

}
