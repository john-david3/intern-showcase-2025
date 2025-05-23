package utils

import (
	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/bcrypt"
	"log/slog"
)

func HashData(data string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(data), bcrypt.MinCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		slog.Error("failed to generate token", "error", err)
	}
	return base64.URLEncoding.EncodeToString(bytes)
}
