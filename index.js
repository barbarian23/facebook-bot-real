var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

const APP_SECRET = '23d5e19704ac7df876be212ceef227ff';

const PAGE_ACCESS_TOKEN = "EAAKQRuPa1hEBAOT6f0Mv0qZCZBLgYZA0puL5G08upfSyENDL7SI7Ps9G2pXlZAcZAIk8ieZBbCrbZAWJ7n7Uv9tzYqBVbjsEBLL4en9kZCuDa0zgq83CoQZChCUMp8IWsZAtbXhOSI4NCCifqduEcynqC5xpG8hkpWfRfbco2fhk8yMgZDZDgit";
//do face cung cap
//const VALIDATION_TOKEN = "EAAKQRuPa1hEBAOOePW5rIrFPlN1IPBkZAKD7XCs6tHXibPnRTfQiNMyACKkTMOKmOj8AeX0odAWArSpTlUcA9dHG3JmBZASUDbkczRS8l7i9GqAurJbfCzEziZCrLQDlroBwpxAbsZAqZBLllzTUw41p2rVy7wciJC0ir1WhCzv0UXyA3LUyseP1lxuvClmgZD";
const VALIDATION_TOKEN = "upitasia";
var app = express();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}));
//var server = http.createServer(app);
var request = require("request");


app.set('port', process.env.PORT || 3000);
//app.set('ip', process.env.IP || "0.0.0.0");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) { // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) { // cẩn thận phần này
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook', function(req, res) { // Phần xử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          console.log("A new message from user ",senderId," with message ",messaging)
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

//Gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})