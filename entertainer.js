
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var Npx = require('npx');

var ambient = ambientlib.use(tessel.port['A']);

var SOUND_LEVEL = 0.1;

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

var anims = [];
var DELAY = 120; //60;
keepRunning = true;
colorWave();

// ambient.on('ready', function () {
//   console.log('Ready to listen for sound events');
//   // The trigger is a float between 0 and 1
//   ambient.setSoundTrigger(SOUND_LEVEL);

//   ambient.on('sound-trigger', function(data) {
//     console.log('Something happened with sound: ', data);

//     ambient.clearSoundTrigger();

//     //start wave animation
//     colorWave();
//   });
// });

// ambient.on('error', function (err) {
//   console.log(err);
// });

function colorWave() {
  for (var c = 0, len = NEO_LENGTH; c < len; c++) {
    var anim1 = npx.newAnimation(1);
    console.log(c, '/', len);
    anim1.setPattern(initialPattern(c, NEO_LENGTH));
    anims.push(anim1);
  }
  run();
}

function run() {
  for (var c = 0, len = anims.length; c < len; c++) {
    npx.enqueue(anims[c], DELAY);
  }
  npx.run().then(function() {
    if (keepRunning) {
      run();
    } else {
      npx.enqueue(npx.newAnimation(1).setAll('#000000')).run();
    }
  });
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

