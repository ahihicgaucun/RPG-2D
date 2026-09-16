/* =====================================================
   RPG 2D
   PC: WASD + SPACE
   MOBILE: BUTTONS
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

ctx.imageSmoothingEnabled = false;


/* =====================================================
   SCREEN
===================================================== */

const homeScreen = document.getElementById("homeScreen");
const shopScreen = document.getElementById("shopScreen");
const gameScreen = document.getElementById("gameScreen");


const playBtn = document.getElementById("playBtn");
const shopBtn = document.getElementById("shopBtn");
const backHomeBtn = document.getElementById("backHomeBtn");
const gameMenuBtn = document.getElementById("gameMenuBtn");


/* =====================================================
   STORAGE
===================================================== */

let money = Number(localStorage.getItem("rpgGold")) || 0;

let damageLevel =
    Number(localStorage.getItem("damageLevel")) || 0;

let hpLevel =
    Number(localStorage.getItem("hpLevel")) || 0;


/* =====================================================
   IMAGES
===================================================== */

function loadImage(src) {
    const img = new Image();

    img.src = src;

    return img;
}


const images = {

    player: loadImage("assets/player.png"),

    playerAttack:
        loadImage("assets/player_attack.png"),

    enemy:
        loadImage("assets/enemy.png"),

    enemy1:
        loadImage("assets/enemy1.png"),

    enemy2:
        loadImage("assets/enemy2.png"),

    enemy3:
        loadImage("assets/enemy3.png"),

    enemy4:
        loadImage("assets/enemy4.png"),

    fireball:
        loadImage("assets/fireball.png"),

    bullet:
        loadImage("assets/bullet.png"),

    gas:
        loadImage("assets/gas.png"),

    tree:
        loadImage("assets/tree.png"),

    rock:
        loadImage("assets/rock.png"),

    grass:
        loadImage("assets/grass.png"),

    sword:
        loadImage("assets/sword.png")
};


/* =====================================================
   INPUT
===================================================== */

const keys = {};


window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        keys[" "] = true;

        e.preventDefault();
    }

});


window.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;

    if (e.code === "Space") {
        keys[" "] = false;
    }

});


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x: 0,
    y: 0,

    width: 60,
    height: 75,

    speed: 4,

    maxHp: 100 + hpLevel * 25,

    hp: 100 + hpLevel * 25,

    damage: 10 + damageLevel * 5,

    level: 1,

    exp: 0,

    expNeed: 100,

    money: money,

    attacking: false,

    attackTimer: 0,

    frame: 0,

    frameTimer: 0,

    direction: 1
};


/* =====================================================
   WORLD
===================================================== */

const WORLD_SIZE = 5000;

const TILE_SIZE = 80;

let camera = {

    x: 0,
    y: 0
};


/* =====================================================
   OBSTACLES
===================================================== */

let obstacles = [];


function createObstacles() {

    obstacles = [];

    for (let i = 0; i < 180; i++) {

        const type =
            Math.random() < 0.65
                ? "tree"
                : "rock";

        const x =
            Math.random() *
            (WORLD_SIZE - 100) + 50;

        const y =
            Math.random() *
            (WORLD_SIZE - 100) + 50;

        if (
            Math.abs(x - player.x) < 200 &&
            Math.abs(y - player.y) < 200
        ) {
            continue;
        }

        obstacles.push({

            x,
            y,

            type,

            width:
                type === "tree"
                    ? 65
                    : 60,

            height:
                type === "tree"
                    ? 85
                    : 50
        });
    }
}


/* =====================================================
   ENEMIES
===================================================== */

const enemyDatabase = [

    {
        image: images.enemy,
        height: 70,
        hp: 30,
        damage: 5,
        speed: 1.1,
        exp: 20,
        gold: 5
    },

    {
        image: images.enemy1,
        height: 70,
        hp: 45,
        damage: 7,
        speed: 1.3,
        exp: 30,
        gold: 8
    },

    {
        image: images.enemy2,
        height: 90,
        hp: 70,
        damage: 10,
        speed: 0.9,
        exp: 45,
        gold: 15
    },

    {
        image: images.enemy3,
        height: 75,
        hp: 55,
        damage: 8,
        speed: 1.4,
        exp: 40,
        gold: 12
    },

    {
        image: images.enemy4,
        height: 78,
        hp: 90,
        damage: 12,
        speed: 0.8,
        exp: 60,
        gold: 20
    }
];


