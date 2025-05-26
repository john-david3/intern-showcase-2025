package api

import (
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func Run() {
	mux := http.NewServeMux()

	// Authentication routes
	mux.HandleFunc("/api/signup", Signup)
	mux.HandleFunc("/api/login", Login)
	//mux.HandleFunc("/api/logout", Logout)

	// Groups
	mux.HandleFunc("/api/get_groups", GetGroups)
	mux.HandleFunc("/api/create_group", CreateGroup)

	handlerWithMiddleware := utils.CORSMiddleware(mux)

	slog.Info("server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", handlerWithMiddleware); err != nil {
		slog.Error("internal server error: ", "error", err)
	}
}
