package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"math/rand"
	"net/http"
	"time"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

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
				SELECT g.gid, g.name, g.description
				FROM users AS u
				INNER JOIN group_contains AS gc
				ON u.uid = gc.uid
				INNER JOIN groups AS g
				ON gc.gid = g.gid
				WHERE u.uid = ?;`,
		userId,
	)
	defer rows.Close()

	if err != nil {
		utils.SendErrorResponse(w, err, "error getting user", "group_loaded")
		return
	}

	var groups [][]string
	for rows.Next() {
		group, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error getting user group", "group_loaded")
			return
		}
		groups = append(groups, group)
	}
	fmt.Println(groups)

	// Send the results to the frontend to be displayed
	groupMap := map[string][]string{}
	for _, group := range groups {
		key := "group_" + group[0]
		groupMap[key] = group
	}

	jsonMap, err := json.Marshal(groupMap)
	w.Write(jsonMap)
}

func CreateGroup(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	// In: name of group, optional description
	slog.Info("attempting to create group")

	// Collect & check the data
	name := r.FormValue("name")
	desc := r.FormValue("desc")
	isRandom := r.FormValue("is_random")

	fmt.Println(isRandom)

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

	// Generate a unique 8 digit code
	code, err := utils.GenerateCode(false)
	if err != nil {
		utils.SendErrorResponse(w, err, "error generating code", "group_created")
		return
	}

	// Create the new group
	err = db.Execute("INSERT INTO groups(name, description, code, isRandom) VALUES(?, ?, ?, ?);", name, desc, code, isRandom)
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating group", "group_created")
		return
	}

	fmt.Println("isRandom: ", isRandom)
	if isRandom == "on" {
		expiration := time.Now()
		db.Execute("UPDATE groups SET expiration = ? WHERE name = ?;", expiration, name)
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

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"group_created": "true"}`))
	slog.Info("group created")
}

func JoinGroup(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	slog.Info("attempting to join group")
	code := r.FormValue("code")
	userId := r.Header.Get("X-User-ID")

	// Check group exists
	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "joined_group")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT gid FROM groups WHERE code = ?;", code)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "joined_group")
		return
	}

	var groups [][]string
	for rows.Next() {
		group, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error converting groups", "joined_group")
			return
		}
		groups = append(groups, group)
	}

	if len(groups) != 1 {
		utils.SendErrorResponse(w, fmt.Errorf("group not found"), "none or too many groups found", "joined_group")
		return
	}

	// Check is user is already in the group
	rows, err = db.Fetch("SELECT gid FROM group_contains WHERE uid = ? AND gid = ?;", userId, groups[0][0])
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "joined_group")
		return
	}

	var isExist [][]string
	for rows.Next() {
		ok, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error converting groups", "joined_group")
			return
		}
		isExist = append(isExist, ok)
	}

	if len(isExist) > 0 {
		utils.SendErrorResponse(w, fmt.Errorf("user in group"), "user already in group", "joined_group")
		return
	}

	// Add the user to the group
	err = db.Execute(`INSERT INTO group_contains(uid, gid) VALUES(?, ?);`, userId, groups[0][0])
	if err != nil {
		utils.SendErrorResponse(w, err, "error joining group", "joined_group")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"joined_group": "true"}`))
	slog.Info("group joined", "group", groups[0][0])

}

func JoinRandomGroup(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	slog.Info("attempting to join random group")
	userId := r.Header.Get("X-User-ID")

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "joined_group")
		return
	}
	defer db.CloseConnection()

	// Get all the random groups
	rows, err := db.Fetch("SELECT gid FROM groups WHERE isRandom = 1;")
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "joined_group")
		return
	}

	var groups [][]string
	for rows.Next() {
		group, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error converting groups", "joined_group")
			return
		}
		groups = append(groups, group)
	}

	fmt.Println("Random Groups: ", groups, len(groups))
	if len(groups) == 0 {
		utils.SendErrorResponse(w, fmt.Errorf("no groups found"), "no groups found", "joined_group")
		return
	}

	found := false
	var randIndex int
	counter := -1

	for !found && counter < len(groups) {
		counter++
		randIndex = rand.Intn(len(groups))

		rows, err = db.Fetch("SELECT gid FROM group_contains WHERE uid = ? AND gid = ?;", userId, groups[randIndex][0])
		if err != nil {
			utils.SendErrorResponse(w, err, "error getting group", "joined_group")
			return
		}

		var isExist [][]string
		for rows.Next() {
			ok, err := db.DBRowToStringList(rows)
			if err != nil {
				utils.SendErrorResponse(w, err, "error converting groups", "joined_group")
				return
			}
			isExist = append(isExist, ok)
		}

		if len(isExist) > 0 {
			continue
		}

		found = true
	}

	// Add the user to the group
	err = db.Execute(`INSERT INTO group_contains(uid, gid) VALUES(?, ?);`, userId, groups[randIndex][0])
	if err != nil || counter >= len(groups) {
		utils.SendErrorResponse(w, err, "error joining group", "joined_group")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"joined_group": "true"}`))
	slog.Info("group joined", "group", groups[randIndex][0])

}

