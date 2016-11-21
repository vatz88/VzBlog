var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pool = app.get('pool');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// routes

// user profile by id
router.get('/api/user/:id', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM user_details WHERE user_id = $1', [req.params.id], function (err, result) {
                done();
                if (err) {
                    res.status(500).send(err.toString());
                }
                res.status(200).json(result.rows);
            });
        }
    });
});

// get all articles
router.get('/api/articles/all', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM articles, user_details WHERE user_details.user_id = articles.user_id ORDER BY "article_id" ASC', function (err, result) {
                done();
                if (err) {
                    res.status(500).send(err.toString());
                }
                res.status(200).json(result.rows);
            });
        }
    });
});

// get article_name, article_content, first_name, last_name, articles.user_id by id
router.get('/api/articles/user/:user', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT article_name, article_content, first_name, last_name, articles.user_id FROM articles, user_details WHERE user_details.user_id = articles.user_id AND user_details.user_id = $1', [req.params.user], function (err, result) {
                done();
                if (err) {
                    res.status(500).send(err.toString());
                }
                res.status(200).json(result.rows);
            });
        }
    });
});

// get article_name, article_content and author's first_name, last_name by tag
router.get('/api/articles/tag/:tag', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT article_name, article_content, first_name, last_name FROM user_details, (SELECT article_name, article_content, user_id AS uid FROM articles, (SELECT article_id AS artiID FROM article_tags WHERE UPPER(article_tags.tag) = UPPER($1)) AS tableArtiID WHERE article_id = artiID) AS tableArticle WHERE uid = user_details.user_id', [req.params.tag], function (err, result) {
                done();
                if (err) {
                    res.status(500).send(err.toString());
                }
                res.status(200).json(result.rows);
            });
        }
    });
});

// Search entire blog by keywords
router.get('/api/searchBlog', function (req, res) {
    var keywords = req.query.keywords.split(/\s|\'|%|\"|;/g);
    console.log(keywords);
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            var query = '';
            for (var i = 0, len = keywords.length; i < len; i++) {
                if (keywords[i] !== "") {
                    if (query !== '') {
                        query = query + 'UNION';
                    }
                    query = query +
                        "(" +
                        "SELECT * " +
                        "FROM articles, user_details " +
                        "WHERE user_details.user_id = articles.user_id AND " +
                        "(" +
                        "UPPER(articles.tag) like UPPER('%" + (keywords[i]) + "%') OR " +
                        "UPPER(articles.article_name) like UPPER('%" + (keywords[i]) + "%') OR " +
                        "UPPER(user_details.first_name) like UPPER('%" + (keywords[i]) + "%') OR " +
                        "UPPER(user_details.last_name) like UPPER('%" + (keywords[i]) + "%')" +
                        ")" +
                        ")";
                }
            }
            client.query(query, function (err, result) {
                done();
                if (err) {
                    res.status(500).send(err.toString());
                } else {
                    res.status(200).json(result.rows);
                }
            });
        }
    });
});

// delete article
router.post('/api/article/delete', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            }
            else {
                client.query('DELETE FROM "articles" WHERE (("article_id" = $1) AND "user_id" = $2)', [req.body.article_id, req.session.auth.userId], function (err, result) {
                    done();
                    if (err) {
                        res.status(500).send(err.toString());
                    } else {
                        res.status(200).send("Article successfully deleted");
                    }
                });
            }
        });
    }
    else {
        res.sendStatus(401);
    }
});

module.exports = router;
