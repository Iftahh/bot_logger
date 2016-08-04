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

// based on http://stackoverflow.com/a/7220510/519995
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

socket.on('botlogger message', function(msg) {
  var dict = JSON.parse(msg);
  $('.messages tbody').append($('<tr><td class="type">'+
    dict._type+"</td><td class='provider'>"+
    dict.messagingProvider+"</td><td><div class='message-json'>"+
    syntaxHighlight(JSON.parse(dict.message))+"</div></td></tr>")
  );
  // scroll to bottom
  window.scrollTo(0,document.body.scrollHeight);
});

