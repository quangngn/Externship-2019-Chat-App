
export var ws = new WebSocket(`wss://${location.host}/chat`);
// var status = document.getElementById('messages');
// var myName = false;

//HTML elements
var sendButton = document.getElementById("send-button");
var clearButton = document.getElementById("clear-button");

import {redraw, getDrawPaths, clearDrawPaths} from "./drawing.js";




ws.onopen = function() {
    setTitle("Connected to Chat Room");
    // input.removeAttr('disabled');
    // status.text('Choose name:');
};

ws.onclose = function() {
    setTitle("Disconnected from Chat Room");
};

//receiving message from the server and processing it
ws.onmessage = function (msg) {
    console.log(msg.data);
    msg = JSON.parse(msg.data);
    if (msg.type === 'text') {
        printMessage(msg);
    } else if (msg.type === 'draw') {
        drawPicture(msg.message);
    }
};

function drawPicture(data) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute("style", "border: black 1px solid");
    canvas.setAttribute("width", "300px");
    canvas.setAttribute("height", "300px");
    var context = canvas.getContext('2d');

    console.log(data);
    redraw(context, data.x, data.y, data.drag);
    document.getElementById("messageDisplay").appendChild(canvas);
}


document.forms[0].onsubmit = function () {
    var input = document.getElementById('message');
    console.log (input);
    const data = {
        message: input.value,
        user: "Bob"
    };
    ws.send(JSON.stringify(data));
    input.value = '';
};

function setTitle(title) {
    document.querySelector('h2').innerHTML = title;
}

//send picture
sendButton.onclick = function (e) {
    const data = {
        type: "draw",
        message: getDrawPaths(),
        user: "Bob"
    }
    ws.send(JSON.stringify(data));
}


clearButton.onclick = function (e) {
    clearDrawPaths();
}

function printMessage(message) {
    var p = document.createElement('p');
    p.innerText = `${message.user} says ${message.message}`;
    document.getElementById("messageDisplay").appendChild(p);
}