let enemies = [];


/* =====================================================
   DROPS
===================================================== */

let drops = [];


/* =====================================================
   PROJECTILES
===================================================== */

let projectiles = [];


/* =====================================================
   SKILLS
===================================================== */

let skills = {

    fireball: true,

    gas: true,

    bullet: true
};


/* =====================================================
   LEVEL UP
===================================================== */

function addExp(amount) {

    player.exp += amount;


    while (player.exp >= player.expNeed) {

        player.exp -= player.expNeed;

        player.level++;

        player.expNeed =
            Math.floor(
                player.expNeed * 1.35
            );

        player.maxHp += 15;

        player.hp = player.maxHp;

        showLevelUp();
    }
}


function showLevelUp() {

    const text = document.createElement("div");

    text.innerHTML =
        `⬆️ LEVEL ${player.level}!`;

    text.style.position = "fixed";
    text.style.left = "50%";
    text.style.top = "45%";
    text.style.transform = "translate(-50%,-50%)";

    text.style.fontSize = "40px";
    text.style.fontWeight = "bold";

    text.style.color = "#ffd75c";

    text.style.zIndex = "20000";

    text.style.textShadow =
        "0 4px 10px black";

    document.body.appendChild(text);


    setTimeout(() => {

        text.remove();

    }, 1500);
}


/* =====================================================
   SPAWN ENEMY
===================================================== */

function spawnEnemy() {

    const type =
        enemyDatabase[
            Math.floor(
                Math.random() *
                enemyDatabase.length
            )
        ];


    let angle =
        Math.random() *
        Math.PI * 2;

    let distance =
        500 + Math.random() * 800;


    let x =
        player.x +
        Math.cos(angle) *
        distance;

    let y =
        player.y +
        Math.sin(angle) *
        distance;


    x = Math.max(
        100,
        Math.min(WORLD_SIZE - 100, x)
    );

    y = Math.max(
        100,
        Math.min(WORLD_SIZE - 100, y)
    );


    enemies.push({

        x,
        y,

        width: type.height,
        height: type.height,

        image: type.image,

        hp: type.hp +
            player.level * 5,

        maxHp:
            type.hp +
            player.level * 5,

        damage: type.damage,

        speed: type.speed,

        exp: type.exp,

        gold: type.gold,

        frame: 0,

        frameTimer: 0
    });
}


/* =====================================================
   COLLISION
===================================================== */

function rectCollision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y < b.y + b.height &&

        a.y + a.height >
        b.y
    );
}


function obstacleCollision(x, y, width, height) {

    const test = {

        x,
        y,
        width,
        height
    };


    for (const obstacle of obstacles) {

        if (
            rectCollision(
                test,
                obstacle
            )
        ) {
            return true;
        }
    }

    return false;
}


/* =====================================================
   PLAYER MOVEMENT
===================================================== */

function movePlayer() {

    let dx = 0;
    let dy = 0;


    if (keys["w"]) dy -= 1;

    if (keys["s"]) dy += 1;

    if (keys["a"]) {

        dx -= 1;

        player.direction = -1;
    }

    if (keys["d"]) {

        dx += 1;

        player.direction = 1;
    }


    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;


        const newX =
            player.x +
            dx * player.speed;

        const newY =
            player.y +
            dy * player.speed;


        if (
            !obstacleCollision(
                newX,
                player.y,
                player.width,
                player.height
            )
        ) {
            player.x = newX;
        }


        if (
            !obstacleCollision(
                player.x,
                newY,
                player.width,
                player.height
            )
        ) {
            player.y = newY;
        }


        player.frameTimer++;

        if (player.frameTimer > 8) {

            player.frame++;

            player.frame %= 4;

            player.frameTimer = 0;
        }

    } else {

        player.frame = 0;
    }


    player.x =
        Math.max(
            0,
            Math.min(
                WORLD_SIZE -
                player.width,
                player.x
            )
        );


    player.y =
        Math.max(
            0,
            Math.min(
                WORLD_SIZE -
                player.height,
                player.y
            )
        );
}


