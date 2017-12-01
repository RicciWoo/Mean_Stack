//var userSocketIds = [];

module.exports = function(io, socket) {
	//var userSocketIds = [];
	userSocketIds.push(socket);

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
		io.to(message.receiver).emit('chatMessage', message);
	});
    
    socket.on('disconnect', function() {
		io.emit('chatMessage', {
			type: 'status',
			text: 'disconnected',
			created: Date.now(),
			username: socket.request.user.username
		});
	});
};