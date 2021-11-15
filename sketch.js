// The muse client.
let client;

// The fft object.
let fft;

// How many samples do we analyze at a time with the FFT.
let fftBufferSize = 256;

// The amount of samples per second provided by the Muse.
let samplingFrequencyHz = 256;

// The electrode that we are interested in.
let electrode = 0;

// The sample buffer for the electrode above.
// We will keep accumulating up to fftBufferSize, then remove those and analyze them.
let samples = [];

let totalSamplesProcessed = 0;

let alpha = 0;
let beta = 0;
let theta = 0;
let delta = 0;

function setup() {
  createCanvas(1024, 400);
  client = new muse.musejs.MuseClient();
  fft = new FFT(fftBufferSize, samplingFrequencyHz);

  setupGui();
}

function draw() {
  background(0);

  // The spectrum here will be broken up into fftBufferSize / 2 bands.
  // The center frequencies of each band are noted below.

  // To caculate the amount of "alpha" waves, you will want to pay attention
  // to the total activity in the 9-14 Hz bands (for instance). Here we just
  // add up the contributions in each of the ranges.

  alpha = 0;
  beta = 0;
  theta = 0;
  delta = 0;

  // If a spectrum has been clalculated ...
  // The spectrum is the power in each frequency bin.
  let boxWidth = width / fft.spectrum.length;
  let x = 0;
  let y = height;
  let peak = fft.peak; // The value of the max peak.
  let peakBand = fft.peakBand; // The index with the max peak.
  for (let i = 0; i < fft.spectrum.length; i++) {
    let w = boxWidth;
    let x = i * w;
    let h = map(fft.spectrum[i], 0, peak, 0, height);

    // Pick the box fill color based on if it is the max peak.
    if (i == peakBand) fill("red");
    else fill("blue");

    // Negative height to draw upward.
    rect(x, y, w, -h);

    let bandCenterFrequency = fft.getBandFrequency(i);

    push();
    translate(x + w / 2, y - 10);
    rotate(PI / 2);
    fill("white");
    textSize(8);
    textAlign(RIGHT);
    text(bandCenterFrequency + " Hz", 0, 0);
    pop();

    if (bandCenterFrequency >= 1 && bandCenterFrequency <= 3) {
      delta += fft.spectrum[i];
    } else if (bandCenterFrequency >= 4 && bandCenterFrequency <= 8) {
      theta += fft.spectrum[i];
    } else if (bandCenterFrequency >= 9 && bandCenterFrequency <= 14) {
      alpha += fft.spectrum[i];
    } else if (bandCenterFrequency >= 15 && bandCenterFrequency <= 30) {
      beta += fft.spectrum[i];
    }
  }

  fill(255);
  textSize(20);
  text("Total Samples Processed: " + totalSamplesProcessed, 10, 20);
  text("Alpha: " + alpha, 10, 40);
  text("Beta : " + beta, 10, 60);
  text("Delta: " + delta, 10, 80);
  text("Theta: " + theta, 10, 100);
}

function setupGui() {
  const connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
  const disconnectButton = createButton("Disconnect");
  disconnectButton.mousePressed(disconnect);
}

async function connect() {
  if (client) {
    try {
      await client.connect();
      await client.start();

      client.eegReadings.subscribe((reading) => {
        // Unpack the samples from each EEGReading.
        // Each eeg reading is this data structure:
        // https://github.com/urish/muse-js/blob/master/src/lib/muse-interfaces.ts#L1-L6
        if (reading.electrode == electrode) {
          // Add the new samples to the existing samples.
          samples = samples.concat(reading.samples);

          // Keep track of this for reference.
          totalSamplesProcessed += reading.samples.length;

          // If we have enough samples in our sample buffer,
          // then do the fft.
          while (samples.length >= fftBufferSize) {
            // Process some samples from our buffer.
            fft.forward(samples.slice(0, fftBufferSize));
            // Remove the samples that were processed from our buffer.
            samples = samples.slice(fftBufferSize);
          }
        }
      });

      // The following data tracks head movement and might
      // be nice to use to move particles around too ...

      // See this for the data structures used
      // https://github.com/urish/muse-js/blob/master/src/lib/muse-interfaces.ts#L21-L24

      // client.telemetryData.subscribe((telemetry) => {
      //   console.log(telemetry);
      // });
      // client.accelerometerData.subscribe((acceleration) => {
      //   console.log(acceleration);
      // });
      // client.gyroscopeData.subscribe((gyro) => {
      //   console.log(gyro);
      // });
    } catch (err) {
      console.error(err);
    }
  }
}

async function disconnect() {
  if (client) {
    await this.client.disconnect();
  }
}
