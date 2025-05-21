package core

import (
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

	// Retrieve the users current session
	slog.Info("attempting to get groups")
	session, err := store.Get(r, "session")
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting session")
		return
	}

	// Retrieve the users groups
	err = db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection")
		return
	}
	defer db.CloseConnection()

	user_id := session.Values["user_id"]
	rows, err := db.Fetch(`
				SELECT g.*
				FROM users AS u
				INNER JOIN group_contains AS gc 
				ON u.uid = gc.uid
				INNER JOIN groups AS g
				ON gc.gid = g.gid
				WHERE u.uid = ?`,
		user_id,
	)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting user")
		return
	}

	var groups []string
	for rows.Next() {
		groups, err = db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error getting user group")
			return
		}
	}
	fmt.Println(groups)

	// Send the results to the frontend to be displayed

}
