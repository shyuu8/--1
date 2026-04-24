/**
 * 繪本風蘑菇村落作業展 - 整合 iframe 跳窗版
 */

let mushrooms = [];
let butterflies = [];
let clouds = [];

// 作業資料設定：已填入你提供的網址
const weekData = [
  { id: "0303", color: "#FF7B7B", link: "https://shyuu8.github.io/1/" },
  { id: "0310", color: "#FFB067", link: "https://shyuu8.github.io/2-1/" },
  { id: "0317", color: "#67D5FF", link: "https://shyuu8.github.io/3/" },
  { id: "0324", color: "#67FF9A", link: "https://shyuu8.github.io/4/" },
  { id: "0407", color: "#FFD167", link: "https://shyuu8.github.io/5/" }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 建立 HTML 介面元素 (彈出視窗與關閉按鈕)
  createUIElements();
  
  initElements();
}

function initElements() {
  mushrooms = [];
  butterflies = [];
  clouds = [];

  // 初始化裝飾元素
  for (let i = 0; i < 5; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.1, 0.3), w: random(100, 150) });
  }
  for (let i = 0; i < 8; i++) {
    butterflies.push(new Butterfly());
  }

  // 初始化蘑菇位置
  let spacing = width / (weekData.length + 1);
  for (let i = 0; i < weekData.length; i++) {
    mushrooms.push({
      x: spacing * (i + 1),
      y: height - 100,
      size: 80,
      data: weekData[i],
      scale: 1.0,
      targetScale: 1.0
    });
  }
}

function draw() {
  drawSky();
  drawClouds();
  drawGrassBase();

  let hoveringAny = false;

  for (let m of mushrooms) {
    let d = dist(mouseX, mouseY, m.x, m.y - 30);
    if (d < 50) {
      m.targetScale = 1.2;
      hoveringAny = true;
      drawWindEffect(m.x);
    } else {
      m.targetScale = 1.0;
    }
    m.scale = lerp(m.scale, m.targetScale, 0.1);
    displayMushroom(m);
  }

  cursor(hoveringAny ? HAND : ARROW);

  for (let b of butterflies) {
    b.update(hoveringAny ? mouseX : null, hoveringAny ? mouseY : null);
    b.display();
  }
}

// 點擊蘑菇開啟 iframe
function mousePressed() {
  for (let m of mushrooms) {
    let d = dist(mouseX, mouseY, m.x, m.y - 30);
    if (d < 50) {
      openWorkWindow(m.data.link);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initElements();
}

// --- 功能性函式 ---

// 建立懸浮視窗的 HTML 與 CSS
function createUIElements() {
  // 建立外層容器
  let overlay = createElement('div');
  overlay.id('work-overlay');
  overlay.style('position', 'fixed');
  overlay.style('top', '0');
  overlay.style('left', '0');
  overlay.style('width', '100%');
  overlay.style('height', '100%');
  overlay.style('background', 'rgba(0,0,0,0.7)');
  overlay.style('display', 'none'); // 預設隱藏
  overlay.style('z-index', '1000');
  overlay.style('justify-content', 'center');
  overlay.style('align-items', 'center');

  // 建立內容視窗
  let content = createElement('div');
  content.style('position', 'relative');
  content.style('width', '85%');
  content.style('height', '80%');
  content.style('background', 'white');
  content.style('border-radius', '20px');
  content.style('box-shadow', '0 20px 50px rgba(0,0,0,0.5)');
  content.style('overflow', 'hidden');
  content.parent(overlay);

  // 建立 iframe
  let ifr = createElement('iframe');
  ifr.id('work-frame');
  ifr.style('width', '100%');
  ifr.style('height', '100%');
  ifr.style('border', 'none');
  ifr.parent(content);

  // 建立關閉按鈕 (右上角叉叉)
  let closeBtn = createElement('div', '✕');
  closeBtn.style('position', 'absolute');
  closeBtn.style('top', '15px');
  closeBtn.style('right', '20px');
  closeBtn.style('width', '40px');
  closeBtn.style('height', '40px');
  closeBtn.style('background', '#ff6b6b');
  closeBtn.style('color', 'white');
  closeBtn.style('border-radius', '50%');
  closeBtn.style('display', 'flex');
  closeBtn.style('justify-content', 'center');
  closeBtn.style('align-items', 'center');
  closeBtn.style('cursor', 'pointer');
  closeBtn.style('font-size', '20px');
  closeBtn.style('font-weight', 'bold');
  closeBtn.style('box-shadow', '0 4px 10px rgba(0,0,0,0.2)');
  closeBtn.parent(content);

  // 點擊關閉
  closeBtn.mousePressed(() => {
    overlay.style('display', 'none');
    select('#work-frame').attribute('src', ''); // 清空網址停止執行
  });
}

function openWorkWindow(url) {
  select('#work-frame').attribute('src', url);
  select('#work-overlay').style('display', 'flex');
}

// --- 繪圖組件 (天空、草地、蝴蝶等) ---

function drawSky() {
  for (let i = 0; i < height; i++) {
    let c = lerpColor(color("#BEE3ED"), color("#E8F9E8"), map(i, 0, height, 0, 1));
    stroke(c);
    line(0, i, width, i);
  }
}

function drawClouds() {
  noStroke(); fill(255, 200);
  for (let c of clouds) {
    c.x = (c.x + c.speed) % (width + 150);
    ellipse(c.x, c.y, c.w, c.w * 0.5);
    ellipse(c.x + 30, c.y + 15, c.w * 0.7, c.w * 0.4);
  }
}

function drawGrassBase() {
  noStroke();
  fill("#9CCC65");
  rect(0, height - 80, width, 80);
  stroke("#8BC34A");
  for (let x = 0; x < width; x += 15) {
    line(x, height - 60, x + sin(frameCount*0.02 + x)*5, height - 90);
  }
}

function drawWindEffect(tx) {
  stroke("#FFFFFF"); strokeWeight(2);
  for (let x = tx - 60; x < tx + 60; x += 12) {
    line(x, height - 80, x + sin(frameCount * 0.2 + x) * 15, height - 110);
  }
}

function displayMushroom(m) {
  push();
  translate(m.x, m.y);
  scale(m.scale);
  noStroke();
  fill(0, 30); ellipse(0, 5, m.size, 15); // 陰影
  fill("#FFF9E1"); rect(-15, -35, 30, 45, 10); // 蕈柄
  fill(m.data.color); arc(0, -35, m.size * 1.3, m.size, PI, TWO_PI, CHORD); // 蕈傘
  fill(255, 180); circle(-20, -50, 12); circle(15, -60, 10); // 斑點
  fill("#33691E"); textAlign(CENTER); textStyle(BOLD); text(m.data.id, 0, 20); // 標籤
  pop();
}

class Butterfly {
  constructor() {
    this.pos = createVector(random(width), random(height - 150));
    this.vel = p5.Vector.random2D();
    this.angle = random(TWO_PI);
    this.color = color(255, random(200, 255), 150, 200);
  }
  update(tx, ty) {
    if (tx) {
      let steer = p5.Vector.sub(createVector(tx, ty - 60), this.pos);
      steer.setMag(0.1); this.vel.add(steer);
    }
    this.vel.limit(2); this.pos.add(this.vel); this.angle += 0.15;
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height - 100) this.vel.y *= -1;
  }
  display() {
    push(); translate(this.pos.x, this.pos.y); noStroke(); fill(this.color);
    let flap = sin(this.angle) * 10;
    ellipse(-4, 0, 6 + flap, 14); ellipse(4, 0, 6 + flap, 14);
    pop();
  }
}