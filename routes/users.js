const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const usersData = data.users;
const bcrypt = require('bcrypt-nodejs');

router.get("/:userID", (req, res) => {
     usersData.getUserById(req.params.userID).then((gotUser)=>{
     	res.json(gotUser);
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.post("/", (req, res) => {
    let userInfo = req.body;
     usersData.addUser(bcrypt.hashSync(userInfo.pass), usersData.session, userInfo.name, userInfo.diet, userInfo.email).then((newUser)=>{
     	res.redirect(`/users/${newUser._id}`);
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.put("/:userID", (req, res) => {
     usersData.updateUser(req.params.userID, req.body).then((updatedUser)=>{
     	res.redirect(`/users/${updatedUser._id}`)
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.delete("/:userID", (req, res) => {
     usersData.removeUser(req.params.userID).then(()=>{
     	res.sendStatus(200); //Send success
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});
module.exports = router;
