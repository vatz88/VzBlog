var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var pg = require('pg');
var httpsRedirect = require('express-https-redirect');

app = express();
app.use(morgan('combined'));

// database configuration
var config = {
  user: process.env.DB_USER || 'vatz88',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'VzBlog',
  password: process.env.DB_PASSWORD || '8896',
  port: '5432'
};

var pool = new pg.Pool(config);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('pool', pool);

app.use(session({
  secret: 'VzSecret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  } // 1 day
}));

app.use('/', httpsRedirect());
app.use(express.static('public'));
app.use(require('./routes/api'));
app.use(require('./routes/login'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/dashboard'));

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("VzBlog running on port: " + port);
});