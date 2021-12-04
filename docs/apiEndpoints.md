# API Endpoints  
Our API is an express server whose endpoints are detailed below.  

## Root endpoint: /app  
No methods.  

## /app/createAccount  
HTTP Method: `GET`  
Sends a user to the create user page at endpoint `/app/createAccount`  
### parameters  
none  

## /app/play  
HTTP Method: `GET`  
Sends a user to the play page at endpoint `/app/play`  
### parameters  
none  

## /app/leaderboard  
HTTP Method: `GET`  
Sends a user to the leaderboard page at endpoint `/app/leaderboard`  
### parameters  
none  

## /app/userProfile  
HTTP Method: `GET`  
Sends a user to the user profile page at endpoint `/app/userprofile`  
### parameters  
none  

## /app/dashboard  
HTTP Method: `GET`  
Sends a user to the dashboard as long as they are logged in at endpoint `/app/dashboard`  
### parameters  
none  

## /app/new  
HTTP Method: `POST`  
CREATE a new user at endpoint: `/app/new`  
Checks that the entered email and user are not already taken  
-- If email is taken, returns `Register attempt: email already taken`  
-- If username is taken, returns `Register attempt: user already taken`   
### parameters  
email (TEXT)  
user (TEXT)  
pass (TEXT)  

## /app/authenticate  
HTTP Method: `POST`  
Checks that a user's email exists and that the password entered is correct  
CREATEs a new log in record in the logins table and returns user to the endpoint `/app/dashboard` upon completion  
### parameters  
user (TEXT)  

## /app/logout  
HTTP Method: `GET`  
If already logged out, redirects user to the dashboard at endpoint `/app/dashboard`  
If still logged in, logs the user out and sends them to the home page at endpoint `/app`  
### parameters  
none  

## /app/getCurrentUser  
HTTP Method: `GET`  
READs the current user's user info based on their id at endpoint `/app/getCurrentUser`  
### parameters  
none  

## /app/getCurrentUserScores  
HTTP Method: `GET`  
READs the current user's scores from the games table at endpoint `/app/getCurrentUserScores`  
### parameters  
none  

## /app/leaderboardScores  
HTTP Method: `GET`  
READs entire leadboard in descending order by score at endpoint `/app/leaderboardScores`  
### parameters  
none  

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

## /app/update/user/:user    
HTTP Method: `PATCH`  
UPDATE a single users userinfo in the logins and games tables at endpoint `/app/update/user/:user` upon change  
### parameters  
user (TEXT)  

## /app/update/password/:user  
HTTP Method: `PATCH`  
UPDATEs a user's password in their userinfo at endpoint `/app/update/pass/:user`  
### parameters  
pass (TEXT)  
user (TEXT)  

## /app/delete/user/:id  
HTTP Method: `DELETE`  
DELETE a user at endpoint `/app/delete/user/:id`  
Deletes the user from userinfo database based on their id  
and from the games table and the logins table bassed on their user  
### parameters  
id (INTEGER)  

## /app/games/user/:user  
HTTP Method: `GET`  
READs a list of all of a single user's games played based on their user value at endpoint `/app/games/user/:id`  
### parameters  
user (TEXT)  

## /app/logins/user/:id  
HTTP Method: `GET`  
READs a list of all of a single user's login history at endpoint `/app/logins/user/:id`  
### parameters  
id (INTEGER)  

## /app/games  
HTTP Method: `GET`  
READs a list of all game turnouts at endpoint `/app/games`  
### parameters  
none  

## /app/logins  
HTTP Method: `GET`  
READs a list of all login history at endpoint `/app/logins`  
### parameters  
none  

## /app/highscore  
HTTP Method: `GET`  
READs the highest score from the games table at endpoint `/app/highscore`  
### parameters  
none  

## /app/score  
HTTP Method: `POST`
CREATEs a new record of a game result in the games table at endpoint `/app/score`   
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
READs all the games in descending order by score at endpoint `/app/leaderboard/:n`  
### parameters  
none  

## /app/leaderboard/user/:id/:n  
HTTP Method: `GET`  
READs all the games of a single user in descending order by score  
### parameters  






