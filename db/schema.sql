DROP TABLE IF EXISTS users;
CREATE TABLE users (
    uid INTEGER PRIMARY KEY,
    email VARCHAR(128),
    password VARCHAR(256),
    location VARCHAR(64)
);

INSERT INTO users (email, password, location)
VALUES ('admin', 'admin', 'admin');
