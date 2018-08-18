'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello PLatziPizza!')
})

app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "pLatziPizza_bot_says_hello") {
    res.send(req.query["hub.challenge"]);
  } else {
    res.send("PLatziPizza_bot_says_bye");
  }
});

app.post('/webhook', function (req, res) {
  const data = req.body;
  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      pageEntry.messaging.forEach(function (messagingEvent) {
        receiveMessage(messagingEvent);
      });
    });
    res.sendStatus(200);
  }
});

const receiveMessage = (event) => {
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  };
  sendMessage(messageData);
}

const sendMessage = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAACvfQZANqcMBABfZBc2kGfGF5JfOrXhbZAf2MEsrL7masS8TB1eNl3X3tKE85VVXLCsWK0FsaKD8He4gQdK8ZBJkafqI6ZAPrGZBgJ9OW1ZAIKqGOAv2rW0PUW2Nr8BZCkqCTsKSgWX4gqHnFGq7NqsXdk0OYmzREsdi5FBMZAeZCnAZDZD"
    },
    method: 'POST',
    json: messageData
  }, function (error, response, data) {
    if (error) {
      console.log('No es posible enviar el mensaje');
    } else {
      console.log("Mensaje enviado...");
    }
  });
}

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});