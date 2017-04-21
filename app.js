const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const passport = require("passport");
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const data = require('./data');
const usersData = data.users;
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(rewriteUnsupportedBrowserMethods);
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.use(flash());

app.use(session({
    secret: 'super secret keyboard cat!',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Auth methods
passport.serializeUser(function(user, done) {
    return done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    usersData.getUserById(id).then((userObj) => {
        return done(null, userObj);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
            usersData.getUserByEmail(username).then((userObj) => {
                if (!userObj)
                    return done(null, false, { message: "User not found" });
                if (!bcrypt.compareSync(password, userObj.hashedPassword))
                    return done(null, false, { message: "Invalid password" });
                return done(null, userObj);
            }).catch(() => {
                return done(null, false, { message: "User not found" });
            });
        });
    }
));

require('./routes/index.js')(app, passport);


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});