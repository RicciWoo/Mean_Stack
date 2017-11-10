// Configuring an Express application
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// make sure Mongoose configuration file is loaded before
// any other configuration in the server.js
var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);

module.exports = app;

console.log('Server running at http://localhost:3000/');
