package core

import (
	"encoding/json"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/session"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

	// Retrieve the users current session
	slog.Info("attempting to get groups")
	session, err := session.Store.Get(r, "session")
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting session", "group_loaded")
		return
	}
	fmt.Println(session.Values)

	// Retrieve the users groups
	err = db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "group_loaded")
		return
	}
	defer db.CloseConnection()

	userId := session.Values["user_id"]
	fmt.Println(userId)
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
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

	// In: name of group, optional description
	slog.Info("attempting to create group")
	body, err := utils.ReadData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading from frontend", "group_created")
		return
	}

	// Unmarshall the data
	groupData := make(map[string]string)
	err = json.Unmarshal(body, &groupData)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling json", "group_created")
		return
	}

	// Collect & check the data
	name := utils.Sanitise(groupData["name"])
	desc := utils.Sanitise(groupData["desc"])

	// Create a connection to the database
	err = db.CreateConnection()
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

	// Try to create the new group
	var groups []string
	for rows.Next() {
		groups, err = db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error converting groups", "group_created")
			return
		}
	}

	if groups != nil {
		slog.Info("group already exists")
		_ = json.NewEncoder(w).Encode(map[string]bool{"group_created": false})
		return
	}

	// Create the new group
	err = db.Execute("INSERT INTO groups(name, description) VALUES(?, ?);", name, desc)
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating group", "group_created")
		return
	}

	// Add the user to new group
	session, err := session.Store.Get(r, "session")
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting session", "group_created")
		return
	}

	err = db.Execute("INSERT INTO group_contains(uid, gid) VALUES(?, ?);", session.Values["user_id"], groups[0])
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating adding user to group", "group_created")
		return
	}

	slog.Info("group created")
	_ = json.NewEncoder(w).Encode(map[string]bool{"group_created": true})

}
