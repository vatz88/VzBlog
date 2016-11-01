var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pg = require('pg');

var app = express();
app.use(morgan('combined'));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/dashboard'));

var config = {
  user: 'vatz88',
  host: 'db.imad.hasura-app.io',
  database: 'vatz88',
  password: process.env.DB_PASSWORD,
  port: '5432'
};

var pool = new pg.Pool(config);

pool.connect(function (err, client, done) {
  if (err) {
    console.log('err: ' + err);
  }
  else {
    console.log('connected to pg');
  }
});

app.listen(8080, function () {
  console.log(`VzBlog running on port 8080!`);
});