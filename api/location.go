package api

import (
	"encoding/json"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"net/http"
)

type Office struct {
	ID         int    `json:"id"`
	Region     string `json:"region"`
	Officename string `json:"officename"`
}

func GetOffices(w http.ResponseWriter, r *http.Request) {

	// Retrieve the office locations
	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "offices_loaded")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT * FROM offices")
	defer rows.Close()

	if err != nil {
		utils.SendErrorResponse(w, err, "error getting office locations", "offices_loaded")
		return
	}

	var offices []Office
	for rows.Next() {
		var office Office
		err := rows.Scan(&office.ID, &office.Region, &office.Officename)
		if err != nil {
			utils.SendErrorResponse(w, err, "error getting office data", "offices_loaded")
			return
		}
		offices = append(offices, office)
	}

	// Send the results to the frontend to be displayed
	jsonMap, err := json.Marshal(offices)
	if err != nil {
		utils.SendErrorResponse(w, err, "error getting group data", "offices_loaded")
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonMap)
}

func UpdateUserLocation(w http.ResponseWriter, r *http.Request) {

	var payload struct {
		UserID   int `json:"user_id"`
		OfficeID int `json:"office_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.SendErrorResponse(w, err, "invalid payload", "user_updated")
		return
	}

	statement := `UPDATE users SET location = ? WHERE uid = ?`
	err := db.Execute(statement, payload.OfficeID, payload.UserID)
	if err != nil {
		utils.SendErrorResponse(w, err, "invalid payload", "user_updated")
		return
	}

	w.WriteHeader(http.StatusOK)
}