/* =====================================================
   ATTACK
===================================================== */

function attack() {

    if (player.attackTimer > 0) {
        return;
    }


    player.attacking = true;

    player.attackTimer = 25;


    const attackRange = 100;


    for (const enemy of enemies) {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance <= attackRange) {

            enemy.hp -= player.damage;
        }
    }
}


function updateAttack() {

    if (keys[" "]) {

        attack();
    }


    if (player.attackTimer > 0) {

        player.attackTimer--;
    }


    if (
        player.attackTimer === 0
    ) {

        player.attacking = false;
    }
}


/* =====================================================
   ENEMY UPDATE
===================================================== */

function updateEnemies() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        const enemy = enemies[i];


        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 0) {

            const vx =
                dx / distance *
                enemy.speed;

            const vy =
                dy / distance *
                enemy.speed;


            enemy.x += vx;

            enemy.y += vy;
        }


        enemy.frameTimer++;


        if (enemy.frameTimer > 10) {

            enemy.frame++;

            enemy.frame %= 4;

            enemy.frameTimer = 0;
        }


        if (
            rectCollision(
                player,
                enemy
            )
        ) {

            player.hp -=
                enemy.damage *
                0.02;
        }


        if (enemy.hp <= 0) {

            drops.push({

                x: enemy.x,

                y: enemy.y,

                exp: enemy.exp,

                gold: enemy.gold,

                type:
                    Math.random() < 0.5
                        ? "gold"
                        : "exp"
            });


            enemies.splice(i, 1);
        }
    }
}


/* =====================================================
   COLLECT DROPS
===================================================== */

function updateDrops() {

    for (
        let i = drops.length - 1;
        i >= 0;
        i--
    ) {

        const drop = drops[i];


        const dx =
            player.x -
            drop.x;

        const dy =
            player.y -
            drop.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 60) {

            addExp(drop.exp);

            money += drop.gold;

            player.money = money;

            saveData();

            drops.splice(i, 1);
        }
    }
}


/* =====================================================
   PROJECTILES
===================================================== */

function createProjectile(
    target,
    type
) {

    const dx =
        target.x -
        player.x;

    const dy =
        target.y -
        player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance === 0) return;


    projectiles.push({

        x: player.x +
            player.width / 2,

        y: player.y +
            player.height / 2,

        vx:
            dx / distance * 7,

        vy:
            dy / distance * 7,

        damage:
            type === "fireball"
                ? player.damage * 1.5
                : player.damage,

        type
    });
}


let skillTimer = 0;


/* =====================================================
   AUTO SKILLS
===================================================== */

function autoSkills() {

    skillTimer++;

    if (skillTimer < 45) {
        return;
    }

    skillTimer = 0;


    if (enemies.length === 0) {
        return;
    }


    let nearest = enemies[0];

    let nearestDistance = Infinity;


    for (const enemy of enemies) {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const d =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (d < nearestDistance) {

            nearest = enemy;

            nearestDistance = d;
        }
    }


    if (nearestDistance < 500) {

        const skill =
            Math.floor(
                Math.random() * 3
            );


        if (skill === 0) {

            createProjectile(
                nearest,
                "fireball"
            );

        } else if (skill === 1) {

            createProjectile(
                nearest,
                "bullet"
            );

        } else {

            createProjectile(
                nearest,
                "gas"
            );
        }
    }
}


/* =====================================================
   UPDATE PROJECTILES
===================================================== */

