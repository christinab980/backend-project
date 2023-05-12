CREATE DATABASE login;

\c login

CREATE TABLE userPassword (username TEXT, password TEXT, gender VARCHAR(1));

INSERT INTO userPassword (username, password, gender) VALUES

('christina', 'password', 'f'),
('marcus', 'password', 'm');

SELECT * FROM userPassword;