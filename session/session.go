package session

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"intern-showcase-2025/db"
	"net/http"
	"time"
)

func GenerateSession() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func GetSession(r *http.Request) (string, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return "", err
	}
	sessionId := cookie.Value

	var userId string
	var expiry time.Time

	rows, err := db.Fetch("SELECT uid, expires FROM session WHERE sid = ?;", sessionId)
	if err != nil {
		return "", err
	}

	var dataset []string
	for rows.Next() {
		dataset, err = db.DBRowToStringList(rows)
		if err != nil {
			return "", err
		}
	}
	expiry, err = time.Parse(time.RFC3339, dataset[1])
	if err != nil {
		return "", err
	}

	if expiry.Before(time.Now()) {
		return "", errors.New("session expired")
	}

	return userId, nil
}
