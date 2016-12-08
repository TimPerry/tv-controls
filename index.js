var express = require('express')
var app = express()
var request = require('request')
var SkyRemote = require('sky-remote');

var adb = require('adbkit')
var client = adb.createClient()

var fireTvId = 0
client.connect('192.168.1.12')
  .then(function(id) {
    fireTvId = id
    console.log(`Connected to FireTV with device id of ${id}`)
  })
  .catch(function(err) {
    console.error('Something went wrong connecting to FireTV:', err.stack)
  })

var denon = require('denon-avr');
var avr = new denon(new denon.transports.telnet({
  host: '192.168.1.10',     // IP address or hostname
  debug: true   // Debug enabled
}));
avr.connect();

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  avr.getConnection().destroy();
  process.exit(0);
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/firetv/:app', function (req, res) {
 avr.send('SIBD', '', function(err, state) {
   if (err && err.length) {
     return res.send(err)
   }
   var apps = {
     netflix: 'com.netflix.ninja',
     youtube: 'org.chromium.youtube_apk',
     iplayer: 'uk.co.bbc.iplayer',
     home: 'com.amazon.tv.launcher'
   }
   var packageName = apps[req.params.app]
   if(!packageName) {
     return res.send('Invalid app')
   }
   client.shell(fireTvId, `monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`)
     .then(adb.util.readAll)
     .then(function(output) {
       console.log(output.toString().trim())
       res.send('done')
     })
   }, 'Unable to select fire tv input on avr')
})

app.get('/avr/vol/:ammount', function (req, res) {
  avr.setVolumeAscii(req.params.ammount, function(err, volume) {
    if (err) {
      console.log(err.toString());
      res.send('error: ' + err.toString()) 
      return;
    }
 
    res.send('done') 
    console.log('The volume is now', volume, '/', avr.parseAsciiVolume(volume), 'dB');
  });
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
