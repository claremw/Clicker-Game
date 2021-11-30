// Define app using express
var express = require("express");
var app = express();
// Require database SCRIPT file
var db = require("./database.js");
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
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
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
	}else {
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
	const info = stmt.run(req.body.email, req.body.user, md5(req.body.pass), req.params.id);
	res.json({"message": "1 record updated: ID " + req.params.id + " (200)"});
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const stmt = db.prepare("DELETE FROM userinfo WHERE id = ?");
	const info = stmt.run(req.params.id);
	res.json({"message": "1 record deleted: ID " + req.params.id + " (200)"});
});


app.use(function(req, res){
	res.json({"message":"Your API is working!"});
    res.status(404);
});

