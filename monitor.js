
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var Neopixels = require('neopixels');

var ambient = ambientlib.use(tessel.port['A']);
var neo = new Neopixels();

var SOUND_TRIGGER = 0.1;

var vals = [0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff];
var NUM_FRAMES = 60;
var NEO_LENGTH = 60;
var END_FADE_IN = 1;
var END_ANIMATION = 90;
var END_FADE_OUT = 100;
var animCount = 0;

ambient.on('ready', function () {
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(SOUND_TRIGGER);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);

    ambient.clearSoundTrigger();
    var anim = Buffer.concat(fadeIn(NEO_LENGTH, NUM_FRAMES));

    neo.on('end', function() {
      console.log((animCount++), ' ended');
      if (animCount === END_FADE_IN) {
        anim = Buffer.concat(pulse(NEO_LENGTH, NUM_FRAMES));
      } else if (animCount === END_ANIMATION) {
        anim = Buffer.concat(fadeOut(NEO_LENGTH, NUM_FRAMES));
      }

      if (animCount < END_FADE_OUT) {
        neo.animate(NUM_FRAMES, anim);
      } else {
        ambient.setSoundTrigger(SOUND_TRIGGER);
        animCount = 0;
      }
    });

    console.log('starting neopixel animation');
    neo.animate(NUM_FRAMES, Buffer.concat(fadeIn(NEO_LENGTH, NUM_FRAMES*10)));
  });
});

ambient.on('error', function (err) {
  console.log(err);
});

function pulse(numLEDs, numFrames) {
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);
    buf.fill(0);
    var k = j / 20;
    for (var i = 0; i < numLEDs; i++) {
      buf[i * 3] = 0x00;//vals[(i+k) % vals.length];
      buf[i * 3 + 1] = 0x11;
      buf[i * 3 + 2] = 0x33;
    }
    arr.push(buf);
  }
  //console.log(arr);

  return arr;
}

function fadeOut(numLEDs, numFrames) {
  var trail = 5;
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);
    buf.fill(0);
    arr.push(buf);
  }
  //console.log(arr);

  return arr;
}
function fadeIn(numLEDs, numFrames) {
  var trail = 5;
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);
    buf.fill(0);
    var fadeValue = 0;//Math.floor(j / (numFrames / 32));
    for (var i = 0; i < numLEDs; i++) {
      buf[i * 3] = 0x00;
      buf[i * 3 + 1] = 0x00;
      buf[i * 3 + 2] = 0x11 + parseInt(fadeValue, 16);
    }
    arr.push(buf);
  }
  //console.log(arr);

  return arr;
}