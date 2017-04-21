const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/", (req, res) => {
    res.render("auth/static", { error: req.flash('error') });
});

router.get("/loginFail", (req, res) => {
    res.send('Failed to authenticate');
});

router.get("/private", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/')
    } else {
        res.redirect('/');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;