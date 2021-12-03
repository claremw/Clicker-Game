"use strict";
// Require better-sqlite.
const Database = require('better-sqlite3');

// Connect to a database or create one if it doesn't exist yet.
const db = new Database('user.db');

// create users database
const userinfoQuery = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table' and name='userinfo';`);
let userinfoResult = userinfoQuery.get();
if (userinfoResult === undefined) {
// Echo information about what you are doing to the console.
    console.log('Your userinfo table appears to be empty. I will initialize it now.');
// Set a const that will contain your SQL commands to initialize the database.
    const sqlInit = `
        CREATE TABLE userinfo ( id INTEGER PRIMARY KEY, email TEXT, user TEXT, pass TEXT );
		INSERT INTO userinfo (email, user, pass) VALUES ('someone@live.unc.edu', 'admin','bdc87b9c894da5168059e00ebffb9077')

    `;
// Execute SQL commands that we just wrote above.
    db.exec(sqlInit);
// Echo information about what we just did to the console.
    console.log('Your userinfo table has been initialized with one entry containing an email, a username, and password.');
} else {
// Since the database already exists, echo that to the console.
    console.log('userinfo exists.');
}

// Repeat for games and logins tables.
const gamesQuery = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table' and name='games';`);
let gamesResult = gamesQuery.get();
if (gamesResult === undefined) {
    console.log('Your games table appears to be empty. I will initialize it now.');
    const sqlInit = `
        CREATE TABLE games ( id INTEGER PRIMARY KEY, user TEXT, time TEXT, score INTEGER );
		INSERT INTO games (user, time, score) VALUES ('admin', strftime('%Y-%m-%d %H:%M:%S','now'), 0)

    `;
    db.exec(sqlInit);
    console.log('Your games table has been initialized with one entry containing a user, time, and score.');
} else {
    console.log('games exists.');
}

const loginsQuery = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table' and name='logins';`);
let loginsResult = loginsQuery.get();
if (loginsResult === undefined) {
    console.log('Your logins table appears to be empty. I will initialize it now.');
    const sqlInit = `
        CREATE TABLE logins ( id INTEGER PRIMARY KEY, user INTEGER, time TEXT);
		INSERT INTO logins (user, time) VALUES (1, strftime('%s','now'))

    `;
    db.exec(sqlInit);
    console.log('Your games table has been initialized with one entry containing a user and time.');
} else {
    console.log('logins exists.');
}

// Export all of the above as a module so that we can use it elsewhere.
module.exports = db;