function updateProjectiles() {

    for (
        let i = projectiles.length - 1;
        i >= 0;
        i--
    ) {

        const p = projectiles[i];

        p.x += p.vx;
        p.y += p.vy;


        let hit = false;


        for (const enemy of enemies) {

            const dx =
                enemy.x -
                p.x;

            const dy =
                enemy.y -
                p.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance < 45) {

                enemy.hp -= p.damage;

                hit = true;

                break;
            }
        }


        if (
            hit ||
            p.x < 0 ||
            p.y < 0 ||
            p.x > WORLD_SIZE ||
            p.y > WORLD_SIZE
        ) {

            projectiles.splice(i, 1);
        }
    }
}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        canvas.width / 2;


    camera.y =
        player.y +
        player.height / 2 -
        canvas.height / 2;


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD_SIZE -
                canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_SIZE -
                canvas.height,
                camera.y
            )
        );
}


/* =====================================================
   DRAW SPRITE
===================================================== */

function drawSprite(
    image,
    x,
    y,
    width,
    height,
    frame = 0
) {

    if (!image.complete) {
        return;
    }


    const frameWidth =
        image.width / 4;


    ctx.drawImage(

        image,

        frame * frameWidth,
        0,

        frameWidth,
        image.height,

        x,
        y,

        width,
        height
    );
}


/* =====================================================
   DRAW WORLD
===================================================== */

function drawWorld() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* BACKGROUND */

    ctx.fillStyle = "#263b24";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRID */

    ctx.strokeStyle =
        "rgba(255,255,255,0.025)";

    ctx.lineWidth = 1;


    const grid = 80;


    for (
        let x =
            -camera.x % grid;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y =
            -camera.y % grid;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    /* OBSTACLES */

    for (const obstacle of obstacles) {

        const screenX =
            obstacle.x -
            camera.x;

        const screenY =
            obstacle.y -
            camera.y;


        const image =
            obstacle.type === "tree"
                ? images.tree
                : images.rock;


        if (
            screenX < -150 ||
            screenX >
                canvas.width + 150 ||
            screenY < -150 ||
            screenY >
                canvas.height + 150
        ) {
            continue;
        }


        const aspect =
            image.width /
            image.height;


        const height =
            obstacle.height;


        const width =
            height * aspect;


        ctx.drawImage(

            image,

            screenX,
            screenY,

            width,
            height
        );
    }


    /* DROPS */

    for (const drop of drops) {

        const x =
            drop.x -
            camera.x;

        const y =
            drop.y -
            camera.y;


        ctx.font = "24px Arial";

        ctx.fillText(
            drop.type === "gold"
                ? "🪙"
                : "⭐",
            x,
            y
        );
    }


    /* ENEMIES */

    for (const enemy of enemies) {

        const x =
            enemy.x -
            camera.x;

        const y =
            enemy.y -
            camera.y;


        if (
            x < -150 ||
            x > canvas.width + 150 ||
            y < -150 ||
            y > canvas.height + 150
        ) {
            continue;
        }


        const aspect =
            (
                enemy.image.width / 4
            ) /
            enemy.image.height;


        const height =
            enemy.height;

        const width =
            height * aspect;


        drawSprite(

            enemy.image,

            x,
            y,

            width,
            height,

            enemy.frame
        );


        /* HP BAR */

        const barWidth = 55;

        const hpPercent =
            Math.max(
                0,
                enemy.hp /
                enemy.maxHp
            );


        ctx.fillStyle = "#171717";

        ctx.fillRect(
            x,
            y - 10,
            barWidth,
            6
        );


        ctx.fillStyle = "#e74c3c";

        ctx.fillRect(
            x,
            y - 10,
            barWidth *
            hpPercent,
            6
        );
    }


    /* PROJECTILES */

    for (const p of projectiles) {

        const x =
            p.x -
            camera.x;

        const y =
            p.y -
            camera.y;


        let image;


        if (p.type === "fireball") {

            image =
                images.fireball;

        } else if (
            p.type === "bullet"
        ) {

            image =
                images.bullet;

        } else {

            image =
                images.gas;
        }


        if (!image.complete) {
            continue;
        }


        const aspect =
            image.width /
            image.height;


        const h = 35;

        const w =
            h * aspect;


        ctx.drawImage(
            image,
            x - w / 2,
            y - h / 2,
            w,
            h
        );
    }


    /* PLAYER */

    const px =
        player.x -
        camera.x;

    const py =
        player.y -
        camera.y;


    const image =
        player.attacking
            ? images.playerAttack
            : images.player;


    const height =
        player.attacking
            ? 90
            : 75;


    const aspect =
        (
            image.width / 4
        ) /
        image.height;


    const width =
        height * aspect;


    ctx.save();


    if (player.direction === -1) {

        ctx.translate(
            px + width,
            py
        );

        ctx.scale(-1, 1);

        drawSprite(
            image,
            0,
            0,
            width,
            height,
            player.frame
        );

    } else {

        drawSprite(
            image,
            px,
            py,
            width,
            height,
            player.frame
        );
    }


    ctx.restore();
}


