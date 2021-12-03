# API Endpoints
Our API is an express server whose endpoints are detailed below.

## Root endpoint: /app
No methods.
## /app/new
HTTP Method: `POST`
CREATE a new user at endpoint: `/app/new`
Checks that the entered email and username are not already taken
-- If email is taken, returns `Email is already taken (409)`
-- If username is taken, returns `Username is already taken (409)`
### parameters
email (TEXT)
user (TEXT)
pass (TEXT)

## /app/users
HTTP Method: `GET`
READ a list of all users at endpoint: `/app/users`
### parameters
none

## /app/user/:id
HTTP Method: `GET`
READ a single user based on their id at endpoint: `/app/user/:id`
### parameters
none

## /app/update/user/:id
HTTP Method: `PATCH`
UPDATE a single users name, password or email based on their id at endpoint `/app/update/user/:id`
### parameters
email (TEXT)
user (TEXT)
pass (TEXT)
id (INTEGER)

## /app/delete/user/:id
HTTP Method: `DELETE`
DELETE a user at endpoint `/app/delete/user/:id`
Deletes the user from userinfo database based on their id
and from the games table and the logins table bassed on their user
### parameters 
id (INTEGER)

## /app/games/user/:id 
HTTP Method: `GET`
READs a list of all of a single user's game turnouts at endpoint `/app/games/user/:id`
### parameters
id (INTEGER)

## /app/logins/user/:id 
HTTP Method: `GET`
READs a list of all of a single user's login history at endpoint `/app/logins/user/:id`
### parameters
id (INTEGER)

## /app/games
HTTP Method: `GET`
READs a list of all game turnouts at endpoint `/app/games/user/:id`
### parameters
none

## /app/logins
HTTP Method: `GET`
READs a list of all login history at endpoint `/app/logins/user/:id`
### parameters
none

## /app/score
HTTP Method: `POST`
CREATEs a new record of a game result in the games table at endpoint `/app/score`
Inserts user, time of game and score from the game
### parameters
user (TEXT)
score (INTEGER)

## /app/login
HTTP Method: `POST`
CREATEs a new record of a login in the logins table at endpoint `/app/login`
Inserts user and time of login
### parameters
user (TEXT)

## /app/leaderboard/:n
HTTP Method: `GET`
READs -- what is "n" ???
### parameters

## /app/leaderboard/user/:id/:n
HTTP Method: `GET`
READs a
### parameters


## /app/authenticate -- 
User enters username
checks that the username exists
if it doesnt-- error message
if it does, checks that the password they entered is correct
if it isnt-- error message
if it is, ?? im not exactly sure what the code is supposed to do-- check that the person has the right login credentials? based on their email? ill come back to this
### parameters
