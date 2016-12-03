var express = require('express')
var app = express()
var request = require('request')
var SkyRemote = require('sky-remote');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/sky/:state', function (req, res) {
  var remoteControl = new SkyRemote('192.168.1.11');

  remoteControl.press('power', function(err) {
    if (err) {
        console.log("Woah! Something went wrong. Cry time.");
    } else {
        console.log("I just pressed the Channel Up command.");
    };
    res.send('done')
  });
})

app.get('/ps4/:state', function (req, res) {
  const spawn = require('child_process').spawn;
  var args = req.params.state === 'true' ? [] : ['standby']
  spawn('./node_modules/.bin/ps4-waker', args, { stdio: 'inherit' }); 
  res.json({done: true});
})


app.get('/tv/:state', function (req, res) {

  console.log("Setting TV to ", req.params.state)

   var status = req.params.state === 'true' ? true : false

  var postData = {"id":2,"method":"setPowerStatus","version":"1.0","params":[{ "status": status}]}
  var url = 'http://192.168.1.16/sony/system';
  var options = {
    method: 'post',
    body: postData,
    headers: {
      "X-Auth-PSK": "0000",
      "Content-Type": "application/json"
    },
    json: true,
    url: url
  }

  request(options, function(err, req_res, body) {
    res.send(body)
  })
})

app.listen(4242, function () {
  console.log('App listening on port 4242!')
})
