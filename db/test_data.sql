-- users table --
INSERT INTO users (email, password, location)
VALUES ('admin', 'admin', 'admin');

SELECT * FROM users;


-- groups table --
INSERT INTO groups (name, description)
VALUES ('admin', 'group for admins');

INSERT INTO group_contains (uid, gid)
VALUES (1, 1);

SELECT * FROM groups;
SELECT * FROM group_contains;

