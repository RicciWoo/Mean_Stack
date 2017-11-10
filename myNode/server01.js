// A basic Node web server, using low-level APIs
// The http module is used to create a small web server
// listening to the 3000 port.
// The callback function gets called whenever there's
// an Http request sent to the web server.
var http = require('http');

http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'  // respoding with HTTP
    //'Content-Type': 'html/plain'  // responding with HTML
  });
  res.end('Hello World');  // finalize the response
  //res.write('Hello World');
  //res.end();
}).listen(3000);  // listen to the 3000 port

console.log('Server running at http://localhost:3000/');
