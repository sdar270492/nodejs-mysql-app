CREATE DATABASE IF NOT EXISTS database_links;

use database_links;

CREATE TABLE IF NOT EXISTS users (
    id int(11) NOT NULL,
    username varchar(16) NOT NULL,
    password varchar(60) NOT NULL,
    fullname varchar(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

DESCRIBE users;        

CREATE TABLE IF NOT EXISTS links (
    id int(11) NOT NULL,
    title varchar(150) NOT NULL,
    url varchar(255) NOT NULL,
    description text,
    user_id int(11),
    created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
    constraint fk_users foreign key (user_id) REFERENCES users(id)
);

ALTER TABLE links
    ADD PRIMARY KEY (id);

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;    

DESCRIBE links;       