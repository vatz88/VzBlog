var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/ui/vz_style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'vz_style.css'));
});
app.get('/ui/vz_script.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'vz_script.js'));
});

app.get('/article-one', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articles', 'article-one.html'));
});

app.listen(8080, function () {
  console.log(`VzBlog running! on port 8080`);
});
