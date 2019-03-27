const express = require('express');

var app = express();
var expressWs = require('express-ws')(app);

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const rootDir = 'static';
app.use(express.static(rootDir));

app.listen(port, function() {
   console.log('Chat server running on port ' + port);

});

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

module.exports = app;
