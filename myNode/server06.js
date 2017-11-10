// use package.json and npm install to install Express
var express = require('express');
var app = express();

app.use('/', function(req, res) {
  res.send('Hello World');
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');

// The module.exports object is used to return
// the application object
module.exports = app;
