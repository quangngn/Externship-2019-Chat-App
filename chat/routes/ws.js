var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 3000 });
let express = require('express');
let app = express();

const rootDir = './static'
app.use(express.static(rootDir));

wss.on("connection", function(ws) {

    ws.on("message", function(message) {

        if (message === 'exit') {
            ws.close();
        } else {

            wss.clients.forEach(function(client) {
                client.send(message);
            });

        }

    });

    ws.send("Welcome to cyber chat");

});