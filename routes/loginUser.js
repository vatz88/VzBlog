var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pg = require('pg');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var config = {
    user: 'vatz88',
    host: 'db.imad.hasura-app.io',
    database: 'vatz88',
    password: process.env.DB_PASSWORD,
    port: '5432'
};

var pool = new pg.Pool(config);

function hash(password) {
    var key = crypto.pbkdf2Sync(password, 'VzSalt', 10000, 512, 'sha512');
    return key.toString('hex');
}

router.post('/loginUser', function (req, res) {
    var email = req.body.email;
    var password = hash(req.body.password);
    // password = [email, password].join('$');

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
                        res.send('loged in');
                    } else {
                        res.send('varification failed');
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

module.exports = router;