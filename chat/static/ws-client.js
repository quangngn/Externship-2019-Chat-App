//HTML elements
var sendButton = document.getElementById("send-button");
var clearButton = document.getElementById("clear-button");
var name, username;

//import
import {redraw, getDrawPaths, clearDrawPaths} from "./drawing.js";

// WebSocket stuff
var ws = new WebSocket(`wss://${location.host}/chat`);

ws.onopen = function () {
    setTitle("Connected to Chat Room");
    name = window.prompt ("Please type in your username");
    username = name.bold();
};

ws.onclose = function () {
    setTitle("Disconnected from Chat Room");
};

function setTitle(title) {
    document.querySelector('h1').innerHTML = title;
}

//**********************************************************************************************************************
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

//print the received message into the screen
function printMessage(message) {
    var p = document.createElement('p');
    p.innerText = `${message.user} says ${message.message}`;
    document.getElementById("messageDisplay").appendChild(p);
}

//draw the received draw into the screen
function drawPicture(data) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute("style", "border: black 1px solid");
    canvas.setAttribute("width", "500px");
    canvas.setAttribute("height", "500px");
    var context = canvas.getContext('2d');

    redraw(context, data.x, data.y, data.drag);
    document.getElementById("messageDisplay").appendChild(canvas);
}

//**********************************************************************************************************************
//sending message to the server
document.forms[0].onsubmit = function () {
    var input = document.getElementById('message');
    const data = {
        type: "text",
        message: input.value,
        user: username

    };
    ws.send(JSON.stringify(data));
    input.value = '';
};

//send picture
sendButton.onclick = function (e) {
    const data = {
        type: "draw",
        message: getDrawPaths(),
        user: username
    }
    ws.send(JSON.stringify(data));
}

//**********************************************************************************************************************
//clear picture
clearButton.onclick = function (e) {
    clearDrawPaths();
}