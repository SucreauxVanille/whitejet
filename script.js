const game = document.getElementById("game");
let gameStarted = false;
let butterflyScore = 0;
const scoreText = document.getElementById("scoreText");
const SKY_RATIO = 0.24;
const buildings = document.getElementById("buildings");
let buildingX = 0;
let hatWithOrange = false;
let hatInvincible = false;
let gameOver = false;
let gameOverTimer = null;
const startButton =
  document.getElementById("startButton");

startButton.addEventListener("click", () => {

  gameStarted = true;
  startButton.style.display = "none";
});
const gameOverScreen =
  document.getElementById("gameOverScreen");
const taxi = document.getElementById("taxi");
const hat = document.getElementById("hat");
const roadLine = document.getElementById("roadLine");
let roadX = 0;

const orange = document.getElementById("orange");
let orangeX = window.innerWidth * 0.7;
let orangeY = 300;

let orangeStock = 0;
let firstOrangeCollected = false;
const stock1 = document.getElementById("stock1");
const stock2 = document.getElementById("stock2");
const stock3 = document.getElementById("stock3");
const stock4 = document.getElementById("stock4");
const stock5 = document.getElementById("stock5");
const stock6 = document.getElementById("stock6");

const butterfly = document.getElementById("butterfly");
let butterflyActive = false;

let butterflyX = 0;
let butterflyY = 0;

let butterflyVX = -5;
let butterflyVY = -5;

let butterflyFrame = 0;
const butterflySwarm = [];
const extraHats = [];
const extraOranges = [];
gameOverScreen.addEventListener(
  "click",
  resetGame
);


// ===== タクシー位置 =====
let taxiX = window.innerWidth / 2 - 48;
let taxiY = window.innerHeight * 0.5;

// ===== 帽子位置 =====
let hatX = window.innerWidth;
let hatY = 200;

// ===== 帽子速度 =====
let hatSpeed = 10;
let orangeSpeed = 10;


//ちょうちょ
function updateButterfly() {

  butterfly.style.display = "none";

  butterflySwarm.forEach((b, i) => {

    b.frame++;

    b.x += b.vx;
    b.y += b.vy + Math.sin(b.frame * 0.2) * 2;

    const clone = document.createElement("img");
    clone.src = "butterfly.gif";
    clone.className = "swarmButterfly";

    clone.style.left = b.x + "px";
    clone.style.top = b.y + "px";
    clone.style.width = "24px";
    clone.style.height = "24px";
    clone.style.position = "absolute";
    clone.style.zIndex = "12";

    game.appendChild(clone);

    setTimeout(() => clone.remove(), 16);

    if (b.x < -100 || b.y < -100) {
      butterflySwarm.splice(i, 1);
    }
  });
}
function spawnButterfly(x, y) {
  butterflySwarm.push({
    x,
    y,
    vx: Math.random() * 8 - 4,
    vy: -(Math.random() * 5 + 3),
    frame: 0
  });
}
// 中央分離帯
function updateRoadLine() {

  roadX -= hatSpeed;

  // ループ
  if (roadX <= -110) {
    roadX = 0;
  }

  roadLine.style.left = roadX + "px";
}
// =========================
// ビル生成
// =========================
function createBuildings() {

  buildings.innerHTML = "";

  let buildingHTML = "";

  let totalWidth = 0;

  while (totalWidth < window.innerWidth) {

    // 幅ランダム
    const width =
      40 + Math.random() * 80;

    // 高さランダム
    const height =
      20 + Math.random() * 100;

    buildingHTML += `
      <div class="building"
        style="
          width:${width}px;
          height:${height}px;
        ">
      </div>
    `;

    totalWidth += width + 6;
  }

  // 同じものを2回並べる
  buildings.innerHTML =
    buildingHTML + buildingHTML;
}

//ぼうし増殖
function createExtras() {

  for (let i = 0; i < 4; i++) {

    const h = document.createElement("img");
    h.src = "hat.gif";
    h.className = "extraHat";
    h.style.position = "absolute";
    h.style.width = "60px";
    h.style.height = "60px";
    h.style.zIndex = "6";

    game.appendChild(h);

extraHats.push({
  el: h,
  x: window.innerWidth + Math.random() * 800,
  y: 150 + Math.random() * 400,
  withOrange: false
});
  }

  for (let i = 0; i < 5; i++) {

    const o = document.createElement("img");
    o.src = "orange.gif";
    o.className = "extraOrange";
    o.style.position = "absolute";
    o.style.width = "36px";
    o.style.height = "36px";
    o.style.zIndex = "6";

    game.appendChild(o);

    extraOranges.push({
      el: o,
      x: window.innerWidth + Math.random() * 1000,
      y: 150 + Math.random() * 400
    });
  }
}

// =========================
// ビル移動
// =========================
function updateBuildings() {

  buildingX -= hatSpeed * 0.3;

  // 半分進んだらループ
  if (buildingX <= -window.innerWidth) {
    buildingX = 0;
  }

  buildings.style.left =
    buildingX + "px";
}
// =========================
// タクシー更新
// =========================
function updateTaxi() {
  taxi.style.left = taxiX + "px";
  taxi.style.top = taxiY + "px";
}

