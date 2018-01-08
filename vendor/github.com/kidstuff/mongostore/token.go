package mongostore

import (
	"github.com/gorilla/sessions"
	"net/http"
)

type TokenGetSeter interface {
	GetToken(req *http.Request, name string) (string, error)
	SetToken(rw http.ResponseWriter, name, value string, options *sessions.Options)
}

type CookieToken struct{}

func (c *CookieToken) GetToken(req *http.Request, name string) (string, error) {
	cook, err := req.Cookie(name)
	if err != nil {
		return "", err
	}

	return cook.Value, nil
}

func (c *CookieToken) SetToken(rw http.ResponseWriter, name, value string,
	options *sessions.Options) {
	http.SetCookie(rw, sessions.NewCookie(name, value, options))
}
