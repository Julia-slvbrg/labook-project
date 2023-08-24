-- Active: 1690424282290@@127.0.0.1@3306
CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    user_role VARCHAR(6) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);
DROP TABLE users;

CREATE TABLE IF NOT EXISTS posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);

DROP TABLE posts;

CREATE TABLE IF NOT EXISTS likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO users(id, name, email, password, user_role)
VALUES  ('u001', 'Ana Catarina', 'titi@gmail.com', 'titi123!', 'ADMIN'),
        ('u002', 'Gabo Gabolino', 'gabo@gmail.com', 'gabo123!', 'USER');

DROP TABLE likes_dislikes;
DROP TABLE posts;
DROP TABLE users;

UPDATE users
SET user_role = 'ADMIN'
WHERE id = 'b9214f03-b656-4367-b244-f8e348ded26e';