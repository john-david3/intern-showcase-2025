package utils

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func SendErrorResponse(w http.ResponseWriter, err error, message string) {
	slog.Error(message, "error", err)
	response := map[string]bool{"account_created": false}
	_ = json.NewEncoder(w).Encode(response)
}
