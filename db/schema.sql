DROP TABLE IF EXISTS users;
CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(128),
    password VARCHAR(256),
    firstname VARCHAR(32),
    lastname VARCHAR(32),
    location VARCHAR(64)
);

INSERT INTO users (email, password, firstname, lastname, location)
VALUES ('admin', 'admin', 'admin', 'admin', 'admin');

SELECT * FROM users;