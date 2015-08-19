tessel-neopixels-monitor
===================

Tessel projects using the ambient module and/or a strand of neopixels. Potential use case as a baby monitor.

Each of these projects require a [Tessel](https://tessel.io) and [NeoPixels](http://www.adafruit.com/category/168) (defaulting to the 60-LED strand, but can be adapted to any other NeoPixel configuration).  Additional requirements listed below for individual projects as needed.

## monitor.js

* Requires the [Tessel Ambient Module](https://tessel.io/modules#module-ambient)

A flight attendant once told me how much he liked his plane's new overhead LED lgihting because they could change it to blue, and the babies would stop crying.  I had never heard this, but many people do say this is true (of course, there is also research that says it's red, etc.). Either way, this project is hypothetical as a baby monitor in that it listens for crying, and will gently turn the lights on and let them linger before fading out. NeoPixels are bright so it makes sense to hide behind another object and let the glow be the focus.

To get started, clone this repo and (with the Tessel connected to your machine) run in Terminal

``` bash
npm install
tessel run monitor.js
```

Then have a baby cry or clap your hands... whichever is more readily available.

## entertainer.js

Continuing the baby trend, this is an entertainer.  Putting the LEDs and Tessel behind a dresser or other object with the lights facing a wall, this will create a cascading color effect along the wall.  Instead of being triggered by sound, it is activated by a website with Play and Stop buttons.  Press Play to start the effect and it will loop 20 times before stopping. Or you can press the Stop button to stop it early (though it will finish the current iteration).

To get started, clone this repo and (with the Tessel connected to your machine) run in Terminal

``` bash
npm install
tessel wifi -l
tessel run entertainer.js
```

Note the Ip listed for your wifi connection during the `tessel wifi -l` command as this is where your site will be accessible in the browser.

After it is running, open a browser at http://xx.xx.xx.xx:8056 using the IP address the Tessel is using. This opens the controller.

You can edit the JS file and add your ssid and wifi password to help with reconnecting if wifi disconnects while running.
