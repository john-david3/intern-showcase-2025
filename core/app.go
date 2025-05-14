package core

import (
	"log/slog"
	"net/http"
)

func Run() {
	slog.Info("server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("internal server error: ", "error", err)
	}
}
