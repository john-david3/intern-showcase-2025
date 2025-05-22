-- users table --
INSERT INTO users (email, password, location)
VALUES ('admin', 'admin', 'admin');

SELECT * FROM users;


-- groups table --
INSERT INTO groups (name, description)
VALUES ('admin', 'group for admins');

INSERT INTO group_contains (uid, gid)
VALUES
    (1, 1),
    (2, 1)
;

SELECT * FROM users;
SELECT * FROM groups;
SELECT * FROM group_contains;

SELECT
    g.*
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
    u.uid = 2;
