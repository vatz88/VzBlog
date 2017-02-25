var express = require('express');
var router = express.Router();
var pool = app.get('pool');
var bodyParser = require('body-parser');
var xssFilters = require('xss-filters');
var regexEmail = require('regex-email');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                client.query('SELECT * FROM "user" , "user_details" WHERE user_details.user_id = $1 AND "user_details".user_id = "user".user_id', [req.session.auth.userId], function (err, result) {
                    done();
                    if (err) {
                        res.status(500).send(err.toString());
                    } else {
                        res.status(200).render('profile', {
                            pageTitle: "Profile",
                            userName: result.rows[0].username,
                            first_name: result.rows[0].first_name,
                            last_name: result.rows[0].last_name,
                            bio: result.rows[0].bio,
                            email_id: result.rows[0].email_id,
                        });
                    }
                });
            }
        });
    } else {
        res.locals.msg = "Session expired, please log in again.";
        res.status(200).render('login', {
            pageTitle: "login",
            userName: false
        });
    }
});

// update profile details
router.post('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (req.body.first_name === "" || req.body.last_name === "" || req.body.username === "" || (!regexEmail.test(req.body.email))) {
                    done();
                    res.status(200).send("Please give all required fields in their valid format");
                } else {
                    client.query('UPDATE "user_details" SET "first_name" = $1, "last_name" = $2, "bio" = $3 WHERE "user_id" = $4', [xssFilters.inHTMLData(req.body.first_name), xssFilters.inHTMLData(req.body.last_name), xssFilters.inHTMLData(req.body.bio), xssFilters.inHTMLData(req.session.auth.userId)], function (err, result) {
                        if (err) {
                            res.status(500).send(err.toString());
                        } else {
                            client.query('UPDATE "user" SET "username" = $1, "email_id" = $2 WHERE "user_id" = $3', [xssFilters.inHTMLData(req.body.username), xssFilters.inHTMLData(req.body.email), xssFilters.inHTMLData(req.session.auth.userId)], function (err, result) {
                                done();
                                if (err) {
                                    res.status(500).send(err.toString());
                                } else {
                                    req.session.auth.username = req.body.username;
                                    res.status(200).send("Your profile has been updated.");
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.locals.msg = "Session expired, please log in again.";
        res.status(200).render('login', {
            pageTitle: "login",
            userName: false
        });
    }
});

module.exports = router;