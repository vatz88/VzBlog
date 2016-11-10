var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var pg = require('pg');

app = express();
app.use(morgan('combined'));

// database configuration
var config = {
  user: 'vatz88',
  host: 'db.imad.hasura-app.io',
  database: 'vatz88',
  password: process.env.DB_PASSWORD,
  port: '5432'
};

var pool = new pg.Pool(config);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('pool', pool);

app.use(session({
  secret: 'VzSecret',
  cookie: { maxAge: 1000 * 60 * 60 } // 60 min
}));

app.use(express.static('public'));
app.use(require('./routes/api'));
app.use(require('./routes/login'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/dashboard'));

app.listen(process.env.PORT || 8080, function () {
  console.log("VzBlog running on port 8080!");
});