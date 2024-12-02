// Node modules
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User.js");

// JWT functions
const SECRET = "denys_secret";
const EXPIRE = 60*60*3; // 3 hours;
const createToken = async (id) => {
    return jwt.sign({id}, SECRET, {expiresIn: EXPIRE});
}

// Functions
module.exports.register = async (req, res) => {
    try{
        const user = await User.create({
            uname: req.body.uname,
            passwd: req.body.passwd
        });
        const token = await createToken(user._id);
        res.cookie("jwt", token);
        res.redirect("/home");
    }catch(error){
        res.redirect("/register");
    }
};
module.exports.login = async (req, res) => {
    if(req.body.uname && req.body.passwd){
        const status = await User.verify(req.body.uname, req.body.passwd);
        if(status === 2){
            const user = await User.getUser(req.body.uname);
            const token = await createToken(user._id);
            res.cookie("jwt", token);
            res.redirect("/home");
        }else{
            res.redirect("/login");
        }
    }else{
        res.redirect("/login");
    }
};
module.exports.auth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, SECRET, async (error, decodedToken) => {
            if(error){
                res.redirect("/login");
            }else{
                const uid = decodedToken.id;
                const user = await User.getUserById(uid);
                if(user){
                    next();
                }else{
                    res.redirect("/login");
                }
            }
        });
    }else{
        res.redirect("/login");
    }
};