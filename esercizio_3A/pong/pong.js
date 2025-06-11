let palla;
let racchettaSx, racchettaDx;
let testoPalla = "IN";
let scia = [];

function setup() {
  createCanvas(700, 400);
  textAlign(CENTER, CENTER);
  textSize(64);

  racchettaSx = new Racchetta(25, "P", true);             
  racchettaDx = new Racchetta(width - 25, "G", false);    
  palla = new Palla();
}

function draw() {
  background(0);
  disegnaCampo();

  fill(150);
  textSize(16);
  text("Premi 'R' per ricominciare", width / 2, height - 20);

  racchettaSx.aggiornaIA(palla.y);
  racchettaDx.aggiornaMouse();
  racchettaSx.mostra();
  racchettaDx.mostra();

  for (let i = 0; i < scia.length; i++) {
    let punto = scia[i];
    let trasparenza = map(i, 0, scia.length, 1, 100);
    fill(255, trasparenza);
    textSize(32);
    text(punto.testo, punto.x, punto.y);
  }

  palla.aggiorna();
  palla.controllaRacchetta(racchettaSx);
  palla.controllaRacchetta(racchettaDx);
  palla.mostra();
}

class Racchetta {
  constructor(x, lettera, èIA) {
    this.x = x;
    this.y = height / 2;
    this.h = 100;
    this.lettera = lettera;
    this.èIA = èIA;
    this.errore = 0;
  }

  aggiornaMouse() {
    if (!this.èIA) {
      this.y = constrain(mouseY, this.h / 2, height - this.h / 2);
    }
  }

  aggiornaIA(obiettivoY) {
    if (this.èIA) {
      if (frameCount % 60 === 0) {
        this.errore = random(-40, 40);
      }
      let mira = obiettivoY + this.errore;
      this.y += (mira - this.y) * 0.08;
      this.y = constrain(this.y, this.h / 2, height - this.h / 2);
    }
  }

  mostra() {
    fill(255);
    textSize(64);
    text(this.lettera, this.x, this.y);
  }
}

class Palla {
  constructor() {
    this.r = 24;
    this.reimposta();
  }

  reimposta() {
    this.x = width / 2;
    this.y = height / 2;
    let velocità = 8;
    let angolo = random(-PI / 4, PI / 4);
    this.vx = random([1, -1]) * velocità * cos(angolo);
    this.vy = velocità * sin(angolo);
    scia = [];
  }

  aggiorna() {
    this.x += this.vx;
    this.y += this.vy;

    let margine = 25;
    if (this.y - this.r < margine) {
      this.y = margine + this.r;
      this.vy *= -1;
    }
    if (this.y + this.r > height - margine) {
      this.y = height - margine - this.r;
      this.vy *= -1;
    }

    if (this.x < 0 || this.x > width) {
      this.reimposta();
    }

    scia.push({ x: this.x, y: this.y, testo: testoPalla });
    if (scia.length > 500) {
      scia.shift();
    }
  }

  mostra() {
    fill(255);
    textSize(48);
    text(testoPalla, this.x, this.y);
  }

  controllaRacchetta(racchetta) {
    let metàAltezza = racchetta.h / 2;
    if (
      this.x - this.r < racchetta.x + 20 &&
      this.x + this.r > racchetta.x - 20 &&
      this.y > racchetta.y - metàAltezza &&
      this.y < racchetta.y + metàAltezza
    ) {
      let offset = (this.y - racchetta.y) / metàAltezza;
      let angolo = offset * PI / 4;
      let velocità = 8;

      let vx = velocità * cos(angolo);
      let vy = velocità * sin(angolo);

      let minVX = 4.5;
      if (abs(vx) < minVX) {
        vx = minVX * Math.sign(vx || 1);
        vy = sqrt(velocità * velocità - vx * vx) * Math.sign(vy || 1);
      }

      this.vx = -Math.sign(this.vx) * abs(vx);
      this.vy = vy;

      testoPalla = testoPalla === "IN" ? "ON" : "IN";
      scia = [];
    }
  }
}

function disegnaCampo() {
  stroke(100);
  strokeWeight(2);
  line(0, 0, 0, height);
  line(width - 1, 0, width - 1, height);

  stroke(80);
  strokeWeight(1);
  for (let y = 0; y < height; y += 20) {
    line(width / 2, y, width / 2, y + 10);
  }

  noStroke();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    palla.reimposta();
    testoPalla = "IN";
  }
}