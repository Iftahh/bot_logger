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

  var jets = new Jets({
    searchTag: '#jetsSearch',
    contentTag: '#jetsContent',
  //  columns: [0] // optional, search by first column only
  });

$('#jetsSearch').focus();

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

function typeToIcon(type) {
  if (type == "send_to_user") {
    return "send_to_user<br><strong style='color:green; font-size: 1.2em'>&gt;_</strong> &rarr; <span style='font-size:0.8em'>&#9786;</span>";
  }
  if (type == "sent_from_user") {
    return "sent_from_user<br> <strong style='font-size:1.2em'>&#9786;</strong> &rarr; <span style='color:green; font-size:0.8em'>&gt;_</span>";
  }
  if (type == "error_dev_url_response") {
    return "error_dev_url_response<br><span style='font-size:1.2em'>&#9888;</span>";
  }
  return type;
}

socket.on('botlogger message', function(msg) {
  msg = JSON.parse(msg);
  var data = msg.data;
  var jmsg = data? data.message : null;
  try {
    jmsg = JSON.parse(data.message);
  } catch(e) {
  }


  $('.messages tbody').append($('<tr><td class="index">'+msg.index+'</td><td class="timestamp">'+msg.timestamp+
  '</td><td class="type">'+
    typeToIcon(data._type)+"</td><td class='provider'>"+
    data.messagingProvider+"</td><td><div class='message-json'>"+
    syntaxHighlight(jmsg)+"</div></td></tr>")
  );
  jets.update();
  // scroll to bottom
  window.scrollTo(0,document.body.scrollHeight);
});


