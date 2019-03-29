//HTML elements
let sendButton = document.getElementById("send-button");
let clearButton = document.getElementById("clear-button")
let name;

var ws = new WebSocket(`wss://${location.host}/chat`);

//import
import {redraw, getDrawPaths, clearDrawPaths} from "./drawing.js";

// WebSocket stuff
let ws = new WebSocket(`wss://${location.host}/chat`);

ws.onopen = function () {
    setTitle("Connected to Chat Room");
    name = window.prompt("Please choose a user name: ");
};

ws.onclose = function () {
    setTitle("Disconnected from Chat Room");
};

function setTitle(title) {
    document.querySelector('h2').innerHTML = title;
}

//**********************************************************************************************************************
//receiving message from the server and processing it
ws.onmessage = function (msg) {
    let msgData = JSON.parse(msg.data);
    if (msgData.type === 'text') {
        printMessage(msgData);
    } else if (msgData.type === 'draw') {
        drawPicture(msgData);
    }
};

//print the received message into the screen
function printMessage(data) {
    var p = document.createElement('p');
    p.innerText = `${data.user} > ${data.message}`;
    document.getElementById("messageDisplay").appendChild(p);
}

//draw the received draw into the screen
function drawPicture(data) {
    let p = document.createElement('p');
    p.innerText = `${data.user} >`;
    let canvas = document.createElement('canvas');
    canvas.setAttribute("style", "border: black 1px solid");
    canvas.setAttribute("width", "500px");
    canvas.setAttribute("height", "500px");
    let context = canvas.getContext('2d');

    redraw(context, data.message.x, data.message.y, data.message.drag);
    document.getElementById("messageDisplay").appendChild(p);
    document.getElementById("messageDisplay").appendChild(canvas);
}

//**********************************************************************************************************************
//sending message to the server
document.forms[0].onsubmit = function () {
    var input = document.getElementById('message');
    const data = {
        type: "text",
        message: input.value,
        user: name
    };
    ws.send(JSON.stringify(data));
    input.value = '';
};

//send picture
sendButton.onclick = function (e) {
    const data = {
        type: "draw",
        message: getDrawPaths(),
        user: name
    }
    ws.send(JSON.stringify(data));
}

//**********************************************************************************************************************
//clear picture
clearButton.onclick = function (e) {
    clearDrawPaths();
}