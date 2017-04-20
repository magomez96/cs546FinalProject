const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/", (req, res) => {
    res.render("auth/static", {});
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
    failureRedirect: '/loginFail',
}));

module.exports = router;