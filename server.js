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
var messageNum = 0;
var participants = [];

function getFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + "_" +  hour + ":" + min + ":" + sec;

    /*alert(str);*/

    return str;
}

function sendMessage(data) {
  messageNum++;
  var date = new Date();
  var timestamp = getFormattedDate();
  msg = JSON.stringify({'data': data, index: messageNum, timestamp: timestamp });
  messages.push(msg);
  if (messages.length > 250) {
    messages = messages.slice(messages.length-250);  // avoid filling the server memory
  }
  io.emit('botlogger message', msg);
}

io.on('connection', function(socket) {
  var participant = {
    nick: null
  };
  participants.push(participant);

  // Play back all messages to connecting user
  messages.forEach(function(message) {
    socket.emit('botlogger message', message);
  });

  socket.on('register', function(name) {
    participant.nick = name;
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

// Configure BotKit Admin's message_logger to this URL
// BotKit will POST a JSON body with a description of the event (eg. message sent to user, message from user, error message, etc...)
app.post("/bot_logger", function (request, response) {
  sendMessage(request.body);
  response.sendStatus(200);
});

function remove(array, item) {
  index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
}
