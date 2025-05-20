package core

import (
	"github.com/gorilla/sessions"
	"log/slog"
	"net/http"
)

var store = sessions.NewCookieStore([]byte("super-secretive-key"))

func Run() {
	// Authentication routes
	http.HandleFunc("/api/signup", signup)
	http.HandleFunc("/api/login", login)
	http.HandleFunc("/api/logout", logout)

	slog.Info("server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("internal server error: ", "error", err)
	}
}
