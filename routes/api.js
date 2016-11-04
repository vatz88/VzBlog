var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
    user: 'vatz88',
    host: 'db.imad.hasura-app.io',
    database: 'vatz88',
    password: process.env.DB_PASSWORD,
    port: '5432'
};

var pool = new pg.Pool(config);

// routes

// get all articles
router.get('/api/articles/all', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM articles, user_details WHERE user_details.user_id = articles.user_id', function (err, result) {
                done();
                if (err) {
                    res.send('error running query', err.toString());
                }
                res.json(result.rows);
            });
        }
    });
});

// get atricle by user
router.get('/api/articles/user/:user', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM articles, user_details WHERE user_details.user_id = articles.user_id AND (UPPER(user_details.first_name) = UPPER($1) OR UPPER(user_details.last_name) = UPPER($1))', [req.params.user], function (err, result) {
                done();
                if (err) {
                    res.send('error running query', err.toString());
                }
                res.json(result.rows);
            });
        }
    });
});

// get article by tag
router.get('/api/articles/tag/:tag', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            client.query('SELECT * FROM articles, article_tags WHERE articles.article_id=article_tags.article_id AND UPPER(article_tags.tag) = UPPER($1)', [req.params.tag], function (err, result) {
                done();
                if (err) {
                    res.send('error running query', err.toString());
                }
                res.json(result.rows);
            });
        }
    });
});

// Search entire blog by keywords
router.get('/api/searchBlog', function (req, res) {
    var keywords = req.query.keywords.split(' ');
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(500).send(err.toString());
        }
        else {
            var query = '';
            for (var i = 0, len = keywords.length; i < len; i++) {
                query = query + "(\
                    SELECT articles.name, articles.article_content, user_details.user_id, user_details.first_name, user_details.last_name \
                    FROM articles, user_details \
                    WHERE user_details.user_id = articles.user_id AND ( \
                        UPPER(articles.name) like UPPER('%" + keywords[i] + "%') OR \
                        UPPER(user_details.first_name) like UPPER('%" + keywords[i] + "%') OR \
                        UPPER(user_details.last_name) like UPPER('%" + keywords[i] + "%') \
                   ) \
                )";
                if (i != len - 1) {
                    query = query + 'UNION';
                }
            }
            client.query(query, function (err, result) {
                done();
                if (err) {
                    console.log('error running query', err);
                }
                res.json(result.rows);
            });
        }
    });
});

module.exports = router;
