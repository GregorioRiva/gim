let gocce = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 200; i++) {
    gocce.push(new Goccia());
  }
}

function draw() {
  background(40, 80, 120); 
  for (let g of gocce) {
    g.aggiorna();
    g.mostra();
  }
}

class Goccia {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.z = random(1, 5); 
    this.lunghezza = map(this.z, 1, 5, 5, 20);
    this.velocitàY = map(this.z, 1, 5, 2.5, 12);
  }

  aggiorna() {
    this.y += this.velocitàY;
    if (this.y > height) {
      this.y = random(-200, -100);
      this.x = random(width);
    }
  }

  mostra() {
    stroke(255); 
    strokeWeight(map(this.z, 1, 5, 1, 2)); 
    line(this.x, this.y, this.x, this.y + this.lunghezza);
  }
}