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

	// Groups
	mux.HandleFunc("/api/get_groups", GetGroups)
	mux.HandleFunc("/api/create_group", CreateGroup)
	mux.HandleFunc("/api/join_group", JoinGroup)
	mux.HandleFunc("/api/join_random_group", JoinRandomGroup)

	// Group information
	mux.HandleFunc("/api/wheel_info", GetOptions)
	mux.HandleFunc("/api/get_group_info", GetGroupInfo)

	// Chat
	mux.HandleFunc("/api/get_user_info", GetUserInfo)

	handlerWithMiddleware := utils.CORSMiddleware(mux)

	slog.Info("server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", handlerWithMiddleware); err != nil {
		slog.Error("internal server error: ", "error", err)
	}
}
