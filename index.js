// Port number
const PORT = process.env.PORT || 3000;

// DB URL
const URL = "mongodb://localhost:27017/denysdb";

// Node modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

// My modules
const func = require("./functions/func.js");

// App
const app = express();

// Templates
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.json());

// DB connection
mongoose.connect(URL)
    .then((result) => {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    })
    .catch((error) => console.log(error));

// DB models

// Routes
// Login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
app.post("/login", func.login);
// Logout page
app.get("/logout", (req, res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.redirect("/login");
});
// Register page
app.get("/register", (req, res) => {
    res.render("register.ejs");
});
app.post("/register", func.register)
// Home page
app.get("/home", func.auth, (req, res) => {
    res.render("home.ejs");
});