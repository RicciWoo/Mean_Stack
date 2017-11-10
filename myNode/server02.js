// Test Connect module
// first install connect: npm install connect
// response: Cannot GET /
var connect = require('connect');
var app = connect();
app.listen(3000);

console.log('Server running at http://localhost:3000/');
