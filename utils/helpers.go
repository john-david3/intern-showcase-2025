package utils

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
)

func SendErrorResponse(w http.ResponseWriter, err error, message string, responseKey string) {
	slog.Error(message, "error", err)
	response := map[string]bool{"account_created": false}
	_ = json.NewEncoder(w).Encode(response)
}

func ReadData(body io.Reader) ([]byte, error) {
	res, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}
	return res, nil
}
