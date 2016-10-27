var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home', 'home.html'));
});
app.get('/home.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home', 'home.css'));
});
app.get('/home.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home', 'home.js'));
});
app.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dashboard', 'dashboard.html'));
});
app.get('/dashboard.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dashboard', 'dashboard.css'));
});
app.get('/dashboard.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dashboard', 'dashboard.js'));
});
app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile', 'profile.html'));
});
app.get('/profile.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile', 'profile.css'));
});
app.get('/profile.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile', 'profile.js'));
});

// testing template with json
var articles = {
  'articleOne' : {
    title : "Article one",
    content : "This is article one"
  },
  'articleaTwo' : {
    title : "Article two",
    content : "This is article two"
  }
};

var funcCreateTemplate = function(articleData){
  var title = articleData.title;
  var content = articleData.content;
  var pageData = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
  return pageData;
};
app.get('/:articleName',function(req,res){
  var articleName = req.params.articleName;
  res.send(funcCreateTemplate(articles[articleName]));
});

app.listen(8080, function () {
  console.log(`VzBlog running on port 8080!`);
});
