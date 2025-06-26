DROP TABLE IF EXISTS users;
CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(128) NOT NULL,
    fname VARCHAR(64) NOT NULL,
    lname VARCHAR(64) NOT NULL,
    password VARCHAR(256) NOT NULL,
    location VARCHAR(64) NOT NULL
);

DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    gid INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(32) NOT NULL,
    description TEXT,
    code VARCHAR(8) NOT NULL,
    isRandom BOOLEAN DEFAULT 0,
    expiration DATETIME DEFAULT NULL
);

DROP TABLE IF EXISTS group_contains;
CREATE TABLE group_contains(
    uid INTEGER,
    gid INTEGER
);

DROP TABLE IF EXISTS session;
CREATE TABLE session (
    sid VARCHAR(64),
    data TEXT,
    expires DATETIME,
    uid INTEGER REFERENCES users(uid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS group_wheel;
CREATE TABLE group_wheel (
    gid INTEGER REFERENCES groups(gid) ON DELETE CASCADE ON UPDATE CASCADE,
    wid INTEGER REFERENCES wheel_options(wid) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS wheel_options;
CREATE TABLE wheel_options(
    wid INTEGER,
    option VARCHAR(64)
);

DROP TABLE IF EXISTS offices;
CREATE TABLE offices (
    office_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    region          TEXT NOT NULL CHECK(region IN ('Americas', 'EMEA', 'Asia')),
    office_name     TEXT NOT NULL,
    address         TEXT NOT NULL,
    city            TEXT NOT NULL,
    country         TEXT NOT NULL,
    postcode        TEXT NOT NULL,
    picture         TEXT NOT NULL
);
