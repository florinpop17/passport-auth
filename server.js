// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const app = express();

// constants
const PORT = process.env.PORT || 8080;
const config = require('./config');
const User = require('./models/userModel');

// middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport
passport.use(new GitHubStrategy( config.githubAuth,
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// routes
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// server listening on PORT
app.listen(PORT, () => { console.log("Server listening to port " + PORT); });
