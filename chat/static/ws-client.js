var sendButton = document.getElementById("send-button");
var clearButton = document.getElementById("clear-button")

//import
import {redraw, getDrawPaths, setDrawPaths} from "./drawing.js";

var ws = new WebSocket(`wss://${location.host}/chat`);

ws.onopen = function() {
    setTitle("Connected to Chat Room");
};

ws.onclose = function() {
    setTitle("Disconnected from Chat Room");
};

function setTitle(title) {
    document.querySelector('h1').innerHTML = title;
}

//receiving message from the server and processing it
ws.onmessage = function(message) {
    if(message.type === 'text') {
        printMessage(message.data);
    } else if (message.type === 'draw') {
        drawPicture(message.data);
    }
};

function printMessage(message) {
    var p = document.createElement('p');
    p.innerText = message;
    document.querySelector('div.messages').appendChild(p);
}

function drawPicture(data) {

}

//sending message to the server
document.forms[0].onsubmit = function () {
    var input = document.getElementById('message');
    const data = {
        type: "text",
        message: input.value,
        user: "Bob"
    };
    ws.send(JSON.stringify(data));
    input.value = '';
};

//send picture
sendButton.onclick = function (e) {
    ws.send(JSON.stringify(
        {type: "draw",
                data: getDrawPaths(),
                user: "Bob"}));
}

//clear picture
clearButton.onclick = function (e) {
    setDrawPaths([],[], []);
}