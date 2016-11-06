var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(require('./routes/login'));
app.use(require('./routes/loginUser'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/api'));

app.listen(8080, function () {
  console.log("VzBlog running on port 8080!");
});