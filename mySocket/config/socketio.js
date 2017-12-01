var config = require('./config'),
  cookieParser = require('cookie-parser'),
  passport = require('passport');

module.exports = function(server, io, mongoStore) {
  io.use(function(socket, next) {
    cookieParser(config.sessionSecret)(socket.request, {},
    function(err) {
      var sessionId = socket.request.signedCookies['connect.sid'];
      
      mongoStore.get(sessionId, function(err, session) {
        socket.request.session = session;
        
        passport.initialize()(socket.request, {}, function() {
          passport.session()(socket.request, {}, function() {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          })
        });
      });
    });
  });

  var userSocketIds = [];

  io.on('connection', function(socket) {
    //require('../app/controllers/chat.server.controller')(io, socket);


//module.exports = function(io, socket) {
  //var userSocketIds = [];
  userSocketIds[socket.request.user.username] = socket.id;

  io.emit('chatMessage', {
    type: 'status',
    text: 'connected',
    receiver: 'everyone',
    created: Date.now(),
    username: socket.request.user.username
  });

  socket.on('chatMessage', function(message) {
    message.type = 'message';
    message.created = Date.now();
    message.username = socket.request.user.username;
    //io.emit('chatMessage', message);
    io.to(userSocketIds[message.receiver]).emit('chatMessage', message);
  });
    
    socket.on('disconnect', function() {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username
    });
  });
//};


  });
};