package api

import (
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetEmail(w http.ResponseWriter, r *http.Request) {
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
	rows, err := db.Fetch("SELECT email FROM users WHERE uid = ?", user_id)
	if err != nil {
		utils.SendErrorResponse(w, err, "error fetching user", "got_email")
		return
	}

	var emails [][]string
	for rows.Next() {
		email, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error fetching user", "got_email")
			return
		}
		emails = append(emails, email)
	}

	email := emails[0][0]
	w.Write([]byte(email))
	slog.Info("email found", "email", email)
}
