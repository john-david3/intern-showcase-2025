-- users table --
INSERT INTO users (email, password, fname, lname, location)
VALUES ('admin', 'admin', 'admin', 'admin', 'admin');

SELECT * FROM users;


-- groups table --
INSERT INTO groups (name, description, code)
VALUES ('admin', 'group for admins', '00000000');

INSERT INTO groups (name, description, code)
VALUES ('wow', 'what a great group', '00000001');

INSERT INTO groups (name, description, code, isRandom)
VALUES ('random group', 'this is a random group', 63958371, 1);

INSERT INTO group_contains (uid, gid)
VALUES
    (1, 1),
    (4, 1)
;

SELECT * FROM users;
SELECT * FROM groups;
SELECT * FROM group_contains;
SELECT * FROM session;
SELECT * FROM wheel_options;

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
    u.uid = 2;


-- DA WHEEL --
SELECT w.option
FROM
    groups AS g
INNER JOIN
    group_wheel AS gw
ON
    g.gid = gw.gid
INNER JOIN
    wheel_options AS w
ON
    gw.wid = w.wid
WHERE
    g.gid = 1;

-- offices --
INSERT INTO offices (region, office_name)
VALUES
    ('Americas','Seattle, WA Corporate HQ'),
    ('APCJ','Australia'),
    ('APCJ','India, Bangalore Office'),
    ('EMEA','Spain, Barcelona Office'),
    ('Americas','Boulder, Colorado Office'),
    ('Americas','Brazil'),
    ('EMEA','UK, Chertsey Office'),
    ('APCJ','China Office'),
    ('EMEA','Czech Republic'),
    ('EMEA','France'),
    ('EMEA','Germany'),
    ('APCJ','India, Hyderabad Office'),
    ('EMEA','Ireland, Cork Office'),
    ('EMEA','Israel'),
    ('EMEA','Italy'),
    ('APCJ','Japan, Tokyo Office'),
    ('EMEA','UK, London Office'),
    ('EMEA','Spain, Madrid Office'),
    ('APCJ','Malaysia'),
    ('Americas','Mexico'),
    ('APCJ','India, Mumbai Office'),
    ('EMEA','Netherlands'),
    ('APCJ','India, New Delhi Office'),
    ('APCJ','New Zealand'),
    ('APCJ','Philippines'),
    ('EMEA','Poland'),
    ('EMEA','Qatar'),
    ('Americas','San Jose, California Office'),
    ('APCJ','Singapore'),
    ('APCJ','South Korea'),
    ('APCJ','Thailand'),
    ('Americas','Toronto, Ontario'),
    ('EMEA','UAE'),
    ('APCJ','Vietnam');