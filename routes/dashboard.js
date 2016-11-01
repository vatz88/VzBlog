var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res) {
    res.render('dashboard',{
        pageTitle: "Dashboard"
    });
});

module.exports = router;