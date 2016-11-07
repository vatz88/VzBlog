var express = require('express');
var router = express.Router();

router.get('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.render('profile', {
            pageTitle: "Profile",
            userName: req.session.auth.username
        });
    } else {
        res.locals.msg = "Session expired, please log in again.";
        res.render('login', {
            pageTitle: "login",
            userName: false
        });
    }
});

module.exports = router;