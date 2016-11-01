var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('home',{
        pageTitle: "Home"
    });
});

module.exports = router;