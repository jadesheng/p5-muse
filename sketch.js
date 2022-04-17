// The muse client.
let client;

// The fft object.
let fft;

// How many samples do we analyze at a time with the FFT.
let fftBufferSize = 128;

// The amount of samples per second provided by the Muse.
let samplingFrequencyHz = 128;

// The electrode that we are interested in.
let electrode = 2;

// The sample buffer for the electrode above.
// We will keep accumulating up to fftBufferSize, then remove those and analyze them.
let samples = [];

let totalSamplesProcessed = 0;

let alpha = 0;
let beta = 0;
let theta = 0;
let delta = 0;

let gyro;
let accel;

let colors = [50,100,150,200,255,255,255,"#bdffee", "#bdd4ff","#e1bdff","#ffbdd4"]

// let words =["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z","past", "glimmer", "regrets", "future", "death", "life", "seconds", "minutes", "love", "fear", "familiar", "loss", "hope", "noise", "silence", "breath", "pain", "weight","they", "she", "he", "it", "what", "the", "stranger", "God", "nobody", "someone", "are", "stranger", "other", "I", "you", "is"]
// let words1 =["they", "she", "he", "it", "what", "the", "stranger", "God", "nobody", "someone", "are", "stranger", "other", "I", "you", "is"]

let words =[ "she was", "he hears", "it is", "what it is", "awakening","past", "glimpse of life", "future", "beyond death", "was here", "you", "are now", "familiar", "I am", "silence", "breath", "painless", "of light", "she is", "seeking truth", "at peace"]
let words1 =["they don't see",, "that stranger", "God", "people", "flicker","needing someone", "I", "I have loved", "others", "seconds", "minutes", "be tired", "fear not","he hears not", "meaningless", "what", "the", "point", "nobody", "someone", "are", "stranger", "other", "so", "you", "is"]
let words2 = [ "Godless", "fear of", "meaningless", "be angry", "be lost", "endless", "floating", "noise", "call off", "the", "search", "pointless", "I have lost","glimpse of death", "regrets", "cease to exist", "no one", "gggg", "ptttt", "fkfk", "haha","shhhh","oooot","dnkdnk"];
let words3 = ["a", "b", "chhhht", "ding", "e", "pfff", "g", "hmmm", "i", "j", "kkkk", "l", "m", "n", "ooot", "p", "q", "r", "s", "tzk", "u", "v", "w", "x", "y","fzzzz"];
let words4 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
//let soundFileNames = ["assets/ping.wav"];
let track1;
//let sounds = [];

let particles = [];
let numParticles;

let specialElite;
function preload() {
  specialElite = loadFont("SpecialElite-Regular.ttf");

  // for (let i = 0; i < soundFileNames.length; i++)
  // {
  //   sounds[i] = loadSound(soundFileNames[i])
  // }

  track1 = loadSound("assets/ping.wav", loaded);
}


function setup() {
  createCanvas(1980, 1080);
  background(0);
  noCursor();
  client = new muse.musejs.MuseClient();
  fft = new FFT(fftBufferSize, samplingFrequencyHz);

  gyro = createVector(0, 0, 0);
  accel = createVector(0, 0, 0);

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
   // if (i == peakBand) fill("red");
   // else fill("blue");

    // Negative height to draw upward.
   // rect(x, y, w, -h);

    let bandCenterFrequency = fft.getBandFrequency(i);

    push();
    translate(x + w / 2, y - 10);
    rotate(PI / 2);
    fill("white");
    textSize(8);
    textAlign(RIGHT);
    //text(bandCenterFrequency + " Hz", 0, 0);
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
  textSize(10);
  //text("Total Samples Processed: " + totalSamplesProcessed, 10, 20);
  //text("Alpha: " + alpha, 10, 40);
  text("Beta : " + beta, 10, 40);
  //text("Delta: " + delta, 10, 80);
  //text("Theta: " + theta, 10, 100);

  push();
  translate(width/2, height /2);
  // make a copy of the accel vector
  // console.log(gyro);

  // let a = gyro.copy();
  // // // makes it length 1
  // a.normalize();
  // // // draw an arrow of length 35.
  // drawArrow(a, a.mult(100), 'yellow');

  pop();


  if (beta > 500){
    numParticles = 3;
    
  }

  else if (beta == 0){
    numParticles = 0;
  }

  else if (beta > 400 && beta < 500){
    numParticles = 2;
  }

  else if (beta > 200 && beta < 400){
    numParticles = 1;
  }

  else if (beta > 50 && beta < 200){
    numParticles = 1;
  }

  else {numParticles = 1};

  shower();
  particles.forEach(p => {
    if (beta > 550){
      p.gravity = createVector(5,0,0);
      p.maxAge = random(15, 25); //CHANGE 03
      
    }
    else if (beta > 400 && beta < 550){
      p.gravity = createVector(3,0,0);
      p.maxAge = random(20, 50); //CHANGE 04
    }

    else if (beta > 200 && beta < 400){
      p.gravity = createVector(1,0,0);
      p.maxAge = random(30, 60);
    }
  
    else if (beta > 50 && beta < 200){
      p.gravity = createVector(0.5,0,0);
    }

    else {p.gravity = createVector(0,0,0);
      p.maxAge = random(60, 100); //CHANGE05
      
      }
    p.update();
    drawParticle(p);
  })

  for (let p of particles) {
    if (p.isDead) {
      // Something is getting undefined here ... ?
      //p.sound.play();
    }
  }

  // Delete out all dead particles.
  particles = particles.filter(particle => { return !particle.isDead} );


}

