const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/loginFail", (req, res) => {
    res.send('Failed to authenticate');
});

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/')
    } else {
        res.render("auth/static", { error: req.flash('error') });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    if (req.isAuthenticated()){
        req.logout();
        res.render("auth/static", { logoutMsg: "Logout successful" });
    }
});

module.exports = router;