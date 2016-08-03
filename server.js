// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());

var messages = [];
var participants = [];

function sendMessage(msg) {
  messages.push(msg);
  io.emit('chat message', msg);
}

io.on('connection', function(socket) {
  var participant = {
    nick: null
  };
  participants.push(participant);

  // Play back all messages to connecting user
  messages.forEach(function(message) {
    socket.emit('chat message', message);
  });

  socket.on('register', function(name) {
    participant.nick = name;
  });

  socket.on('chat message', function(msg) {
    sendMessage(participant.nick+": "+msg);
  });

  socket.on('disconnect', function() {
    remove(participants, participant);
  });
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// listen for requests :)
listener = http.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/bot_logger", function (request, response) {
  sendMessage(JSON.stringify(request.body))
  response.sendStatus(200);
});

function remove(array, item) {
  index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
}
