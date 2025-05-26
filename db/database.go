package db

import (
	"database/sql"
	"errors"
	"fmt"
	"log/slog"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func CreateConnection() error {
	var err error

	db, err = sql.Open("sqlite3", "../identifier.sqlite")

	return err
}

func Execute(query string, args ...interface{}) error {
	if db == nil {
		slog.Error("DB needs to be initialised before executed on")
		return errors.New("database not initialised")
	}
	_, err := db.Exec(query, args...)

	return err
}

func Fetch(query string, args ...interface{}) (*sql.Rows, error) {
	if db == nil {
		slog.Error("DB needs to be initialised before queried on")
		return nil, errors.New("database not initialised")
	}
	rows, err := db.Query(query, args...)

	return rows, err
}

func CloseConnection() {
	err := db.Close()
	if err != nil {
		slog.Error("Error closing database")
	}
}

func DBRowToStringList(rows *sql.Rows) ([]string, error) {
	var result []string

	cols, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	values := make([]interface{}, len(cols))
	valuePtrs := make([]interface{}, len(cols))

	for i := range values {
		valuePtrs[i] = &values[i]
	}

	if err = rows.Scan(valuePtrs...); err != nil {
		return nil, err
	}

	for _, val := range values {
		switch v := val.(type) {
		case nil:
			result = append(result, "NULL")
		case []byte:
			result = append(result, string(v))
		default:
			result = append(result, fmt.Sprint(v))
		}
	}
	return result, nil
}
