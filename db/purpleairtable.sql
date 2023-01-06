CREATE TABLE purpleair (
    reading_id INTEGER PRIMARY KEY,
    location TEXT NOT NULL,
    pm_1 REAL NOT NULL,
    pm_25 REAL NOT NULL,
    pm_10 REAL NOT NULL,
    pm_25_cf REAL NOT NULL,
    humidity INTEGER NOT NULL,
    lastseen INTEGER NOT NULL,
    um_03 REAL NOT NULL,
    um_05 REAL NOT NULL,
    um_1 REAL NOT NULL,
    um_25 REAL NOT NULL,
    um_5 REAL NOT NULL,
    um_10 REAL NOT NULL
);