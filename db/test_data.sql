-- users table --
INSERT INTO users (name, email, password, location)
VALUES ('admin', 'admin', 'admin', 'admin');

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
INSERT INTO offices (region, office_name, address, city, country, postcode, picture)
VALUES
    (
    'Americas',
    'Seattle, WA Corporate HQ',
    '801 5th Ave',
    'Seattle',
    'United States',
    'WA 98104',
    'seattleoffice.jpeg'
    ),
    (
    'Americas',
     'Washington, DC',
     '11921 Freedom Dr. Suite 710',
     'Reston',
     'United State',
     ' VA 20190',
     'img.jpg'
    ),
    (
    'Americas',
    'Toronto, ON, Canada',
        'First Canadian Place, 100 King Street West, Suite 56000',
    'Toronto',
    'Canada',
    'ONM5X 1C9',
    'img.jpg'
    )
        ,
    (
    'Americas',
    'Spokane, WA',
    '23321 E Knox Ave',
    'Liberty Lake',
    'United States',
    'WA 99019',
    'img.jpg'
    ),
    (
    'EMEA',
    'NGINX Ireland',
    '3/F, 89/90 South Mall',
    'Cork',
    'Ireland',
    'T12KXV9',
    'nginxIreland.jpeg'
    );