package utils

import (
	"fmt"
	"intern-showcase-2025/db"
	"log/slog"
	"math/rand"
	"net/http"
	"strconv"
)

func SendErrorResponse(w http.ResponseWriter, err error, message string, responseKey string) {
	slog.Error(message, "error", err)
	response := fmt.Sprintf(`{"message": "%s"}`, responseKey)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(response))
}

func GenerateCode() (string, error) {
	low := 10000000
	high := 99999999
	var code string
	codeNotExist := false
	var exists []string

	err := db.CreateConnection()
	if err != nil {
		return "", err
	}
	defer db.CloseConnection()

	for codeNotExist == false {
		code = strconv.Itoa(rand.Intn(high - low))

		rows, err := db.Fetch("SELECT code FROM groups WHERE code = ?;", code)
		if err != nil {
			return "", err
		}

		for rows.Next() {
			exists, err = db.DBRowToStringList(rows)
			if err != nil {
				return "", err
			}
		}

		if len(exists) != 0 {
			continue
		}

		codeNotExist = true
	}

	return code, nil

}
