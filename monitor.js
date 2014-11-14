
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var Neopixels = require('neopixels');

var ambient = ambientlib.use(tessel.port['A']);
var neo = new Neopixels();

var SOUND_LEVEL = 0.1;

var vals = [0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff];
var hexes = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36];
var NUM_FRAMES = 60;
var FRAME_MULTIPLIER = 4;
var NEO_LENGTH = 60;
var END_FADE_IN = 1;
var END_ANIMATION = 90;
var END_FADE_OUT = 91;
var animCount = 0;
var color = {
  r: 0x00,
  g: 0x11,
  b: 0x33
};

ambient.on('ready', function () {
  console.log('Ready to listen for sound events');
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(SOUND_LEVEL);

  ambient.on('sound-trigger', function(data) {
    console.log('Something happened with sound: ', data);

    ambient.clearSoundTrigger();
    var anim = Buffer.concat(fadeIn(NEO_LENGTH, NUM_FRAMES * FRAME_MULTIPLIER));

    neo.on('end', function() {
      console.log((animCount++), ' ended');
      if (animCount === END_FADE_IN) {
        anim = Buffer.concat(steady(NEO_LENGTH, NUM_FRAMES));
      } else if (animCount === END_ANIMATION) {
        anim = Buffer.concat(fadeOut(NEO_LENGTH, NUM_FRAMES * FRAME_MULTIPLIER));
      }

      if (animCount < END_FADE_OUT) {
        neo.animate(NUM_FRAMES, anim);
      } else {
        ambient.setSoundTrigger(SOUND_LEVEL);
        animCount = 0;
      }
    });

    console.log('starting neopixel animation');
    neo.animate(NUM_FRAMES, anim);
  });
});

ambient.on('error', function (err) {
  console.log(err);
});

function steady(numLEDs, numFrames) {
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);

    for (var i = 0; i < numLEDs; i++) {
      buf[i * 3] = 0x00;//vals[(i+k) % vals.length];
      buf[i * 3 + 1] = color.g;
      buf[i * 3 + 2] = color.b;
    }
    arr.push(buf);
  }
  
  return arr;
}

function pulse(numLEDs, numFrames) {
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);
    buf.fill(0);
    
    arr.push(buf);
  }
  
  return arr;
}

function fadeOut(numLEDs, numFrames) {
  var trail = 5;
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);

    var fadeValueB = Math.ceil(j * parseInt(color.b, 10) / numFrames);
    fadeValueB = hexes[fadeValueB];
    var fadeValueG = Math.ceil(j * parseInt(color.g, 10) / numFrames);
    fadeValueG = hexes[fadeValueG];
    console.log(j, fadeValueB);
    for (var i = 0; i < numLEDs; i++) {
      buf[i * 3] = 0x00;
      buf[i * 3 + 1] = color.g - fadeValueG;
      buf[i * 3 + 2] = color.b - fadeValueB;
    }
    arr.push(buf);
  }
  
  return arr;
}
function fadeIn(numLEDs, numFrames) {
  var trail = 5;
  var arr = [];
  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);

    var fadeValueB = Math.floor(j * parseInt(color.b, 10) / numFrames);
    fadeValueB = hexes[fadeValueB];
    var fadeValueG = Math.floor(j * parseInt(color.g, 10) / numFrames);
    fadeValueG = hexes[fadeValueG];
    console.log(j, fadeValueB);
    for (var i = 0; i < numLEDs; i++) {
      buf[i * 3] = 0x00;
      buf[i * 3 + 1] = 0x00 + fadeValueG;
      buf[i * 3 + 2] = 0x00 + fadeValueB;
    }
    arr.push(buf);
  }
  
  return arr;
}