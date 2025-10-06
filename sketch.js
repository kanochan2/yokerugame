// スペースドッジャー（p5.js）
// 操作: 上/下矢印キーまたはW/Sで移動、クリック/タップでジャンプ風の上昇。
// スペースでリスタート。

let ship;
let obstacles = [];
let spawnTimer = 0;
let score = 0;
let gameOver = false;
let speed = 4;
let highScore = 0;

function setup() {
  createCanvas(800, 600);
  resetGame();
  textFont('sans-serif');
}

function resetGame(){
  ship = {
    x: width * 0.15,
    y: height/2,
    r: 25,
    vy: 0,
    gravity: 0.6,
    thrust: -10,
    maxSpeed: 8
  };
  obstacles = [];
  spawnTimer = 0;
  score = 0;
  speed = 4;
  gameOver = false;
  loop();
}

function draw() {
  background(10, 18, 30);

  // 背景の星
  drawStars();

  if (!gameOver) {
    // スコアと難易度増加
    score += 1/60;
    if (score > 0 && floor(score) % 10 === 0) {
      speed = 4 + floor(score / 10) * 0.6;
    }

    spawnTimer--;
    if (spawnTimer <= 0) spawnObstacle();

    // 障害物の更新と描画
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let ob = obstacles[i];
      ob.x -= speed;
      drawObstacle(ob);
      if (ob.x + ob.w < 0) {
        obstacles.splice(i, 1);
      } else {
        if (circleRectCollide(ship.x, ship.y, ship.r, ob.x, ob.y, ob.w, ob.h)) {
          gameOver = true;
          if (score > highScore) highScore = floor(score);
          noLoop();
        }
      }
    }

    // プレイヤー物理
    ship.vy += ship.gravity * 0.8;
    ship.vy = constrain(ship.vy, -ship.maxSpeed, ship.maxSpeed);
    ship.y += ship.vy;
    ship.y = constrain(ship.y, ship.r, height - ship.r);
    if (ship.y === ship.r || ship.y === height - ship.r) ship.vy = 0;

    drawShip();
  } else {
    fill(255, 100, 100);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("GAME OVER", width/2, height/2 - 40);
    textSize(18);
    fill(220);
    text("SPACEでリスタート", width/2, height/2);
  }

  // HUD
  drawHUD();
}

// 星の描画
function drawStars(){
  noStroke();
  for (let i = 0; i < 40; i++){
    let x = (i * 1237 % width);
    let y = (i * 911 % height);
    let s = (1 + (i % 3));
    fill(200, 200, 255, 40);
    ellipse((x + frameCount*0.2*(i%3+1)) % width, y, s, s);
  }
}

// プレイヤー描画
function drawShip(){
  push();
  translate(ship.x, ship.y);
  noStroke();
  fill(100, 200, 255);
  ellipse(0, 0, ship.r*2, ship.r*1.6);
  fill(20);
  ellipse(-ship.r*0.12, -ship.r*0.05, ship.r*0.8, ship.r*0.5);
  let flame = constrain(map(ship.vy, -ship.maxSpeed, ship.maxSpeed, 1.5, 0.3), 0.3, 1.8);
  fill(255, 120, 50, 200);
  triangle(-ship.r*1.05, ship.r*0.2, -ship.r*1.6, ship.r*0.05*flame, -ship.r*1.6, -ship.r*0.05*flame);
  pop();
}

// 障害物描画
function drawObstacle(ob){
  noStroke();
  fill(160, 80, 200);
  rect(ob.x, ob.y, ob.w, ob.h, 6);
  fill(220, 140, 230, 120);
  rect(ob.x + ob.w*0.15, ob.y + ob.h*0.2, ob.w*0.7, ob.h*0.12, 4);
}

// スコア表示
function drawHUD(){
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("SCORE: " + floor(score), 12, 12);
  text("BEST: " + highScore, 12, 32);
  textAlign(RIGHT, TOP);
  text("Speed: " + nf(speed,1,1), width-12, 12);
}

// 障害物生成
function spawnObstacle(){
  let h = random(50, 150);
  let y = random(0, height - h);
  let w = random(50, 100);
  let x = width + w + random(0, 200);
  obstacles.push({x:x, y:y, w:w, h:h});
  spawnTimer = int(random(50, 120) - speed*4);
  spawnTimer = max(spawnTimer, 40);
}

// 衝突判定
function circleRectCollide(cx, cy, r, rx, ry, rw, rh){
  let closestX = constrain(cx, rx, rx + rw);
  let closestY = constrain(cy, ry, ry + rh);
  let dx = cx - closestX;
  let dy = cy - closestY;
  return (dx*dx + dy*dy) <= r*r;
}

// キー操作
function keyPressed(){
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
    ship.vy = ship.thrust * 0.55;
  }
  if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
    ship.vy = ship.maxSpeed * 0.9;
  }
  if (key === ' '){
    if (gameOver) {
      resetGame();
    } else {
      ship.vy = ship.thrust * 0.4;
    }
  }
}

function mousePressed(){
  if (gameOver) {
    resetGame();
  } else {
    ship.vy = ship.thrust * 0.9;
  }
}
