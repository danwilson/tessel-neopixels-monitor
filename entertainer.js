
var tessel = require('tessel');
var Npx = require('npx');
var wifi = require('wifi-cc3000'),
    http = require('http');

var NEO_LENGTH = 60;

var c = { //needs to be grb instead of rgb?
  blue: [0, 17, 51],
  orange: [43, 73, 0],
  green: [65, 0, 13],
  violet: [0, 69, 35],
  teal: [81, 0, 76],
  yellow: [91, 104, 0]
};

var npx = new Npx(NEO_LENGTH);

var DELAY = 120; //60;
var MAX_ITERATIONS = 20;

var anims = [];
var keepRunning = false;
var isPlaying = false;
var iterations = 0;

colorWave(true);


function setupServer() {
  console.log('inside setupServer');
  http.createServer(function(req, res) {
    var command = req.url.substring(1);
    if (req.method === 'GET' && command === 'play') {
      console.log('play request');
      if (isPlaying) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('success, alreadyPlaying, keepRunning: ' + keepRunning);
        return;
      } else {
        keepRunning = true;
        if (anims.length) {
          run();
        } else {
          colorWave();
        }
      }

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('success, keepRunning: ' + keepRunning);
    } else if (req.method === 'GET' && (command === 'pause' || command === 'stop')) {
      console.log('stop request');
      keepRunning = false;

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('success, '/* + (isPlaying ? 'stillPlaying' : 'stopped')*/ + ' keepRunning: ' + keepRunning);
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><head><title>The Entertainer</title><meta name="viewport" content="width=device-width,initial-scale=1.0">'
        +'<style>body,input{margin:0;padding:0;}input {margin-top:1em;width:100%;height:50px;-webkit-appearance:none;-moz-appearance:none;border-radius:0;border:0;font-size:1.5em;color:#f5f6f9;}'
        +'[value="Play"] {background:#289830;}[value="Stop"] {background:#983028;}</style></head><body><input type="button" value="Play"><input type="button" value="Stop">'
        +'<script>var play=document.querySelector("[value=Play]");var stop = document.querySelector("[value=Stop]");'
        +'play.addEventListener("click", function(e) { window.open("/play") });'
        +'stop.addEventListener("click", function(e) { window.open("/stop") });'
        +'</script></body>');
    }
  }).listen(8056);
  console.log('exiting setupServer');
}

setTimeout(function() {
  if (wifi.isConnected()) {
    console.log('wifi connected');
    setupServer();
  } else {
    console.log('wifi set connect event listener');
    wifi.connect({
      security: 'wpa2',
      ssid: '',
      password: '',
      timeout: 30 // in seconds
    });
    wifi.on('connect', setupServer);
  }
}, 1000);

function colorWave(delay) {
  for (var c = 0, len = NEO_LENGTH; c < len; c++) {
    var anim1 = npx.newAnimation(1);
    console.log(c, '/', len);
    anim1.setPattern(initialPattern(c, NEO_LENGTH));
    anims.push(anim1);

    npx.enqueue(anims[c], DELAY);
  }
  run(delay);
}

function run(delay) {
  if (delay !== true) {
    iterations++;
    isPlaying = true;
    npx.run().then(function() {
      console.log(keepRunning);
      if (keepRunning && iterations < MAX_ITERATIONS) {
        run();
      } else {
        isPlaying = false;
        iterations = 0;
        npx.enqueue(npx.newAnimation(1).setAll('#000000')).run().then(function() {
          npx.queue.pop(); //remove the "OFF" animation for future plays
        });
      }
    });
  }
}

function initialPattern(start, length) {
  var ra = [];
  for (var i = start, l = start + length; i < l; ++i) {
    var imod = i % length;
    if (imod >= 0 && imod < 10) {
      ra.push(c.blue);
    } else if (imod >= 10 && imod < 20) {
      ra.push(c.orange);
    } else if (imod >= 20 && imod < 30) {
      ra.push(c.green);
    } else if (imod >= 30 && imod < 40) {
      ra.push(c.blue);
    } else if (imod >= 40 && imod < 50) {
      ra.push(c.violet);
    } else {
      ra.push(c.teal);
    }
  }
  return ra;
}

