// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 1: Random Walker


let ball;
const RAD = 24;
const NOTE_HEIGHT = 50;
let osc;

// A minor pentatonic ending with a C
const NOTES = [ 69, 72, 74, 76, 79, 81, 84];
const [a4, c5, d5, e5, g5, a5, c6] = [...Array(NOTES.length).keys()];
let keys = [];

const SONG = [
  {note: e5, value: 8, skip: 0.5},
  {note: e5, value: 4, skip: 10},
  {note: a5, value: 8, skip: 1},
  {note: g5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: c5, value: 3, skip: 5},
  {note: a4, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 3},
  {note: e5, value: 2, skip: 15},
  // next part
  {note: e5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 10},
  {note: c6, value: 8, skip: 0.9},
  {note: a5, value: 8, skip: 0.9},
  {note: g5, value: 8, skip: 0.9},
  {note: e5, value: 8, skip: 0.9},
  {note: d5, value: 8, skip: 0.9},
  {note: c5, value: 8, skip: 5},
  {note: a4, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: g5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 15},
  // next part
  {note: e5, value: 8, skip: 0.5},
  {note: c5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 5},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},

  {note: e5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 10},

  {note: e5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 5},

  {note: c5, value: 8, skip: 1},
  {note: d5, value: 8, skip: 1},
  {note: c5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 4},
  {note: d5, value: 8, skip: 4},
  {note: c5, value: 8, skip: 10},

  {note: e5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 5},
  {note: e5, value: 8, skip: 1},
  {note: e5, value: 8, skip: 3},
  {note: d5, value: 8, skip: 8},
  {note: c5, value: 8, skip: 3},
  {note: d5, value: 8, skip: 3},
  {note: c5, value: 8, skip: 1},
  {note: a4, value: 8, skip: 1},
];
let noteVectors = [];
let currentNote;

function setup() {
  createCanvas(640, 360);
  ellipseMode(RADIUS);
  calculateNotePositions();
  ball = new Ball();
  osc = new p5.SinOsc();
  // Start silent
  osc.start();
  osc.amp(0);
}




function calculateNotePositions() {
  const noteWidth = width / NOTES.length;
  for (let i = 0; i < NOTES.length; i++) {
    let x = i * noteWidth;
    keys.push({
      x1: x,
      y1: height - NOTE_HEIGHT,
      x2: noteWidth - 1,
      y2: height
    });
    const v = createVector(x + floor(noteWidth / 2), height - NOTE_HEIGHT);
    noteVectors.push(v);
    // draw circles to debug
    // fill(color('red'));
    // ellipse(v.x, v.y, 20, 20);
  }
}

function drawKeys(ball) {
  const noteWidth = width / NOTES.length;
  keys.forEach(key => {
    if (ball.pos.y > (height - (RAD + NOTE_HEIGHT)) && ball.pos.x > key.x1 && ball.pos.x < key.x1 + noteWidth) {
      fill(100,255,200);
    }
    else {
      fill(200);
    }
    // Draw the key
    rect(key.x1, key.y1, key.x2, key.y2);
  })
}

function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0, 0.2);
    }, duration);
  }
}

function draw() {
  background(30);
  // Update and display object
  notesLeft = ball.update();
  if (!notesLeft) noLoop();
  drawKeys(ball);
  ball.display();
}

function Ball() {

  // this.pos = createVector(width / 2, height / 2);
  currentNote = SONG.shift();
  const firstNoteVector = noteVectors[currentNote.note];
  this.pos = createVector(firstNoteVector.x, height / 2);
  this.vel = createVector(0, 10);

  this.bounce = function() {
    if (this.pos.x > width-RAD || this.pos.x < RAD) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height-(RAD + NOTE_HEIGHT)) {
      // uncomment this to play the key that the ball hits
      // let key = floor(map(this.pos.x, 0, width, 0, NOTES.length));
      // playNote(NOTES[key], 200);
      playNote(NOTES[currentNote.note], floor(50 * currentNote.skip));
      this.vel.y *= -1;
      setTimeout(() => this.vel.mult(1 / currentNote.skip), 50);
    }
    if (this.pos.y < RAD) {
      this.vel.y *= -1;
      if (!!SONG.length) {
        currentNote = SONG.shift();
        const key = noteVectors[currentNote.note];
        this.vel = p5.Vector.sub(key, this.pos);
        this.vel.mult(0.12);
      }
      else {
        return false;
      }
    }
    return true;
  };

  this.update = function() {
    this.pos.add(this.vel);
    return this.bounce();
  };

  this.display = function() {
    // Draw Walker as circle
    fill(color('magenta'));
    ellipse(this.pos.x, this.pos.y, RAD, RAD);
  }
}
