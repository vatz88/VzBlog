var express = require('express');
var router = express.Router();

router.get('/profile', function (req, res) {
    res.render('profile',{
        pageTitle: "Profile"
    });
});

module.exports = router;