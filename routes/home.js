var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.render('home', {
            pageTitle: "Home",
            userName: req.session.auth.username
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;