CREATE DATABASE dunedinhouse;

USE dunedinhouse;

CREATE TABLE IF NOT EXISTS Users (
	id varchar(255) NOT NULL,
    username varchar(255) NOT NULL, 
    saltone varchar(255) NOT NULL, 
    salttwo varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    firstname varchar(255),
    lastname varchar(255),
    PRIMARY KEY (id, username),
    UNIQUE (username)
 );
 
 
 CREATE TABLE IF NOT EXISTS Bills (
	id varchar(255) NOT NULL,
    duedate datetime NOT NULL, 
	type varchar(255) NOT NULL,
    currency varchar(255), 
    currencySystem varchar(255), 
    amount varchar(255),
    paid boolean,
    owner varchar(255),
    PRIMARY KEY (id),
    UNIQUE (id)
 );
 
 CREATE TABLE IF NOT EXISTS Dues (
	bill varchar(255) NOT NULL,
    debtor varchar(255) NOT NULL, 
	creditor varchar(255) NOT NULL,
    amount float,
    paid boolean,
    PRIMARY KEY (bill)
 );
 
CREATE VIEW v_dues_information AS
SELECT d.bill,
b.type,
b.amount,
b.currency,
u.firstname AS debtor_firstname, 
u.lastname AS debtor_lastname,
u.username AS debtor_username,
u.id AS debtor_id,
u2.firstname AS creditor_firstname, 
u2.lastname AS creditor_lastname, 
u2.username AS creditor_username,
u2.id AS creditor_id 
FROM Dues d 
LEFT JOIN Users u ON d.debtor = u.id
LEFT JOIN Users u2 ON d.creditor = u2.id
LEFT JOIN Bills b ON b.id = d.bill
WHERE d.paid = 0