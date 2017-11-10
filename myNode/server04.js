// Test order of Connect middleware
var connect = require('connect');
var app = connect();

var logger = function(req, res, next) {
  console.log(req.method, req.url);
  // next() call next middleware which is helloWorld
  // remove next(), it won't call helloWorld,
  // which means it will never meet res.end(),
  // which means the request will hang forever
  next();
};

var helloWorld = function(req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
  //res.write('Hello World');
  //res.end();
  // if no res.end(), the request will hang forever
};

// Notice how the logger() middleware is registered
// before the helloWorld() middleware
app.use(logger);
app.use(helloWorld);
app.listen(3000);

console.log('Server running at http://localhost:3000/');
