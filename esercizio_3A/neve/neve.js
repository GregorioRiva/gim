let fiocchi = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 150; i++) {
    fiocchi.push(new Fiocco());
  }
}

function draw() {
  background(20); 
  for (let f of fiocchi) {
    f.aggiorna();
    f.mostra();
  }
}

class Fiocco {
  constructor() {
    this.reimposta();
  }

  reimposta() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.raggio = random(2, 5); 
    this.velocità = random(0.5, 2); 
    this.angolo = random(TWO_PI);
    this.ampiezza = random(0.5, 2); 
  }

  aggiorna() {
    this.y += this.velocità;
    this.x += sin(this.angolo) * this.ampiezza;
    this.angolo += 0.01;
    if (this.y > height) {
      this.reimposta();
      this.y = random(-100, -10);
    }
  }

  mostra() {
    noStroke();
    fill(255); 
    ellipse(this.x, this.y, this.raggio);
  }
}