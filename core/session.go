package core

import (
	"encoding/json"
	"errors"
	"intern-showcase-2025/utils"
	"net/http"
)

var AuthError = errors.New("unauthorized")

func Authorize(r *http.Request) error {
	body, err := utils.ReadData(r.Body)
	if err != nil {
		return err
	}

	data := make(map[string]string)
	err = json.Unmarshal(body, &data)
	if err != nil {
		return err
	}

	email := data["email"]
	user, ok := users[email]
	if !ok {
		return AuthError
	}

	token, err := r.Cookie("session_token")
	if err != nil || token.Value == "" || token.Value != user.SessionToken {
		return AuthError
	}

	csrf := r.Header.Get("X-CSRF-TOKEN")
	if csrf != user.CSRFToken || csrf == "" {
		return AuthError
	}

	return nil
}
