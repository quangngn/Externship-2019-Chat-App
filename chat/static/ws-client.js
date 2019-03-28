//import * as drawing from "drawing";
//console.log(drawing);

var script = document.createElement('script');
script.src = 'drawing.js';
document.head.appendChild (script);

export var ws = new WebSocket(`wss://${location.host}/chat`);

ws.onopen = function() {
    setTitle("Connected to Chat Room");


};

ws.onclose = function() {
    setTitle("Disconnected from Chat Room");
};

ws.onmessage = function(message) {
    printMessage(message.data);
};

document.forms[0].onsubmit = function () {
    var input = document.getElementById('message');
    const data = {
        message: input.value,
        user: "Bob"
    };
    ws.send(JSON.stringify(data));
    input.value = '';
};

function setTitle(title) {
    document.querySelector('h1').innerHTML = title;
}

function printMessage(message) {
    var p = document.createElement('p');
    p.innerText = message;
    document.querySelector('div.messages').appendChild(p);
}