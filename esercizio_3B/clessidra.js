let clessidre = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noStroke();

  const spacing = width / 4;
  const centerY = height / 2;

  clessidre = [
    new Clessidra(spacing * 1, centerY, 24, color(255, 204, 0), "ore"),
    new Clessidra(spacing * 2, centerY, 60, color(255, 140, 0), "minuti"),
    new Clessidra(spacing * 3, centerY, 60, color(255, 240, 180), "secondi"),
  ];
}

function draw() {
  background(20);

  const now = new Date();
  const time = {
    ore: now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600,
    minuti: now.getMinutes() + now.getSeconds() / 60,
    secondi: now.getSeconds() + now.getMilliseconds() / 1000,
  };

  let mouseOverAny = clessidre.some(c =>
    dist(mouseX, mouseY, c.x, c.y) < c.w / 2
  );

  for (let c of clessidre) {
    c.update(time[c.label]);
    c.display(mouseOverAny);
  }
}

class Clessidra {
  constructor(x, y, max, col, label) {
    this.x = x;
    this.y = y;
    this.w = 120;
    this.h = 240;
    this.max = max;
    this.col = col;
    this.label = label;

    this.hovered = false;
    this.value = 0;
    this.prevInt = 0;

    this.rotation = 0;
    this.rotating = false;
    this.rotationProgress = 0; // da 0 a 1
    this.flipPending = false;
    this.flipped = false;
  }

  update(value) {
    this.value = constrain(value, 0, this.max);
    this.hovered = dist(mouseX, mouseY, this.x, this.y) < this.w / 2;

    const currentInt = floor(this.value);

    if (currentInt < this.prevInt && !this.rotating) {
      this.rotating = true;
      this.rotationProgress = 0;
      this.flipped = !this.flipped; 
    }
    this.prevInt = currentInt;

    if (this.rotating) {
      this.rotationProgress += 0.1;
      if (this.rotationProgress >= 1) {
        this.rotationProgress = 0;
        this.rotating = false;
      }
    }

    this.rotation = this.rotating ? PI * this.rotationProgress : 0;
  }
  
  display(showLabel) {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    const ratio = this.value / this.max;
    const upperY = -this.h / 2;
    const lowerY = this.h / 2;

    fill(40);
    triangle(-this.w / 2, upperY, this.w / 2, upperY, 0, 0);
    triangle(-this.w / 2, lowerY, this.w / 2, lowerY, 0, 0);

    let yCutTop = lerp(upperY, 0, this.flipped ? ratio : 1 - ratio);
    let yCutBottom = lerp(lowerY, 0, this.flipped ? 1 - ratio : ratio);

    fill(this.col);
    beginShape();
    vertex(-this.w / 2, upperY);
    vertex(this.w / 2, upperY);
    vertex(0, yCutTop);
    endShape(CLOSE);

    beginShape();
    vertex(-this.w / 2, lowerY);
    vertex(this.w / 2, lowerY);
    vertex(0, yCutBottom);
    endShape(CLOSE);

    let frac = this.value % 1;
    let dropY = lerp(yCutTop + 6, yCutBottom - 6, frac);
    ellipse(0, dropY, 8, 8);

    if (showLabel) {
      fill(255, 100);
      textAlign(CENTER, CENTER);
      textSize(32);
      text(nf(floor(this.value), 2), 0, 0);
    }

    pop();
  }
}