package core

import (
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid request method", err)
		return
	}

	// Retrieve the users current session
	slog.Info("attempting to get groups")
	userId := r.Header.Get("X-User-ID")
	if userId == "" {
		utils.SendErrorResponse(w, fmt.Errorf("missing user_id"), "missing user ID from header", "group_loaded")
		return
	}

	// Retrieve the users groups
	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "group_loaded")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch(`
				SELECT g.*
				FROM users AS u
				INNER JOIN group_contains AS gc
				ON u.uid = gc.uid
				INNER JOIN groups AS g
				ON gc.gid = g.gid
				WHERE u.uid = ?;`,
		userId,
	)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting user", "group_loaded")
		return
	}

	var groups []string
	for rows.Next() {
		groups, err = db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error getting user group", "group_loaded")
			return
		}
	}
	fmt.Println(groups)

	// Send the results to the frontend to be displayed

}

func CreateGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
		return
	}

	// In: name of group, optional description
	slog.Info("attempting to create group")

	// Collect & check the data
	name := r.FormValue("name")
	desc := r.FormValue("desc")

	userId := r.Header.Get("X-User-ID")
	if userId == "" {
		utils.SendErrorResponse(w, fmt.Errorf("missing user_id"), "missing user ID from header", "group_loaded")
		return
	}

	// Create a connection to the database
	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "group_created")
		return
	}
	defer db.CloseConnection()

	// Check if the group already exists
	rows, err := db.Fetch("SELECT gid FROM groups WHERE name = ?;", name)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "group_created")
		return
	}

	var groups []string
	for rows.Next() {
		groups, err = db.DBRowToStringList(rows)
		if err != nil || len(groups) == 0 {
			utils.SendErrorResponse(w, err, "error converting groups", "group_created")
			return
		}
	}

	fmt.Println(groups)
	if len(groups) > 0 {
		utils.SendErrorResponse(w, fmt.Errorf("group already exists found"), "no groups found", "group_created")
		return
	}

	// Create the new group
	err = db.Execute("INSERT INTO groups(name, description) VALUES(?, ?);", name, desc)
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating group", "group_created")
		return
	}

	rows, err = db.Fetch("SELECT gid FROM groups WHERE name = ?;", name)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "group_created")
		return
	}

	for rows.Next() {
		groups, err = db.DBRowToStringList(rows)
		if err != nil || len(groups) == 0 {
			utils.SendErrorResponse(w, err, "error converting groups", "group_created")
			return
		}
	}

	err = db.Execute("INSERT INTO group_contains(uid, gid) VALUES(?, ?);", userId, groups[0])
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating adding user to group", "group_created")
		return
	}

	res := `{"message": "Group created"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
	slog.Info("group created")
}
