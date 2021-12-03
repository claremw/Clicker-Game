// Define app using express
var express = require("express");
var app = express();
var session = require('express-session');
// Require database SCRIPT file
var db = require("./database.js");
var path = require('path');
// Require md5 MODULE
var md5 = require("md5");
var cors = require("cors");
// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
// Set server port
var HTTP_PORT = 3000;
// Start server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});


//setup base endpoint and html
app.set('base', '/app');
app.use(express.static(path.join(__dirname, 'public')));

const {
	//one hour
	SESSION_TIME = 1000 * 60 * 60,
	SESSION_NAME = "sessionID",
	SESSION_SECRET = "bigCookie"
} = process.env

//setup session
app.use(session({
	name: SESSION_TIME,
	resave: false,
	saveUninitialized: false,
	secret: SESSION_SECRET,
	cookie: {
		maxAge: SESSION_TIME,
		path: '/app',
		sameSite: true,
		secure: false
	}
}))

//Middleware methods, can't access game and scores if you're not logged in
const redirectLogin = (req, res, next) => {
	if (!req.session.userID) {
		console.log("User needs to login first");
		res.redirect('/app');
	} else {
		next();
	}
};
//Can't register if you are logged in
const redirectHome = (res, req, next) => {
	if (req.session.userID) {
		console.log("User already registered");
		res.redirect('/app/play');
	} else {
		next();
	}
};

app.use((req, res, next) => {
	const {userID} = req.session;
	const IDQuery = db.prepare('SELECT * from userinfo WHERE id =?');
	if (userID) {
		res.locals.user = IDQuery.get(userID);
	}
	next();
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app", (req, res) => {
	res.sendFile(__dirname + '/index.html');
	//res.status(200).json({"message":"Your API works! (200)"});
});

// going to the create user page
app.get('/app/createAccount', (req, res) => {
	res.sendFile(__dirname + '/createAccount.html');
});

// going to the play page
app.get('/app/play', redirectLogin, (req, res) => {
	const {user} = res.locals;
	console.log(user);
	res.sendFile(__dirname + '/play.html');
});

// going to the leaderboard page
app.get('/app/leaderboard', redirectLogin, (req, res) => {
	const {user} = res.locals;
	console.log(user);
	res.sendFile(__dirname + '/leaderboard.html');
});

// going to the userProfile page
app.get('/app/userProfile', redirectLogin, (req, res) => {
	const {user} = res.locals;
	console.log(user);
	res.sendFile(__dirname + '/userProfile.html');
})

var loggedIn = false;
// going to the userProfile page
app.get('/app/dashboard', redirectLogin, (req, res) => {
	if (!loggedIn) {
		const userID = req.session;
		console.log(userID);
		loggedIn = true;
	}
	const user = res.locals;
	console.log(user);
	res.sendFile(__dirname + '/dashboard.html');
})


// CREATE a new user (HTTP method POST) at endpoint /app/new
app.post("/app/new", (req, res) => {
	console.log(req.body);
	const emailQuery = db.prepare('SELECT * from userinfo WHERE email =?');
	const userQuery = db.prepare('SELECT * from userinfo WHERE user =?');
	const emailCheck = emailQuery.get(req.body.email);
	const userCheck = userQuery.get(req.body.user);
	if (emailCheck) {
		console.log("Register attempt: email already taken");
		return res.redirect('/app/createAccount');
		//res.status(409).json("Email is already taken (409)");
	} else if (userCheck) {
		console.log("Register attempt: user already taken");
		return res.redirect('/app/createAccount');
		//res.status(409).json("Username is already taken (409)");
	} else {
		const stmt = db.prepare('INSERT INTO userinfo (email, user, pass) VALUES (?, ?, ?)');
		const info = stmt.run(req.body.email, req.body.user, md5(req.body.pass));
		//res.json({"message": "1 record created: ID " + info.lastInsertRowid + " (201)"});
		return res.redirect('/app/play');
	}
});
//login post
app.post("/app/authenticate", (req, res) => {
	console.log(req.body);
	const userStmt = db.prepare("SELECT id, user FROM userinfo WHERE email = ?");
	const userResult = userStmt.get(req.body.email);
	if (userResult === undefined) {
		console.log("Login attempt: Email not found in database");
		return res.redirect('/app');
		//res.status(404).json({"message": "Email not found (404)"});
	} else {
		const passStmt = db.prepare("SELECT pass FROM userinfo where email = ?");
		const passResult = passStmt.get(req.body.email);
		if (md5(req.body.pass) != passResult.pass) {
			console.log("Login attempt: Wrong Password");
			return res.redirect('/app');
			//res.status(403).json({"message": "Incorrect password. Access denied (403)"});
		} else {
			//res.status(200).json(userResult);
			req.session.userID = userResult.id;
			console.log(req.session.userID);
			//Insert login information to login table
			const stmt = db.prepare("INSERT INTO logins (user, time) VALUES (?, strftime('%Y-%m-%d %H:%M:%S','now'))");
			const info = stmt.run(userResult.user);
			//go to dashboard after logging in
			return res.redirect('/app/dashboard');
		}
	}
});

//Logout call
app.get("/app/logout", (req, res) => {
	console.log("logout");
	req.session.destroy(err => {
		if (err) {
			return res.redirect('/app/dashboard');
		}

		res.clearCookie(SESSION_NAME);
		loggedIn = false;
		const user = undefined;
		console.log("User destroyed");
		res.redirect('/app');
	})
});

