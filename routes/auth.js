const express = require('express');
const router = express.Router();
const passport = require('passport');
<<<<<<< Updated upstream
const data = require('../data');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;
=======
const bcrypt = require('bcrypt-nodejs');
const data = require('../data');
const usersData = data.users;
>>>>>>> Stashed changes

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
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    if (req.isAuthenticated()){
        req.logout();
        res.render("auth/static", { logoutMsg: "Logout successful" });
    }
});

router.get('/registration', (req, res) => {
    res.render("auth/registration")
});

//TODO: Session ID stuff
router.post('/register', (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let diet = req.body.diet;
    console.log(email);
    console.log(name);
    console.log(diet);
    bcrypt.hash(req.body.password, null, null, function(err, hash){
        console.log(hash);
        return usersData.addUser(hash, 0, name, diet, email).then((newUser) =>{
            res.json(newUser)
        });
    });
});
module.exports = router;