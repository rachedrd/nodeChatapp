module.exports = function(io, rooms){
var chatrooms = io.of('/roomlist').on('connection', function(socket){
	console.log('connection estableshed on the server');
	socket.emit('roomupdate', JSON.stringify(rooms));
	socket.on('newroom', function(data){
		rooms.push(data);
		socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
		socket.emit('roomupdate', JSON.stringify(rooms));
	})
});

var messages = io.of('/messages').on('connection', function(socket){
	//console.log('connected to the chatroom');
	//{room: roomNum, user: user_name, userpic: user_pic}
	socket.emit('roomupdate', JSON.stringify(rooms));
	socket.on('joinroom', function(data){
		socket.username = data.user;
	//	socket.room = data.room;
		socket.userpic = data.userpic;
		socket.join(data.room);
		updateUserList(data.room, true)
	})
	socket.on('newMessage', function(data){
		socket.broadcast.to(data.roomNumber).emit('messagefeed', JSON.stringify(data));
	})
	function updateUserList(room, isUpdate)
	{
		var getUsers = io.of('/messages').clients(room);
		var userlist = [];
		for (var i in getUsers ) {
			userlist.push({user: getUsers[i].username, userpic: getUsers[i].userpic })
		};
		socket.to(room).emit('updateUsersList', JSON.stringify(userlist));
		if(isUpdate)
		{
			socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userlist));
		}
	}
	socket.on('updateList', function(data){
		updateUserList(data.room);
	})
});

}



































