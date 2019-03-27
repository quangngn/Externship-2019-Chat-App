const express = require('express');
const https = require('https');
const fs = require('fs');
const rootDir = 'static';
const port = 3000;
var app = express ();

var server = https.createServer({
   key: fs.readFileSync('server.key'),
   cert: fs.readFileSync('server.cert')
}, app);

var expressWs = require('express-ws')(app,server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(rootDir));

let clients = [];
let messages = [];

app.ws('/chat', function(ws, req) {
   clients.push(ws);
   console.log(`connected. Now have ${clients.length} clients`);

   messages.forEach(msg => {
      ws.send(msg);
   });

   ws.on('message', function(msg) {
      const data = JSON.parse(msg);

      messages.push(data);

      clients.forEach(ws => {
         ws.send(`${data.user} says ${data.message}; (sent to ${clients.length} clients)`);
      })
   });

   ws.on('close', () => {
      clients = clients.filter(cli => {
         return cli !== ws;
      });
   })
});


server.listen (port , () => {
   console.log (`Listening on ${port}`)
});