//点滅
function flashTaxi() {

  taxi.classList.add("flash");

  setTimeout(() => {
    taxi.classList.remove("flash");
  }, 50);
}

// =========================
// 帽子更新
// =========================
function updateHat() {

  hatX -= hatSpeed;

  // 画面外へ行ったら右へ戻す
if (hatX < -80) {

  // 通常帽子へ戻す
  hatWithOrange = false;

    hatX = window.innerWidth + Math.random() * 300;

    // 高さランダム
const skyHeight = game.clientHeight * SKY_RATIO;

hatY =
  skyHeight +
  Math.random() * (game.clientHeight - skyHeight - 120);
  }
if (hatWithOrange) {
  hat.src = "orangehat.gif";
} else {
  hat.src = "hat.gif";
}
  // orangehat中は当たり判定なし
if (hatWithOrange) {
  hatInvincible = true;
} else {
  hatInvincible = false;
}
  hat.style.left = hatX + "px";
  hat.style.top = hatY + "px";
}

function updateExtraHats() {

  extraHats.forEach(h => {

    h.x -= hatSpeed * (0.8 + Math.random() * 0.6);

    if (h.x < -80) {
      h.withOrange = false;
      h.x = window.innerWidth + Math.random() * 1000;

      const skyHeight = game.clientHeight * SKY_RATIO;

      h.y =
        skyHeight +
        Math.random() *
        (game.clientHeight - skyHeight - 120);
    }
if (h.withOrange) {
  h.el.src = "orangehat.gif";
} else {
  h.el.src = "hat.gif";
}
    h.el.style.left = h.x + "px";
    h.el.style.top = h.y + "px";
  });
}

//追加のみかん
function updateExtraOranges() {

  extraOranges.forEach(o => {

    o.x -= orangeSpeed * (0.7 + Math.random() * 0.5);

    if (o.x < -60) {
      o.x = window.innerWidth + Math.random() * 1200;

      const skyHeight = game.clientHeight * SKY_RATIO;

      o.y =
        skyHeight +
        Math.random() *
        (game.clientHeight - skyHeight - 120);
    }

    o.el.style.left = o.x + "px";
    o.el.style.top = o.y + "px";
  });
}


// =========================
// 当たり判定
// =========================
function handleHatHit(hitX, hitY, extraHat = null) {

  console.log("白いぼうしだ！");
  flashTaxi();

  for (let i = 0; i < 6; i++) {
    spawnButterfly(hitX, hitY);
  }

  if (orangeStock > 0) {

    orangeStock--;
const burst = 6 + Math.floor(Math.random() * 3);

butterflyScore += burst;
scoreText.textContent = butterflyScore;
    console.log("夏みかんを置いていった！");

if (extraHat) {
  extraHat.withOrange = true;
} else {
  hatWithOrange = true;
}

  } else {

    console.log("ちょうちょが逃げた！");

    clearTimeout(gameOverTimer);

    gameOverTimer = setTimeout(() => {
      gameOver = true;
      gameOverScreen.style.display = "flex";
    }, 120);

    if (extraHat) {
      extraHat.x = window.innerWidth + Math.random() * 800;
    } else {
      hatX = window.innerWidth + Math.random() * 300;

      hatY =
        game.clientHeight * 0.1 +
        Math.random() *
        (game.clientHeight * 0.9 - 120);
    }
  }
}
function checkCollision() {

  const taxiSize = 84;
  const hatSize = 64;

  // 通常帽子
  const mainHit =
    taxiX < hatX + hatSize &&
    taxiX + taxiSize > hatX &&
    taxiY < hatY + hatSize &&
    taxiY + taxiSize > hatY;

  if (!hatInvincible && mainHit) {
    handleHatHit(hatX, hatY);
    return;
  }

  // エクストラ帽子
  for (const h of extraHats) {

    const hit =
      taxiX < h.x + hatSize &&
      taxiX + taxiSize > h.x &&
      taxiY < h.y + hatSize &&
      taxiY + taxiSize > h.y;

    if (hit) {
      handleHatHit(h.x, h.y, h);
      return;
    }
  }
}


// みかん関数、つまりみかんすう
function updateOrange() {

  orangeX -= orangeSpeed;

  // 画面外
  if (orangeX < -60) {

    orangeX = window.innerWidth + Math.random() * 400;

  const skyHeight = game.clientHeight * SKY_RATIO;

    orangeY =
      skyHeight +
      Math.random() *
      (game.clientHeight - skyHeight - 120);
  }

  orange.style.left = orangeX + "px";
  orange.style.top = orangeY + "px";
}
//みかん衝突
function checkOrangeCollision() {

  const taxiSize = 96;
  const orangeSize = 36;

  // 通常みかん
  const hit =
    taxiX < orangeX + orangeSize &&
    taxiX + taxiSize > orangeX &&
    taxiY < orangeY + orangeSize &&
    taxiY + taxiSize > orangeY;

  if (hit) {

    flashTaxi();

    if (orangeStock < 6) {
      orangeStock++;
    }

    firstOrangeCollected = true;

    orangeX =
      window.innerWidth + Math.random() * 400;

    const skyHeight =
      game.clientHeight * SKY_RATIO;

    orangeY =
      skyHeight +
      Math.random() *
      (game.clientHeight - skyHeight - 120);
  }

  // 追加みかん
  extraOranges.forEach(o => {

    const extraHit =
      taxiX < o.x + orangeSize &&
      taxiX + taxiSize > o.x &&
      taxiY < o.y + orangeSize &&
      taxiY + taxiSize > o.y;

    if (extraHit) {

      flashTaxi();

      if (orangeStock < 6) {
        orangeStock++;
      }

      firstOrangeCollected = true;

      o.x =
        window.innerWidth + Math.random() * 1200;
    }
  });
}

