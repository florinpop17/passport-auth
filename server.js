// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const app = express();
const pug = require('pug');

mongoose.connect('mongodb://localhost/github');

// constants
const PORT = process.env.PORT || 8080;
const config = require('./config');
const User = require('./models/userModel');

// passport
passport.use(new GitHubStrategy( config.githubAuth, (accessToken, refreshToken, profile, done) => {
    User.findOne({ githubId: profile.id }, (err, user) => {
        if (err) return done(err, user);

        if(!user) {
            let user = {
                githubId: profile.id,
                username: profile.username,
                avatar_url: profile._json.avatar_url,
                email: profile._json.email
            }
            User.create(user, (err, user) => {
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// middlewares
app.set('views', './public');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/profile',
    passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.render('profile', req.user);
            // res.redirect('/profile?user=' + JSON.stringify(req.user), { "mama": "yeah" });
    });

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// server listening on PORT
app.listen(PORT, () => { console.log("Server listening to port " + PORT); });