//get current user info
app.get("/app/getCurrentUser", (req, res) => {
	console.log("Getting Current User and sending it to client");
	const user = res.locals;
	const IDQuery = db.prepare('SELECT * from userinfo WHERE id =?');
	const queryResults = IDQuery.get(user.user.id);
	res.status(200).json(queryResults);
});
//get current user scores info
app.get("/app/getCurrentUserScores", (req, res) => {
	console.log("Getting Current User Scores and sending it to client");
	const user = res.locals;
	const IDQuery = db.prepare('SELECT * from games WHERE id =?');
	const queryResults = IDQuery.get(user.user.id);
	res.status(200).json(queryResults);
});

//get entire leaderboard, scores high to low
app.get("/app/leaderboardScores", (req, res) => {
	const stmt = db.prepare("SELECT * FROM games ORDER BY score DESC").all();
	res.status(200).json(stmt);
});



// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

//Reading a user based on ID
// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
	const stmt = db.prepare("SELECT * FROM userinfo WHERE id = ?");
	const info = stmt.get(req.params.id);
	res.status(200).json(info);
});

//Updating a user (if we want to implement name, password, or email changes)
// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
	const stmt = db.prepare("UPDATE userinfo SET email = COALESCE(?, email), user = COALESCE(?, user), pass = COALESCE(?, pass) WHERE id = ?");
	const info = stmt.run(req.body.email, req.body.user, md5(req.body.pass), req.params.id);
	res.status(200).json({ "message": "1 record updated: ID " + req.params.id + " (200)" });
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const userStmt = db.prepare("DELETE FROM userinfo WHERE id = ?");
	const userInfo = userStmt.run(req.params.id);
	const gamesStmt = db.prepare("DELETE FROM games WHERE user = ?");
	const gamesInfo = gamesStmt.run(req.params.id);
	const loginsStmt = db.prepare("DELETE FROM logins WHERE user = ?");
	const loginsInfo = loginsStmt.run(req.params.id);
	const changes = userInfo.changes + gamesInfo.changes + loginsInfo.changes;
	res.status(200).json({ "message": `${changes} record${changes == 1 ? "" : "s"} deleted with ID ${req.params.id} (200)` });
	console.log("Account Successfuly Deleted");
});

app.get("/app/games/user/:user", (req, res) => {
	const stmt = db.prepare("SELECT * FROM games WHERE user = ?");
	const info = stmt.all(req.params.user);
	res.status(200).json(info);
});

app.get("/app/logins/user/:id", (req, res) => {
	const stmt = db.prepare("SELECT * FROM logins WHERE user = ?");
	const info = stmt.all(req.params.id);
	res.status(200).json(info);
});

app.get("/app/games", (req, res) => {
	const stmt = db.prepare("SELECT * FROM games").all();
	res.status(200).json(stmt);
});

app.get("/app/logins", (req, res) => {
	const stmt = db.prepare("SELECT * FROM logins").all();
	res.status(200).json(stmt);
});

app.post("/app/score", (req, res) => {
	const stmt = db.prepare("INSERT INTO games (user, time, score) VALUES (?, strftime('%s','now'), ?)");
	const info = stmt.run(req.body.user, req.body.score);
	res.status(201).json({ "message": `1 record created: ID ${info.lastInsertRowid} (201)` });
});

app.post("/app/login", (req, res) => {
	const stmt = db.prepare("INSERT INTO logins (user, time) VALUES (?, strftime('%s','now'))");
	const info = stmt.run(req.body.user);
	res.status(201).json({ "message": `1 record created: ID ${info.lastInsertRowid} (201)` });
});

app.get("/app/leaderboard/:n", (req, res) => {
	const stmt = db.prepare("SELECT * FROM games ORDER BY score DESC, time ASC LIMIT ?");
	const info = stmt.all(req.params.n);
	res.status(200).json(info);
});


app.get("/app/leaderboard/user/:id/:n", (req, res) => {
	const stmt = db.prepare("SELECT * FROM games WHERE user = ? ORDER BY score DESC, time ASC LIMIT ?");
	const info = stmt.all(req.params.id, req.params.n);
	res.status(200).json(info);
});

// seems like a really insecure way of doing this but ¯\_(ツ)_/¯
// in reality we should perform the hash on the client side
/*app.get("/app/authenticate", (req, res) => {
	console.log(req.body);
	const userStmt = db.prepare("SELECT id, user FROM userinfo WHERE email = ?");
	const userResult = userStmt.get(req.body.email);
	if (userResult === undefined) {
		res.status(404).json({"message": "Email not found (404)"});
		//res.redirect('/app');
	} else {
		const passStmt = db.prepare("SELECT pass FROM userinfo where email = ?");
		const passResult = passStmt.get(req.body.email);
		if (md5(req.body.pass) != passResult.pass) {
			res.status(403).json({"message": "Incorrect password. Access denied (403)"});
		} else {
			res.status(200).json(userResult);
			res.redirect('/app/play');
		}
	}
});
*/




// Default response for any other request
app.use(function (req, res) {
	res.json({ "message": "Endpoint not found. (404)" });
	res.status(404);
});
