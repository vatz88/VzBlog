var express = require('express');
var router = express.Router();
var pool = app.get('pool');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            }
            else {
                client.query('SELECT * FROM "user" , "user_details" WHERE "user_details".user_id = "user".user_id AND user_details.user_id = $1', [req.session.auth.userId], function (err, result) {
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

router.post('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                client.query('UPDATE "user_details" SET "first_name" = $1, "last_name" = $2, "bio" = $3 WHERE "user_id" = $4', [req.body.first_name, req.body.last_name, req.body.bio, req.session.auth.userId], function (err, result) {
                    if (err) {
                        res.status(500).send(err.toString());
                    }
                    else {
                        client.query('UPDATE "user" SET "username" = $1 WHERE "user_id" = $2', [req.body.username, req.session.auth.userId], function (err, result) {
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