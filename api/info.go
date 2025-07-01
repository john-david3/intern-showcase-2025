package api

import (
	"encoding/json"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetProfileInfo(w http.ResponseWriter, r *http.Request) {
	slog.Info("Trying to get profile information")
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
	}

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "got_email")
		return
	}
	defer db.CloseConnection()

	userId := r.Header.Get("X-User-ID")
	rows, err := db.Fetch("SELECT fname, lname, email, location FROM users WHERE uid = ?", userId)
	if err != nil {
		utils.SendErrorResponse(w, err, "error fetching user", "got_info")
		return
	}

	var details [][]string
	for rows.Next() {
		detail, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error fetching user", "got_info")
			return
		}
		details = append(details, detail)
	}

	profileInfo := details[0]
	slog.Info("getting da news")
	fmt.Println(details)
	slog.Info("got da news")
	msg := map[string]string{
		"fname":    profileInfo[0],
		"lname":    profileInfo[1],
		"email":    profileInfo[2],
		"location": profileInfo[3],
	}
	msgMap, _ := json.Marshal(msg)
	w.Write(msgMap)
	slog.Info("user found", "user", userId)
}

func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	slog.Info("Trying to get email")
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
	}

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "got_email")
		return
	}
	defer db.CloseConnection()

	user_id := r.Header.Get("X-User-ID")
	rows, err := db.Fetch("SELECT fname, lname FROM users WHERE uid = ?", user_id)
	if err != nil {
		utils.SendErrorResponse(w, err, "error fetching user", "got_email")
		return
	}

	var details [][]string
	for rows.Next() {
		detail, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error fetching user", "got_email")
			return
		}
		details = append(details, detail)
	}

	username := details[0]
	msg := map[string]string{"fname": username[0], "lname": username[1]}
	msgMap, _ := json.Marshal(msg)
	w.Write(msgMap)
	slog.Info("user found", "user", username[0])
}
