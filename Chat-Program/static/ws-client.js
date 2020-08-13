//HTML elements
let sendButton = document.getElementById("send-button");
let clearButton = document.getElementById("clear-button")
let name;

//import
import {redraw, getDrawPaths, clearDrawPaths} from "./drawing.js";

// WebSocket stuff
let ws = new WebSocket(`wss://${location.host}/chat`);

ws.onopen = function () {
    setTitle("Connected to Chat Room");
    name = window.prompt("Please choose a user name: ");
    name.bold();
    if(name == null) {
        ws.onclose;
    }
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
    //make the newest message appears in the Chat-Program box
    document.getElementById("messageDisplay").scrollTop = document.getElementById("messageDisplay").scrollHeight;
}

//draw the received draw into the screen
function drawPicture(data) {
    let p = document.createElement('p');
    p.innerText = `${data.user} >`;

    //redraw the canvas
    let canvas = document.createElement('canvas');
    canvas.setAttribute("style", "border: black 1px solid");
    canvas.setAttribute("width", "500px");
    canvas.setAttribute("height", "500px");
    let context = canvas.getContext('2d');
    redraw(context, data.message.x, data.message.y, data.message.drag);

    //convert the just drawn canvas to image
    let image = document.createElement("img");
    image.src = canvas.toDataURL('image/png');
    image.width = 200;
    image.height = 200;
    image.setAttribute("style", "border: 1px solid black");

    document.getElementById("messageDisplay").appendChild(p);
    document.getElementById("messageDisplay").appendChild(image);
    //make the newest message appears in the Chat-Program box
    document.getElementById("messageDisplay").scrollTop = document.getElementById("messageDisplay").scrollHeight;
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