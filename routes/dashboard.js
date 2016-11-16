var express = require('express');
var router = express.Router();
var pool = app.get('pool');
var bodyParser = require('body-parser');
var xssFilters = require('xss-filters');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/dashboard', function(req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function(err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
                done();
            }
            else {
                client.query('SELECT * FROM "articles" WHERE user_id = $1', [req.session.auth.userId], function(err, result) {
                    done();
                    if (err) {
                        res.status(500).send(err.toString());
                        done();
                    } else {
                        res.status(200).render('dashboard', {
                            pageTitle: "Dashboard",
                            userName: req.session.auth.username,
                            allArticleTitle: result.rows,
                            totalArticles: result.rows.length
                        });
                    }
                });
            }
        });
    } else {
        res.locals.msg = "Session expired, please log in again.";
        res.render('login', {
            pageTitle: "login",
            userName: false
        });
    }
});

router.post('/dashboard', function(req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function(err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
                done();
            } else {
                // insert into articles
                client.query('INSERT INTO "articles" ("article_name", "article_content", "tag", "user_id") VALUES ($1, $2, $3, $4)', [xssFilters.inHTMLData(req.body.article_name), xssFilters.inHTMLData(req.body.article_content), req.body.tag, req.session.auth.userId], function(err, result) {
                    done();
                    if (err) {
                        res.status(500).send(err.toString());
                    }
                    else {
                        res.status(200).send("Article successfully published.");
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