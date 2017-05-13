const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const usersData = data.users;
const bcrypt = require('bcrypt-nodejs');

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/users/${req.user._id}`);
    } else {
        res.redirect('/');
    }
});
router.get("/:userID", (req, res) => {
    usersData.getUserById(req.params.userID).then((gotUser) => {
        res.render("users/static", gotUser);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.post("/", (req, res) => {
    let userInfo = req.body;
    usersData.addUser(bcrypt.hashSync(userInfo.pass), usersData.session, xss(userInfo.name), xss(userInfo.diet), xss(userInfo.email)).then((newUser) => {
        res.redirect(`/users/${newUser._id}`);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.put("/:userID", (req, res) => {
    usersData.updateUser(req.params.userID, req.body).then((updatedUser) => {
        res.redirect("/");
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.delete("/:userID", (req, res) => {
    usersData.removeUser(req.params.userID).then(() => {
        res.sendStatus(200); //Send success
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});
module.exports = router;