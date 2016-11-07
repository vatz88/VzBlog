var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pool = app.get('pool');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function hash(password) {
    var key = crypto.pbkdf2Sync(password, 'VzSalt', 10000, 512, 'sha512');
    return key.toString('hex');
}

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = hash(req.body.password);

    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM "user" WHERE UPPER(email_id) = UPPER($1)', [email], function (err, result) {
                if (err) {
                    res.status(500).send(err.toString());
                }
                if (result.rows.length == 1) {
                    // user exist
                    if (password == result.rows[0].password) {
                        // set session
                        req.session.auth = { userId: result.rows[0].user_id, username: result.rows[0].username };
                        res.redirect('/');
                    } else {
                        res.locals.msg = "Email id / Password incorrect. Please try again.";
                        res.status(403).render('login', {
                            pageTitle: "login",
                            userName: false
                        });
                    }
                } else {
                    // create user
                    client.query('INSERT INTO "user" ("email_id", "password") VALUES ($1, $2)', [email, password], function (err, result) {
                        if (err) {
                            res.status(500).send(err.toString());
                        }
                        res.send('user created');
                    });
                }
                done();
            });
        }
    });
});

router.get('/test-session', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.status(200).send("Hi, user id " + req.session.auth.userId);
    } else {
        res.status(200).send("Session expired, please log in again");
    }
});

router.get('/login', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.redirect('/');
    } else {
        res.render('login', {
            pageTitle: "Login",
            userName: false
        });
    }
});

router.get('/logout', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        delete req.session.auth;
        res.locals.msg = "Successfully logged out.";
    } else {
        res.locals.msg = "No active session";
    }
    res.render('login', {
        pageTitle: "login",
        userName: false
    });
});

module.exports = router;