/* =====================================================
   HUD
===================================================== */

function drawHUD() {

    /* PANEL */

    ctx.fillStyle =
        "rgba(5,7,12,0.75)";

    ctx.fillRect(
        15,
        15,
        310,
        110
    );


    /* HP */

    ctx.fillStyle = "#222";

    ctx.fillRect(
        30,
        32,
        270,
        18
    );


    ctx.fillStyle = "#e74c3c";

    ctx.fillRect(
        30,
        32,
        270 *
        Math.max(
            0,
            player.hp /
            player.maxHp
        ),
        18
    );


    ctx.fillStyle = "white";

    ctx.font = "15px Arial";

    ctx.fillText(
        `❤️ ${Math.ceil(player.hp)} / ${player.maxHp}`,
        38,
        46
    );


    /* EXP */

    ctx.fillStyle = "#222";

    ctx.fillRect(
        30,
        62,
        270,
        12
    );


    ctx.fillStyle = "#45a9ff";

    ctx.fillRect(
        30,
        62,
        270 *
        (
            player.exp /
            player.expNeed
        ),
        12
    );


    ctx.fillStyle = "white";

    ctx.fillText(
        `⭐ Level ${player.level}`,
        30,
        95
    );


    ctx.fillStyle = "#ffd75c";

    ctx.fillText(
        `🪙 ${money}`,
        160,
        95
    );
}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    gameRunning = false;


    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "#ff5555";

    ctx.font =
        "bold 60px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 30
    );


    ctx.fillStyle = "white";

    ctx.font = "22px Arial";

    ctx.fillText(
        "Nhấn Enter để chơi lại",
        canvas.width / 2,
        canvas.height / 2 + 30
    );


    ctx.textAlign = "left";
}


window.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "Enter" &&
            !gameRunning
        ) {

            startGame();
        }
    }
);


/* =====================================================
   SAVE
===================================================== */

function saveData() {

    localStorage.setItem(
        "rpgGold",
        money
    );

    localStorage.setItem(
        "damageLevel",
        damageLevel
    );

    localStorage.setItem(
        "hpLevel",
        hpLevel
    );
}


/* =====================================================
   SHOP
===================================================== */

function updateShop() {

    document.getElementById(
        "homeGold"
    ).textContent = money;


    document.getElementById(
        "shopGold"
    ).textContent = money;


    document.getElementById(
        "damageLevel"
    ).textContent = damageLevel;


    document.getElementById(
        "hpLevel"
    ).textContent = hpLevel;


    document.getElementById(
        "damageValue"
    ).textContent =
        10 + damageLevel * 5;


    document.getElementById(
        "hpValue"
    ).textContent =
        100 + hpLevel * 25;


    const damagePrice =
        100 +
        damageLevel * 100;


    const hpPrice =
        100 +
        hpLevel * 100;


    document.getElementById(
        "damagePrice"
    ).textContent =
        damagePrice;


    document.getElementById(
        "hpPrice"
    ).textContent =
        hpPrice;


    document.getElementById(
        "buyDamage"
    ).disabled =
        money < damagePrice;


    document.getElementById(
        "buyHP"
    ).disabled =
        money < hpPrice;
}


document.getElementById(
    "buyDamage"
).addEventListener(
    "click",
    () => {

        const price =
            100 +
            damageLevel * 100;


        if (money >= price) {

            money -= price;

            damageLevel++;

            player.money = money;

            player.damage =
                10 +
                damageLevel * 5;

            saveData();

            updateShop();
        }
    }
);


