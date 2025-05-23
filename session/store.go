package session

import "github.com/gorilla/sessions"

var Store = sessions.NewCookieStore([]byte("super-secretive-key"))

func init() {
	Store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   false,
	}
}