//みかんストック表示
function updateOrangeStockDisplay() {

  const stocks = [
    stock1, stock2, stock3,
    stock4, stock5, stock6
  ];

  const positions = [
    { x: -4, y: -20 }, // 下段左
    { x: 22, y: -20 },
    { x: 48, y: -20 },

    { x: 9, y: -42 },  // 中段
    { x: 35, y: -42 },

    { x: 22, y: -64 } // 上段
  ];

  stocks.forEach((stock, i) => {

    if (i < orangeStock) {

      stock.style.display = "block";

      stock.style.left =
        (taxiX + positions[i].x) + "px";

      stock.style.top =
        (taxiY + positions[i].y) + "px";

    } else {
      stock.style.display = "none";
    }
  });
}

// =========================
// ゲームループ
// =========================
createBuildings();
createExtras();
function gameLoop() {

  updateKeyboardMove();

if (!gameOver && gameStarted) {

if (firstOrangeCollected) {
  updateHat();
  updateExtraHats();
}

    updateOrange();
    updateExtraOranges();
    updateRoadLine();
    updateBuildings();
    checkCollision();
    checkOrangeCollision();

    hatSpeed += 0.002;
    orangeSpeed = hatSpeed;
  }

  updateButterfly();
  updateOrangeStockDisplay();

  requestAnimationFrame(gameLoop);
}

//リセット
function resetGame() {

  gameOver = false;

  orangeStock = 0;
  firstOrangeCollected = false;

  // タクシー位置
  taxiX = window.innerWidth / 2 - 48;
  taxiY = window.innerHeight * 0.5;

  // 帽子位置
  hatX = window.innerWidth + 300;
  hatY = 200;

  // 夏みかん位置
  orangeX = window.innerWidth * 0.7;
  orangeY = 300;

  //エクストラ位置
extraHats.forEach(h => {
  h.x = window.innerWidth + Math.random() * 800;
});

extraOranges.forEach(o => {
  o.x = window.innerWidth + Math.random() * 1000;
});
  // 蝶消す
  butterflyActive = false;
  butterfly.style.display = "none";
hatSpeed = 10;
orangeSpeed = 10;
butterflySwarm.length = 0;
  
  //スコアリセット
  butterflyScore = 0;
  scoreText.textContent = 0;

  gameOverScreen.style.display = "none";

  updateTaxi();

  hat.style.left = hatX + "px";
  hat.style.top = hatY + "px";

  orange.style.left = orangeX + "px";
  orange.style.top = orangeY + "px";

  gameStarted = false;
startButton.style.display = "flex";
}
// =========================
// スマホ操作
// =========================
game.addEventListener("touchmove", e => {
  if (gameOver) return;

  e.preventDefault();

  const touch = e.touches[0];
  const rect = game.getBoundingClientRect();

  taxiX = touch.clientX - rect.left - 48;
  taxiY = touch.clientY - rect.top - 48;

  // 画面外防止
  taxiX = Math.max(
    0,
    Math.min(taxiX, rect.width - 96)
  );

const skyHeight = game.clientHeight * SKY_RATIO;

  taxiY = Math.max(
    skyHeight,
    Math.min(taxiY, rect.height - 96)
  );

  updateTaxi();

}, { passive: false });

// =========================
// キーボード操作
// =========================
const keys = {};

document.addEventListener("keydown", e => {
  if (gameOver) return;
  keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});
function updateKeyboardMove() {

  const speed = 6;

  if (keys["ArrowLeft"]) {
    taxiX -= speed;
  }

  if (keys["ArrowRight"]) {
    taxiX += speed;
  }

  if (keys["ArrowUp"]) {
    taxiY -= speed;
  }

  if (keys["ArrowDown"]) {
    taxiY += speed;
  }

  const rect = game.getBoundingClientRect();

  // 横制限
  taxiX = Math.max(
    0,
    Math.min(taxiX, rect.width - 96)
  );

  // 空侵入禁止
const skyHeight = game.clientHeight * SKY_RATIO;

  taxiY = Math.max(
    skyHeight,
    Math.min(taxiY, rect.height - 96)
  );

  updateTaxi();
}
// =========================
// 初期化
// =========================
updateTaxi();

hat.style.left = hatX + "px";
hat.style.top = hatY + "px";

gameLoop();