document.getElementById(
    "buyHP"
).addEventListener(
    "click",
    () => {

        const price =
            100 +
            hpLevel * 100;


        if (money >= price) {

            money -= price;

            hpLevel++;

            player.money = money;

            player.maxHp =
                100 +
                hpLevel * 25;

            player.hp =
                player.maxHp;

            saveData();

            updateShop();
        }
    }
);


/* =====================================================
   START GAME
===================================================== */

let gameRunning = false;


function startGame() {

    homeScreen.style.display =
        "none";

    shopScreen.style.display =
        "none";

    gameScreen.style.display =
        "block";


    player.x =
        WORLD_SIZE / 2;

    player.y =
        WORLD_SIZE / 2;


    player.maxHp =
        100 +
        hpLevel * 25;

    player.hp =
        player.maxHp;


    player.damage =
        10 +
        damageLevel * 5;


    player.level = 1;

    player.exp = 0;

    player.expNeed = 100;


    enemies = [];

    drops = [];

    projectiles = [];


    createObstacles();


    for (let i = 0; i < 15; i++) {

        spawnEnemy();
    }


    gameRunning = true;
}


/* =====================================================
   MENU
===================================================== */

playBtn.addEventListener(
    "click",
    startGame
);


shopBtn.addEventListener(
    "click",
    () => {

        homeScreen.style.display =
            "none";

        shopScreen.style.display =
            "flex";

        updateShop();
    }
);


backHomeBtn.addEventListener(
    "click",
    () => {

        shopScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

        updateShop();
    }
);


gameMenuBtn.addEventListener(
    "click",
    () => {

        gameRunning = false;

        gameScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

        updateShop();
    }
);


/* =====================================================
   MOBILE CONTROLS
===================================================== */

document.querySelectorAll(
    ".joy-btn"
).forEach(button => {

    const key =
        button.dataset.key;


    function press(e) {

        e.preventDefault();

        keys[key] = true;
    }


    function release(e) {

        e.preventDefault();

        keys[key] = false;
    }


    button.addEventListener(
        "touchstart",
        press,
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        release,
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchcancel",
        release,
        {
            passive: false
        }
    );


    /* PC test */

    button.addEventListener(
        "mousedown",
        press
    );


    button.addEventListener(
        "mouseup",
        release
    );


    button.addEventListener(
        "mouseleave",
        release
    );
});


/* =====================================================
   MOBILE ATTACK
===================================================== */

const attackBtn =
    document.getElementById(
        "attackBtn"
    );


function attackPress(e) {

    e.preventDefault();

    keys[" "] = true;

    attack();
}


function attackRelease(e) {

    e.preventDefault();

    keys[" "] = false;
}


attackBtn.addEventListener(
    "touchstart",
    attackPress,
    {
        passive: false
    }
);


attackBtn.addEventListener(
    "touchend",
    attackRelease,
    {
        passive: false
    }
);


attackBtn.addEventListener(
    "touchcancel",
    attackRelease,
    {
        passive: false
    }
);


/* PC mouse test */

attackBtn.addEventListener(
    "mousedown",
    attackPress
);


attackBtn.addEventListener(
    "mouseup",
    attackRelease
);


/* =====================================================
   GAME LOOP
===================================================== */

let enemySpawnTimer = 0;


function gameLoop() {

    if (gameRunning) {

        movePlayer();

        updateAttack();

        updateEnemies();

        updateDrops();

        updateProjectiles();

        autoSkills();

        updateCamera();


        enemySpawnTimer++;


        if (
            enemySpawnTimer > 90 &&
            enemies.length < 25
        ) {

            spawnEnemy();

            enemySpawnTimer = 0;
        }


        drawWorld();

        drawHUD();


        if (player.hp <= 0) {

            player.hp = 0;

            gameOver();
        }
    }


    requestAnimationFrame(
        gameLoop
    );
}


/* =====================================================
   INIT
===================================================== */

updateShop();

gameLoop();
