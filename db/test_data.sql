-- users table --
INSERT INTO users (email, password, location)
VALUES ('admin', 'admin', 'admin');

SELECT * FROM users;


-- groups table --
INSERT INTO groups (name, description, code)
VALUES ('admin', 'group for admins', '00000000');

INSERT INTO groups (name, description, code)
VALUES ('wow', 'what a great group', '00000001');

INSERT INTO group_contains (uid, gid)
VALUES
    (1, 1),
    (2, 1)
;

SELECT * FROM users;
SELECT * FROM groups;
SELECT * FROM group_contains;
SELECT * FROM session;

SELECT gid FROM group_contains WHERE uid = 2;

SELECT
    g.name, g.description
FROM
    users AS u
INNER JOIN
        group_contains AS gc
ON
    u.uid = gc.uid
INNER JOIN
        groups AS g
ON
    gc.gid = g.gid
WHERE
    u.uid = 3;
