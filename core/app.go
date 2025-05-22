package core

import (
	"github.com/gorilla/sessions"
	"log/slog"
	"net/http"
)

var store = sessions.NewCookieStore([]byte("super-secretive-key"))

func Run() {
	// Authentication routes
	http.HandleFunc("/api/signup", Signup)
	http.HandleFunc("/api/login", Login)
	http.HandleFunc("/api/logout", Logout)

	// Groups
	http.HandleFunc("/api/get_groups", GetGroups)
	http.HandleFunc("/api/create_group", CreateGroup)

	slog.Info("server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("internal server error: ", "error", err)
	}
}
