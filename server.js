// Define app using express
var express = require("express");
var app = express();
// Require express session
var session = require('express-session');
// Require database SCRIPT file
var databases = require("./database.js");
var db = databases.db;
var scoresDB = databases.scoreDB
// Require md5 MODULE
var md5 = require("md5");

var path = require('path');
var cors = require("cors");
// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//setup session
const TWO_HOURS = 1000 * 360 * 2;

const {
	NODE_ENV = 'development',
	SESS_LIFETIME = TWO_HOURS,
	SESS_NAME = "sessionID",
	SESS_SECRET = "bigSecret"
} = process.env;

const IN_PROD = true

app.use(session({
	name: SESS_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESS_SECRET,
	cookie: {
		maxAge: SESS_LIFETIME,
		sameSite: true,
		secure: false
	}
}));

// Set server port
var HTTP_PORT = 3000;
// Start server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});





//login page?

//keep game safe if not logged in
const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		console.log("redirected to login");
		res.redirect('/');
	} else {
		next();
	}
};

const redirectHome = (req, res, next) => {
	if (req.session.userId) {
		console.log("redirected to game");
		res.redirect('/testGamePage.html');
	} else {
		next();
	}
};

//for css files
app.use(express.static("public"));
//setup landing page (login page)
app.get('/', redirectHome, (req, res) => {
	const { userId } = req.session;
	console.log(userId);
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/createAccount.html', redirectHome, (req, res) => {
	res.sendFile(path.join(__dirname, '/createAccount.html'));
});

app.get('/testGamePage.html', redirectLogin, (req, res) => {
	console.log("Current request session:" + req.session);
	res.sendFile(path.join(__dirname, '/testGamePage.html'));
});

app.get('/login', redirectHome, (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/login', (req, res) => {
	console.log(req.body);
	const email = req.body.email;
	console.log(email);
	const pass = req.body.pass;
	const emailQuery = db.prepare('SELECT * from userinfo WHERE email =?');
	const emailQueryResult = emailQuery.get(email);
	if (!emailQueryResult) {
		//if email is wrong redirect to login
		res.json("Email is not registered to database, go back and Create an account.");
		console.log("invalid email");
		res.redirect('/');
	} else {
		const passwordHolder = emailQueryResult.pass;
		console.log(passwordHolder);
		if (pass === passwordHolder) {
			req.session.userId = emailQueryResult.id;
			console.log(req.session.userId);
			console.log("login successful");
			return res.redirect('/testGamePage.html');
		} else {
			//if password is wrong redirect to login
			console.log("wrong pass");
			res.json("Password, go back and try another password");
			return res.redirect('/');
		}
	}
});




// CREATE a new user (HTTP method POST) at endpoint /app/new
app.post("/app/new", (req, res) => {
	const emailQuery = db.prepare('SELECT * from userinfo WHERE email =?');
	const UserQuery = db.prepare('SELECT * from userinfo WHERE user =?');
	const emailCheck = emailQuery.get(req.body.email);
	const userCheck = UserQuery.get(req.body.user);
	if (emailCheck) {
		res.json("Email is already taken");
	} else if (userCheck) {
		res.json("Username is already taken");
	} else {
		const stmt = db.prepare('INSERT INTO userinfo (email, user, pass) VALUES (?, ?, ?)');
		const info = stmt.run(req.body.email, req.body.user, req.body.pass);
		res.json("Account successfully created!");
	}

	//res.json({"message": "1 record created: ID " + info.lastInsertRowid + " (201)"});
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
	const stmt = db.prepare("UPDATE userinfo SET email = ?, user = ?, pass = ? WHERE id = ?");
	const info = stmt.run(req.body.email, req.body.user, (req.body.pass), req.params.id);
	res.json({ "message": "1 record updated: ID " + req.params.id + " (200)" });
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const stmt = db.prepare("DELETE FROM userinfo WHERE id = ?");
	const info = stmt.run(req.params.id);
	res.json({ "message": "1 record deleted: ID " + req.params.id + " (200)" });
});


app.use(function (req, res) {
	res.json({ "message": "Your API is working!" });
	res.status(404);
});