//https://p5js.org/reference/#/p5.Vector/normalize
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
} 


function setupGui() {
  const connectButton = createButton("Connect");
  //connectButton.position(5, 60);
  connectButton.mousePressed(connect);
  // const disconnectButton = createButton("Disconnect");
  // disconnectButton.mousePressed(disconnect);
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
      client.accelerometerData.subscribe((accelReading) => {
        for(let sample of accelReading.samples)
        {
          accel = createVector(sample.x, sample.y, sample.z);
        }
      });
      client.gyroscopeData.subscribe((gyroReading) => {
        // console.log(gyroReading);


        for(let sample of gyroReading.samples)
        {
          gyro = createVector(sample.x, sample.y, sample.z);
        }

      });
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

function drawParticle(particle) {
  let ageSize = map(particle.age, 0, particle.maxAge, 0, 0.2);
  
  push();
  translate(particle.position.x, particle.position.y);
  rotate(particle.angle.z);
  noStroke();
  fill(particle.fill);
  //circle(-5, -5, particle.size);
  textFont(specialElite);
  textAlign(CENTER);
  textSize(particle.size);
  text(particle.word,0,0);
  pop();
  
  if (particle.age > particle.maxAge) {
  particle.size = particle.size - ageSize;
  particle.fill = particle.fill - 10;
   }
  if (particle.size - ageSize <= 0) {
    particle.isDead = true;
   }
  if (particle.position.x > width-350)  //CHANGE 07
  {
    particle.position.x = width-350;   //CHANGE 08
    particle.velocity.x *= random(-0.9,-0.5);  //CHANGE 09
  }
  // if (particle.position.y > height/2+160 && particle.position.x > width/2-115 && particle.position.x < width/2+115)
  // {
  //   particle.position.y = height/2+160;
  //   particle.velocity.y *= random(-0.9,-0.5);
  // }
  
}

function shower(){
   for (let i = 0; i < numParticles; i++)
  {
    let particle = new Particle();
    // particle.acceleration = createVector(random(1, 3), random(1,3), 0);
    particle.acceleration = p5.Vector.fromAngle(radians(random(0, 360)), random(1, 7));
    particle.angularAcceleration = createVector(radians(random(-90, 90)), radians(random(-90, 90)), radians(random(-2, 2)));  
    particle.drag = 0.01;
    //shuffle(color,true);
    //shuffle(words,true);
 
    particle.word = words[int(random(words.length))];

    if (beta > 550){
      particle.fill = 50
    particle.word = words4[int(random(words4.length))];}

    else if (beta < 550 && beta > 400){
      particle.fill = 100
    particle.word = words3[int(random(words3.length))];} 

    else if (beta > 200 && beta < 400){
      particle.fill = 150
      particle.word = words2[int(random(words2.length))];
    }
    else if (beta > 50 && beta < 200){
      particle.fill = 200
      particle.word = words1[int(random(words1.length))];
    }

    else{
      particle.fill = colors[int(random(0,6))];
      particle.word = words[int(random(words.length))];}

    //else (beta < 27){particle.word = words[int(random(43,57))];} 

    

    // for (i % 2 === 0) {
    //   // do something every other index

    // }

    // for (i % 6 === 0) {

  
    // }  


    // if (particle.word === "death") {
    //     sounds[i].play();

    //   }



   // particle.sound = sounds[i % sounds.length];

    particle.isDead = false;

    particle.maxAge = random(40, 100);
    particle.size = random(10,25); //CHANGE 10
    particle.gravity = createVector(1,0,0); //CHANGE 06
    //particle.fill = colors[int(random(0,6))];
    particle.angularDrag = 0.01;
    particle.position = createVector(300, height/2, 0); //CHANGE07
    particles.push(particle);  
    //particle.velocity = createVector(0,0,0);
  }
  
}
