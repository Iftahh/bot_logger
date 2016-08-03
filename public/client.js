var socket = io();

var num = (Math.random() * 1000)|0;

var nick = localStorage.nick;

if (!nick) {
  nick = "Duder"+num;
}

if (nick) localStorage.nick = nick;

socket.on("connect", function() {
  socket.emit('register', nick);
});

socket.on('chat message', function(msg) {
  var dict = JSON.parse(msg);
  $('.messages tbody').append($('<tr><td>'+
    dict._type+"</td><td>"+
    dict.messagingProvider+"</td><td><div class='message-json'>"+
    JSON.stringify(JSON.parse(dict.message), null, 2)+"</div></td></tr>"));
});