func AddDefaultGroup(email, defaultGroup string) bool {
	slog.Info("attempting to add default group")
	err := db.CreateConnection()
	if err != nil {
		slog.Error("error creating connection")
		return false
	}
	defer db.CloseConnection()

	// Check if office group already exists
	groups, err := fetchGroups(defaultGroup)
	if err != nil {
		slog.Error("error fetching groups")
		return false
	}

	// If not create it, and then add the user to that group
	if len(groups) == 0 {
		desc := "Group for " + defaultGroup + " office"
		code, err := utils.GenerateCode(false)
		if err != nil {
			slog.Error("error generating code")
			return false
		}

		err = db.Execute(
			"INSERT INTO groups(name, description, code, isRandom) VALUES(?, ?, ?, ?);",
			defaultGroup, desc, code, false,
		)
		if err != nil {
			slog.Error("error inserting default group")
			return false
		}
	}

	// If it does, add the user to that group
	groups, err = fetchGroups(defaultGroup)
	if err != nil {
		return false
	}

	users, err := fetchUserId(email)
	if err != nil {
		return false
	}

	err = db.Execute("INSERT INTO group_contains(uid, gid) VALUES(?, ?);", users[0][0], groups[0][0])
	if err != nil {
		slog.Error("error inserting default group")
		return false
	}

	slog.Info("default group has been added")
	return true
}

func GetGroupInfo(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	// Retrieve the users current session
	slog.Info("attempting to get group info")
	userId := r.Header.Get("X-User-ID")
	if userId == "" {
		utils.SendErrorResponse(w, fmt.Errorf("missing user_id"), "missing user ID from header", "group_loaded")
		return
	}
	groupId := r.FormValue("group_id")

	// Retrieve the users groups
	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "group_loaded")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch(`
				SELECT name, description, code
				FROM groups
				WHERE gid = ?;`,
		groupId,
	)
	defer rows.Close()

	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group", "group_loaded")
		return
	}

	var groups [][]string
	for rows.Next() {
		group, err := db.DBRowToStringList(rows)
		if err != nil || len(group) == 0 {
			utils.SendErrorResponse(w, err, "error converting groups", "group_loaded")
			return
		}
		groups = append(groups, group)
	}

	groupMap := map[string][]string{}
	groupMap["data"] = groups[0]

	jsonMap, err := json.Marshal(groupMap)
	w.Write(jsonMap)
}

func fetchGroups(defaultGroup string) ([][]string, error) {
	rows, err := db.Fetch("SELECT gid FROM groups WHERE name = ?;", defaultGroup)
	if err != nil {
		return nil, errors.New("error getting groups")
	}

	var groups [][]string
	for rows.Next() {
		group, err := db.DBRowToStringList(rows)
		if err != nil {
			return nil, errors.New("error converting groups")
		}
		groups = append(groups, group)
	}

	return groups, nil
}

func fetchUserId(email string) ([][]string, error) {
	rows, err := db.Fetch("SELECT uid FROM users WHERE email = ?;", email)
	if err != nil {
		return nil, errors.New("error getting user")
	}

	var users [][]string
	for rows.Next() {
		user, err := db.DBRowToStringList(rows)
		if err != nil {
			return nil, errors.New("error converting groups")
		}
		users = append(users, user)
	}

	return users, nil
}
