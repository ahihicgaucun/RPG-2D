/* =====================================================
   RPG ADVENTURE
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById(
        "gameCanvas"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


/*
=====================================================
PIXEL ART

Không làm mờ sprite
=====================================================
*/

ctx.imageSmoothingEnabled =
    false;


const GAME_WIDTH =
    1000;


const GAME_HEIGHT =
    600;


canvas.width =
    GAME_WIDTH;


canvas.height =
    GAME_HEIGHT;


/* =====================================================
   SCREEN
===================================================== */

const homeScreen =
    document.getElementById(
        "homeScreen"
    );


const shopScreen =
    document.getElementById(
        "shopScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


/* =====================================================
   BUTTON
===================================================== */

document.getElementById(
    "playButton"
).onclick =
    function () {

        startGame();

    };


document.getElementById(
    "shopButton"
).onclick =
    function () {

        showShop();

    };


document.getElementById(
    "backButton"
).onclick =
    function () {

        showHome();

    };


document.getElementById(
    "gameMenuButton"
).onclick =
    function () {

        saveGold();

        showHome();

    };


/* =====================================================
   LOCAL STORAGE
===================================================== */

let savedGold =
    Number(
        localStorage.getItem(
            "rpgGold"
        )
    ) || 0;


let savedDamageLevel =
    Number(
        localStorage.getItem(
            "damageLevel"
        )
    ) || 0;


let savedHpLevel =
    Number(
        localStorage.getItem(
            "hpLevel"
        )
    ) || 0;


/* =====================================================
   GOLD UI
===================================================== */

function updateGoldUI() {

    document.getElementById(
        "homeGold"
    ).textContent =
        savedGold;


    document.getElementById(
        "shopGold"
    ).textContent =
        savedGold;


    document.getElementById(
        "damagePrice"
    ).textContent =

        100 +
        savedDamageLevel *
        75;


    document.getElementById(
        "hpPrice"
    ).textContent =

        100 +
        savedHpLevel *
        75;


    document.getElementById(
        "damageLevel"
    ).textContent =

        savedDamageLevel;


    document.getElementById(
        "hpLevel"
    ).textContent =

        savedHpLevel;

}


/* =====================================================
   SAVE GOLD
===================================================== */

function saveGold() {

    savedGold =
        player.money;


    localStorage.setItem(
        "rpgGold",
        String(savedGold)
    );


    updateGoldUI();

}


/* =====================================================
   GOLD POPUP
===================================================== */

let goldPopups = [];


function showGoldPopup(
    amount
) {

    goldPopups.push({

        amount:
            amount,

        life:
            60

    });

}


function updateGoldPopups() {

    for (
        let i =
            goldPopups.length - 1;

        i >= 0;

        i--
    ) {

        goldPopups[i].life--;


        if (
            goldPopups[i].life <=
            0
        ) {

            goldPopups.splice(
                i,
                1
            );

        }

    }

}


function drawGoldPopups() {

    ctx.save();


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 16px Arial";


    for (
        const popup
        of goldPopups
    ) {

        ctx.fillStyle =
            "#ffd700";


        ctx.fillText(

            `+${popup.amount} 💰`,

            canvas.width / 2,

            180 -
            (
                60 -
                popup.life
            )

        );

    }


    ctx.restore();

}


/* =====================================================
   SCREEN
===================================================== */

function showHome() {

    homeScreen.style.display =
        "flex";


    shopScreen.style.display =
        "none";


    gameScreen.style.display =
        "none";


    updateGoldUI();

}


function showShop() {

    homeScreen.style.display =
        "none";


    shopScreen.style.display =
        "flex";


    gameScreen.style.display =
        "none";


    updateGoldUI();

}


function startGame() {

    homeScreen.style.display =
        "none";


    shopScreen.style.display =
        "none";


    gameScreen.style.display =
        "block";


    resetGame();

}


/* =====================================================
   SHOP DAMAGE
===================================================== */

document.getElementById(
    "damageShop"
).onclick =
    function () {

        const price =

            100 +
            savedDamageLevel *
            75;


        if (
            savedGold >=
            price
        ) {

            savedGold -=
                price;


            savedDamageLevel++;


            localStorage.setItem(
                "rpgGold",
                savedGold
            );


            localStorage.setItem(
                "damageLevel",
                savedDamageLevel
            );


            player.money =
                savedGold;


            player.damage =

                25 +
                savedDamageLevel *
                5;


            updateGoldUI();

        } else {

            alert(
                "❌ Không đủ Gold!"
            );

        }

    };


/* =====================================================
   SHOP HP
===================================================== */

document.getElementById(
    "hpShop"
).onclick =
    function () {

        const price =

            100 +
            savedHpLevel *
            75;


        if (
            savedGold >=
            price
        ) {

            savedGold -=
                price;


            savedHpLevel++;


            localStorage.setItem(
                "rpgGold",
                savedGold
            );


            localStorage.setItem(
                "hpLevel",
                savedHpLevel
            );


            player.money =
                savedGold;


            /*
            Nâng Max HP
            */

            const oldMaxHp =
                player.maxHp;


            player.maxHp =

                100 +
                savedHpLevel *
                20;


            /*
            Giữ phần trăm máu
            */

            if (
                oldMaxHp > 0
            ) {

                const hpPercent =

                    player.hp /
                    oldMaxHp;


                player.hp =

                    player.maxHp *
                    hpPercent;

            }


            updateGoldUI();

        } else {

            alert(
                "❌ Không đủ Gold!"
            );

        }

    };


/* =====================================================
   MAP
===================================================== */

const CHUNK_SIZE =
    800;


const CHUNK_RADIUS =
    2;


const chunks =
    new Map();


/* =====================================================
   IMAGES
===================================================== */

const images = {

    player:
        new Image(),

    playerAttack:
        new Image(),

    tree:
        new Image(),

    rock:
        new Image(),

    grass:
        new Image(),

    fireball:
        new Image(),

    bullet:
        new Image(),

    gas:
        new Image(),

    sword:
        new Image(),

    npc:
        new Image()

};


images.player.src =
    "./assets/player.png";


images.playerAttack.src =
    "./assets/player_attack.png";


images.tree.src =
    "./assets/tree.png";


images.rock.src =
    "./assets/rock.png";


images.grass.src =
    "./assets/grass.png";


images.fireball.src =
    "./assets/fireball.png";


images.bullet.src =
    "./assets/bullet.png";


images.gas.src =
    "./assets/gas.png";


images.sword.src =
    "./assets/sword.png";


images.npc.src =
    "./assets/npc.png";


/* =====================================================
   ENEMY DATABASE
===================================================== */

const enemyDatabase = [

    {
        file:
            "./assets/enemy.png",

        height:
            70
    },


    {
        file:
            "./assets/enemy1.png",

        height:
            70
    },


    {
        file:
            "./assets/enemy2.png",

        height:
            90
    },


    {
        file:
            "./assets/enemy3.png",

        height:
            75
    },


    {
        file:
            "./assets/enemy4.png",

        height:
            78
    }

];


const enemyImages = [];


/* =====================================================
   LOAD ENEMY
===================================================== */

function loadEnemyImages() {

    for (
        let i = 0;

        i <
        enemyDatabase.length;

        i++
    ) {

        const image =
            new Image();


        image.src =
            enemyDatabase[i].file;


        image.onload =
            function () {

                enemyImages[i] =
                    image;

            };

    }

}


loadEnemyImages();


/* =====================================================
   IMAGE READY
===================================================== */

function imageReady(
    image
) {

    return (

        image &&

        image.complete &&

        image.naturalWidth > 0

    );

}


/* =====================================================
   KEYBOARD
===================================================== */

const keys = {};


document.addEventListener(
    "keydown",
    function (e) {

        keys[
            e.key.toLowerCase()
        ] = true;


        if (
            e.code ===
            "Space"
        ) {

            e.preventDefault();


            attack();

        }

    }
);


document.addEventListener(
    "keyup",
    function (e) {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x:
        CHUNK_SIZE / 2,

    y:
        CHUNK_SIZE / 2,

    width:
        40,

    height:
        40,

    speed:
        4,

    hp:
        100,

    maxHp:

        100 +
        savedHpLevel *
        20,

    level:
        1,

    exp:
        0,

    expNeed:
        100,

    money:
        savedGold,

    damage:

        25 +
        savedDamageLevel *
        5,

    attackCooldown:
        0,

    direction:
        "right",

    isAttacking:
        false,

    attackFrame:
        0,

    attackFrameTimer:
        0,

    spriteFrame:
        0,

    spriteTimer:
        0,

    moving:
        false

};


/* =====================================================
   SKILLS
===================================================== */

const skills = {

    fireball:
        false,

    gas:
        false,

    gun:
        false

};


let selectingSkill =
    false;


/* =====================================================
   GAME DATA
===================================================== */

let enemies = [];


let drops = [];


let projectiles = [];


const camera = {

    x:
        0,

    y:
        0

};


let gameOver =
    false;


/* =====================================================
   CHUNK RANDOM
===================================================== */

function chunkSeed(
    cx,
    cy
) {

    const n =

        Math.sin(
            cx *
            127.1 +

            cy *
            311.7
        )
        *
        43758.5453123;


    return n -
        Math.floor(n);

}


function seededRandom(
    seed
) {

    const x =
        Math.sin(seed) *
        10000;


    return x -
        Math.floor(x);

}


/* =====================================================
   CREATE CHUNK
===================================================== */

function createChunk(
    cx,
    cy
) {

    const key =
        `${cx},${cy}`;


    if (
        chunks.has(key)
    ) {

        return chunks.get(
            key
        );

    }


    const chunk = {

        x:
            cx *
            CHUNK_SIZE,

        y:
            cy *
            CHUNK_SIZE,

        obstacles: [],

        enemies: []

    };


    const seed =
        chunkSeed(
            cx,
            cy
        );


    /* =========================
       TREES
    ========================== */

    const treeCount =

        8 +
        Math.floor(
            seed * 8
        );


    for (
        let i = 0;

        i <
        treeCount;

        i++
    ) {

        const rx =

            seededRandom(
                seed +
                i * 10
            );


        const ry =

            seededRandom(
                seed +
                i * 20
            );


        chunk.obstacles.push({

            x:

                chunk.x +
                rx *
                (
                    CHUNK_SIZE -
                    80
                ) +
                40,

            y:

                chunk.y +
                ry *
                (
                    CHUNK_SIZE -
                    80
                ) +
                40,

            width:
                60,

            height:
                70,

            type:
                "tree"

        });

    }


    /* =========================
       ROCK
    ========================== */

    const rockCount =

        5 +
        Math.floor(
            seed * 6
        );


    for (
        let i = 0;

        i <
        rockCount;

        i++
    ) {

        const rx =

            seededRandom(

                seed +
                i * 30 +
                100

            );


        const ry =

            seededRandom(

                seed +
                i * 40 +
                200

            );


        chunk.obstacles.push({

            x:

                chunk.x +
                rx *
                (
                    CHUNK_SIZE -
                    80
                ) +
                40,

            y:

                chunk.y +
                ry *
                (
                    CHUNK_SIZE -
                    80
                ) +
                40,

            width:
                55,

            height:
                45,

            type:
                "rock"

        });

    }


    /* =========================
       ENEMY
    ========================== */

    const enemyCount =

        5 +
        Math.floor(
            seed * 5
        );


    for (
        let i = 0;

        i <
        enemyCount;

        i++
    ) {

        const rx =

            seededRandom(

                seed +
                i * 50 +
                500

            );


        const ry =

            seededRandom(

                seed +
                i * 60 +
                700

            );


        const enemyX =

            chunk.x +
            rx *
            (
                CHUNK_SIZE -
                100
            ) +
            50;


        const enemyY =

            chunk.y +
            ry *
            (
                CHUNK_SIZE -
                100
            ) +
            50;


        const distance =

            Math.hypot(

                enemyX -
                player.x,

                enemyY -
                player.y

            );


        if (
            distance <=
            180
        ) {

            continue;

        }


        const imageIndex =

            Math.floor(

                Math.random() *
                enemyDatabase.length

            );


        const enemy = {

            x:
                enemyX,

            y:
                enemyY,

            width:
                40,

            height:
                40,

            imageIndex:
                imageIndex,

            speed:

                1 +
                seededRandom(
                    seed + i
                ) *
                0.6,

            hp:
                60,

            maxHp:
                60,

            damage:
                8,

            attackCooldown:
                0,

            dead:
                false,

            spriteFrame:
                0,

            spriteTimer:
                0,

            direction:
                "right"

        };


        chunk.enemies.push(
            enemy
        );


        enemies.push(
            enemy
        );

    }


    chunks.set(
        key,
        chunk
    );


    return chunk;

}


/* =====================================================
   ENSURE CHUNKS
===================================================== */

function ensureChunksAroundPlayer() {

    const cx =

        Math.floor(

            player.x /
            CHUNK_SIZE

        );


    const cy =

        Math.floor(

            player.y /
            CHUNK_SIZE

        );


    for (
        let x =
            -CHUNK_RADIUS;

        x <=
            CHUNK_RADIUS;

        x++
    ) {

        for (
            let y =
                -CHUNK_RADIUS;

            y <=
                CHUNK_RADIUS;

            y++
        ) {

            createChunk(

                cx + x,

                cy + y

            );

        }

    }

}


/* =====================================================
   COLLISION
===================================================== */

function rectCollision(
    a,
    b
) {

    return (

        a.x -
        a.width / 2
        <
        b.x +
        b.width / 2

        &&

        a.x +
        a.width / 2
        >
        b.x -
        b.width / 2

        &&

        a.y -
        a.height / 2
        <
        b.y +
        b.height / 2

        &&

        a.y +
        a.height / 2
        >
        b.y -
        b.height / 2

    );

}


function checkObstacleCollision(
    x,
    y
) {

    const testPlayer = {

        x:
            x,

        y:
            y,

        width:
            player.width,

        height:
            player.height

    };


    for (
        const chunk
        of chunks.values()
    ) {

        for (
            const obstacle
            of chunk.obstacles
        ) {

            if (

                rectCollision(
                    testPlayer,
                    obstacle
                )

            ) {

                return true;

            }

        }

    }


    return false;

}


/* =====================================================
   PLAYER MOVEMENT
===================================================== */

function updatePlayerMovement() {

    if (
        gameOver ||
        selectingSkill
    ) {

        player.moving =
            false;

        return;

    }


    let dx =
        0;


    let dy =
        0;


    if (
        keys["w"]
    ) {

        dy--;

    }


    if (
        keys["s"]
    ) {

        dy++;

    }


    if (
        keys["a"]
    ) {

        dx--;

        player.direction =
            "left";

    }


    if (
        keys["d"]
    ) {

        dx++;

        player.direction =
            "right";

    }


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.hypot(
                dx,
                dy
            );


        dx /=
            length;


        dy /=
            length;


        player.moving =
            true;

    } else {

        player.moving =
            false;

    }


    const newX =

        player.x +
        dx *
        player.speed;


    if (
        !checkObstacleCollision(
            newX,
            player.y
        )
    ) {

        player.x =
            newX;

    }


    const newY =

        player.y +
        dy *
        player.speed;


    if (
        !checkObstacleCollision(
            player.x,
            newY
        )
    ) {

        player.y =
            newY;

    }


    if (
        player.moving
    ) {

        player.spriteTimer++;


        if (
            player.spriteTimer >=
            8
        ) {

            player.spriteTimer =
                0;


            player.spriteFrame++;


            if (
                player.spriteFrame >=
                4
            ) {

                player.spriteFrame =
                    0;

            }

        }

    } else {

        player.spriteTimer =
            0;


        player.spriteFrame =
            0;

    }

}


/* =====================================================
   ATTACK
===================================================== */

function attack() {

    if (

        gameOver ||

        selectingSkill ||

        player.attackCooldown >
        0

    ) {

        return;

    }


    player.attackCooldown =
        25;


    player.isAttacking =
        true;


    player.attackFrame =
        0;


    player.attackFrameTimer =
        0;


    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead
        ) {

            continue;

        }


        const distance =

            Math.hypot(

                enemy.x -
                player.x,

                enemy.y -
                player.y

            );


        if (
            distance <
            75
        ) {

            enemy.hp -=
                player.damage;


            if (
                enemy.hp <=
                0
            ) {

                killEnemy(
                    enemy
                );

            }

        }

    }

}


/* =====================================================
   ATTACK ANIMATION
===================================================== */

function updateAttackAnimation() {

    if (
        !player.isAttacking
    ) {

        return;

    }


    player.attackFrameTimer++;


    if (
        player.attackFrameTimer >=
        5
    ) {

        player.attackFrameTimer =
            0;


        player.attackFrame++;


        if (
            player.attackFrame >=
            4
        ) {

            player.attackFrame =
                0;


            player.isAttacking =
                false;

        }

    }

}


/* =====================================================
   KILL ENEMY
===================================================== */

function killEnemy(
    enemy
) {

    if (
        enemy.dead
    ) {

        return;

    }


    enemy.dead =
        true;


    drops.push({

        x:
            enemy.x,

        y:
            enemy.y,

        type:
            "exp",

        value:
            25

    });


    drops.push({

        x:
            enemy.x + 15,

        y:
            enemy.y,

        type:
            "gold",

        value:
            10

    });


    setTimeout(

        function () {

            if (
                gameOver
            ) {

                return;

            }


            enemy.hp =
                enemy.maxHp;


            enemy.dead =
                false;


            enemy.spriteFrame =
                0;


            enemy.spriteTimer =
                0;

        },

        4000

    );

}


/* =====================================================
   ENEMY UPDATE
===================================================== */

function updateEnemies() {

    if (
        gameOver ||
        selectingSkill
    ) {

        return;

    }


    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead
        ) {

            continue;

        }


        enemy.spriteTimer++;


        if (
            enemy.spriteTimer >=
            10
        ) {

            enemy.spriteTimer =
                0;


            enemy.spriteFrame++;


            if (
                enemy.spriteFrame >=
                4
            ) {

                enemy.spriteFrame =
                    0;

            }

        }


        const dx =

            player.x -
            enemy.x;


        const dy =

            player.y -
            enemy.y;


        const distance =

            Math.hypot(
                dx,
                dy
            );


        if (
            distance > 45
        ) {

            const moveX =

                dx /
                distance *
                enemy.speed;


            const moveY =

                dy /
                distance *
                enemy.speed;


            const newX =

                enemy.x +
                moveX;


            const newY =

                enemy.y +
                moveY;


            if (
                !checkObstacleCollision(
                    newX,
                    enemy.y
                )
            ) {

                enemy.x =
                    newX;

            }


            if (
                !checkObstacleCollision(
                    enemy.x,
                    newY
                )
            ) {

                enemy.y =
                    newY;

            }


            if (
                dx < 0
            ) {

                enemy.direction =
                    "left";

            } else if (
                dx > 0
            ) {

                enemy.direction =
                    "right";

            }

        }


        if (

            distance < 50 &&

            enemy.attackCooldown <=
            0

        ) {

            player.hp -=
                enemy.damage;


            enemy.attackCooldown =
                50;


            if (
                player.hp <=
                0
            ) {

                player.hp =
                    0;


                gameOver =
                    true;


                saveGold();

            }

        }


        if (
            enemy.attackCooldown >
            0
        ) {

            enemy.attackCooldown--;

        }

    }

}


/* =====================================================
   DROP UPDATE
===================================================== */

function updateDrops() {

    if (
        gameOver
    ) {

        return;

    }


    for (
        let i =
            drops.length - 1;

        i >= 0;

        i--
    ) {

        const drop =
            drops[i];


        const distance =

            Math.hypot(

                drop.x -
                player.x,

                drop.y -
                player.y

            );


        if (
            distance <
            35
        ) {

            if (
                drop.type ===
                "exp"
            ) {

                player.exp +=
                    drop.value;


                checkLevelUp();

            }


            if (
                drop.type ===
                "gold"
            ) {

                player.money +=
                    drop.value;


                savedGold =
                    player.money;


                localStorage.setItem(

                    "rpgGold",

                    String(
                        savedGold
                    )

                );


                showGoldPopup(
                    drop.value
                );


                updateGoldUI();

            }


            drops.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   LEVEL UP
===================================================== */

function checkLevelUp() {

    while (

        player.exp >=
        player.expNeed

    ) {

        player.exp -=
            player.expNeed;


        player.level++;


        player.expNeed =

            Math.floor(

                player.expNeed *
                1.35

            );


        player.maxHp +=
            20;


        player.hp =
            player.maxHp;


        player.damage +=
            5;


        if (

            player.level %
            3 ===
            0

        ) {

            selectingSkill =
                true;


            createSkillButtons();

        }

    }

}


/* =====================================================
   CHOOSE SKILL
===================================================== */

function chooseSkill(
    skill
) {

    skills[skill] =
        true;


    selectingSkill =
        false;

}


/* =====================================================
   SKILL BUTTON
===================================================== */

function createSkillButtons() {

    if (
        document.getElementById(
            "skillOverlay"
        )
    ) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "skillOverlay";


    overlay.style.position =
        "fixed";


    overlay.style.left =
        "50%";


    overlay.style.top =
        "50%";


    overlay.style.transform =
        "translate(-50%,-50%)";


    overlay.style.background =
        "#111827";


    overlay.style.border =
        "2px solid #e6a629";


    overlay.style.padding =
        "30px";


    overlay.style.color =
        "white";


    overlay.style.zIndex =
        "9999";


    overlay.style.textAlign =
        "center";


    overlay.innerHTML = `

        <h2>
            🎉 LEVEL UP!
        </h2>

        <p style="
            margin:15px 0;
            color:#aaa;
        ">
            Chọn kỹ năng mới
        </p>

        <button id="skillFire">
            🔥 Cầu Lửa
        </button>

        <button id="skillGas">
            ⛽ Bình Xăng
        </button>

        <button id="skillGun">
            🔫 Bắn
        </button>

    `;


    document.body.appendChild(
        overlay
    );


    document.getElementById(
        "skillFire"
    ).onclick =
        function () {

            chooseSkill(
                "fireball"
            );


            overlay.remove();

        };


    document.getElementById(
        "skillGas"
    ).onclick =
        function () {

            chooseSkill(
                "gas"
            );


            overlay.remove();

        };


    document.getElementById(
        "skillGun"
    ).onclick =
        function () {

            chooseSkill(
                "gun"
            );


            overlay.remove();

        };

}


/* =====================================================
   NEAREST ENEMY
===================================================== */

function getNearestEnemy(
    maxDistance = 350
) {

    let nearest =
        null;


    let nearestDistance =
        maxDistance;


    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead
        ) {

            continue;

        }


        const distance =

            Math.hypot(

                enemy.x -
                player.x,

                enemy.y -
                player.y

            );


        if (
            distance <
            nearestDistance
        ) {

            nearest =
                enemy;


            nearestDistance =
                distance;

        }

    }


    return nearest;

}


/* =====================================================
   SKILL COOLDOWN
===================================================== */

let fireCooldown =
    0;


let gasCooldown =
    0;


let gunCooldown =
    0;


/* =====================================================
   FIREBALL
===================================================== */

function autoFireball() {

    if (
        !skills.fireball
    ) {

        return;

    }


    if (
        fireCooldown >
        0
    ) {

        fireCooldown--;

        return;

    }


    const target =
        getNearestEnemy(
            400
        );


    if (
        !target
    ) {

        return;

    }


    const dx =

        target.x -
        player.x;


    const dy =

        target.y -
        player.y;


    const distance =

        Math.hypot(
            dx,
            dy
        );


    projectiles.push({

        type:
            "fireball",

        x:
            player.x,

        y:
            player.y,

        vx:

            dx /
            distance *
            7,

        vy:

            dy /
            distance *
            7,

        damage:
            35,

        life:
            100

    });


    fireCooldown =
        60;

}


/* =====================================================
   GAS
===================================================== */

function autoGas() {

    if (
        !skills.gas
    ) {

        return;

    }


    if (
        gasCooldown >
        0
    ) {

        gasCooldown--;

        return;

    }


    const target =
        getNearestEnemy(
            300
        );


    if (
        !target
    ) {

        return;

    }


    projectiles.push({

        type:
            "gas",

        x:
            target.x,

        y:
            target.y,

        vx:
            0,

        vy:
            0,

        damage:
            15,

        life:
            50,

        radius:
            60

    });


    gasCooldown =
        80;

}


/* =====================================================
   GUN
===================================================== */

function autoGun() {

    if (
        !skills.gun
    ) {

        return;

    }


    if (
        gunCooldown >
        0
    ) {

        gunCooldown--;

        return;

    }


    const target =
        getNearestEnemy(
            450
        );


    if (
        !target
    ) {

        return;

    }


    const dx =

        target.x -
        player.x;


    const dy =

        target.y -
        player.y;


    const distance =

        Math.hypot(
            dx,
            dy
        );


    projectiles.push({

        type:
            "bullet",

        x:
            player.x,

        y:
            player.y,

        vx:

            dx /
            distance *
            10,

        vy:

            dy /
            distance *
            10,

        damage:
            20,

        life:
            70

    });


    gunCooldown =
        25;

}


/* =====================================================
   SKILLS UPDATE
===================================================== */

function updateSkills() {

    if (
        gameOver ||
        selectingSkill
    ) {

        return;

    }


    autoFireball();

    autoGas();

    autoGun();

}


/* =====================================================
   PROJECTILES UPDATE
===================================================== */

function updateProjectiles() {

    for (
        let i =
            projectiles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            projectiles[i];


        /* GAS */

        if (
            p.type ===
            "gas"
        ) {

            p.life--;


            for (
                const enemy
                of enemies
            ) {

                if (
                    enemy.dead
                ) {

                    continue;

                }


                const distance =

                    Math.hypot(

                        enemy.x -
                        p.x,

                        enemy.y -
                        p.y

                    );


                if (
                    distance <
                    p.radius
                ) {

                    enemy.hp -=
                        p.damage /
                        10;


                    if (
                        enemy.hp <=
                        0
                    ) {

                        killEnemy(
                            enemy
                        );

                    }

                }

            }


            if (
                p.life <=
                0
            ) {

                projectiles.splice(
                    i,
                    1
                );

            }


            continue;

        }


        /* NORMAL PROJECTILE */

        p.x +=
            p.vx;


        p.y +=
            p.vy;


        p.life--;


        let hit =
            false;


        for (
            const enemy
            of enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;

            }


            const distance =

                Math.hypot(

                    enemy.x -
                    p.x,

                    enemy.y -
                    p.y

                );


            if (
                distance <
                35
            ) {

                enemy.hp -=
                    p.damage;


                if (
                    enemy.hp <=
                    0
                ) {

                    killEnemy(
                        enemy
                    );

                }


                hit =
                    true;


                break;

            }

        }


        if (
            hit ||
            p.life <=
            0
        ) {

            projectiles.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    camera.x =

        player.x -
        canvas.width / 2;


    camera.y =

        player.y -
        canvas.height / 2;

}


/* =====================================================
   DRAW MAP
===================================================== */

function drawMap() {

    /*
    =========================
    GRASS
    =========================
    */

    if (
        imageReady(
            images.grass
        )
    ) {

        const size =
            64;


        const startX =

            Math.floor(
                camera.x /
                size
            ) *
            size;


        const startY =

            Math.floor(
                camera.y /
                size
            ) *
            size;


        for (
            let x =
                startX;

            x <
                camera.x +
                canvas.width +
                size;

            x += size
        ) {

            for (
                let y =
                    startY;

                y <
                    camera.y +
                    canvas.height +
                    size;

                y += size
            ) {

                ctx.drawImage(

                    images.grass,

                    x -
                    camera.x,

                    y -
                    camera.y,

                    size,

                    size

                );

            }

        }

    } else {

        ctx.fillStyle =
            "#4caf50";


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );

    }


    /*
    =========================
    OBSTACLES
    =========================
    */

    for (
        const chunk
        of chunks.values()
    ) {

        for (
            const obstacle
            of chunk.obstacles
        ) {

            const sx =

                obstacle.x -
                camera.x;


            const sy =

                obstacle.y -
                camera.y;


            if (

                sx <
                -100 ||

                sx >
                canvas.width +
                100 ||

                sy <
                -100 ||

                sy >
                canvas.height +
                100

            ) {

                continue;

            }


            /*
            TREE
            */

            if (

                obstacle.type ===
                "tree"

                &&

                imageReady(
                    images.tree
                )

            ) {

                const targetHeight =
                    85;


                const scale =

                    targetHeight /
                    images.tree.naturalHeight;


                const targetWidth =

                    images.tree.naturalWidth *
                    scale;


                ctx.drawImage(

                    images.tree,

                    sx -
                    targetWidth / 2,

                    sy -
                    targetHeight / 2,

                    targetWidth,

                    targetHeight

                );

            }


            /*
            ROCK
            */

            if (

                obstacle.type ===
                "rock"

                &&

                imageReady(
                    images.rock
                )

            ) {

                const targetHeight =
                    50;


                const scale =

                    targetHeight /
                    images.rock.naturalHeight;


                const targetWidth =

                    images.rock.naturalWidth *
                    scale;


                ctx.drawImage(

                    images.rock,

                    sx -
                    targetWidth / 2,

                    sy -
                    targetHeight / 2,

                    targetWidth,

                    targetHeight

                );

            }

        }

    }

}


/* =====================================================
   DRAW ENEMY
===================================================== */

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead
        ) {

            continue;

        }


        const sx =

            enemy.x -
            camera.x;


        const sy =

            enemy.y -
            camera.y;


        const enemyImage =

            enemyImages[
                enemy.imageIndex
            ];


        if (
            imageReady(
                enemyImage
            )
        ) {

            /*
            Mỗi ảnh có 4 frame ngang
            */

            const frameCount =
                4;


            const frameWidth =

                enemyImage.naturalWidth /
                frameCount;


            const frameHeight =

                enemyImage.naturalHeight;


            /*
            Kích thước theo chiều cao
            */

            const targetHeight =

                enemyDatabase[
                    enemy.imageIndex
                ].height;


            /*
            Tự tính chiều rộng
            */

            const scale =

                targetHeight /
                frameHeight;


            const targetWidth =

                frameWidth *
                scale;


            ctx.save();


            if (
                enemy.direction ===
                "left"
            ) {

                ctx.translate(
                    sx,
                    sy
                );


                ctx.scale(
                    -1,
                    1
                );


                ctx.drawImage(

                    enemyImage,

                    enemy.spriteFrame *
                    frameWidth,

                    0,

                    frameWidth,

                    frameHeight,

                    -targetWidth / 2,

                    -targetHeight / 2,

                    targetWidth,

                    targetHeight

                );

            } else {

                ctx.drawImage(

                    enemyImage,

                    enemy.spriteFrame *
                    frameWidth,

                    0,

                    frameWidth,

                    frameHeight,

                    sx -
                    targetWidth / 2,

                    sy -
                    targetHeight / 2,

                    targetWidth,

                    targetHeight

                );

            }


            ctx.restore();

        } else {

            /*
            Fallback
            */

            ctx.fillStyle =
                "#f44336";


            ctx.fillRect(

                sx - 20,

                sy - 20,

                40,

                40

            );

        }


        /*
        =========================
        HP BAR
        =========================
        */

        const hpWidth =
            45;


        const hpHeight =
            6;


        ctx.fillStyle =
            "rgba(0,0,0,0.8)";


        ctx.fillRect(

            sx -
            hpWidth / 2,

            sy - 48,

            hpWidth,

            hpHeight

        );


        ctx.fillStyle =
            "#35e35b";


        ctx.fillRect(

            sx -
            hpWidth / 2,

            sy - 48,

            hpWidth *
            Math.max(

                0,

                enemy.hp /
                enemy.maxHp

            ),

            hpHeight

        );

    }

}


/* =====================================================
   DRAW PLAYER
===================================================== */

function drawPlayer() {

    const sx =

        player.x -
        camera.x;


    const sy =

        player.y -
        camera.y;


    /*
    =========================
    ATTACK SPRITE
    =========================
    */

    if (

        player.isAttacking

        &&

        imageReady(
            images.playerAttack
        )

    ) {

        const frameCount =
            4;


        const frameWidth =

            images.playerAttack
                .naturalWidth /
            frameCount;


        const frameHeight =

            images.playerAttack
                .naturalHeight;


        /*
        Chiều cao mong muốn
        */

        const targetHeight =
            90;


        /*
        Giữ đúng tỉ lệ
        */

        const scale =

            targetHeight /
            frameHeight;


        const targetWidth =

            frameWidth *
            scale;


        ctx.save();


        if (
            player.direction ===
            "left"
        ) {

            ctx.translate(
                sx,
                sy
            );


            ctx.scale(
                -1,
                1
            );


            ctx.drawImage(

                images.playerAttack,

                player.attackFrame *
                frameWidth,

                0,

                frameWidth,

                frameHeight,

                -targetWidth / 2,

                -targetHeight / 2,

                targetWidth,

                targetHeight

            );

        } else {

            ctx.drawImage(

                images.playerAttack,

                player.attackFrame *
                frameWidth,

                0,

                frameWidth,

                frameHeight,

                sx -
                targetWidth / 2,

                sy -
                targetHeight / 2,

                targetWidth,

                targetHeight

            );

        }


        ctx.restore();


        return;

    }


    /*
    =========================
    NORMAL PLAYER
    =========================
    */

    if (
        imageReady(
            images.player
        )
    ) {

        const frameCount =
            4;


        const frameWidth =

            images.player.naturalWidth /
            frameCount;


        const frameHeight =

            images.player.naturalHeight;


        /*
        Chiều cao player
        */

        const targetHeight =
            75;


        /*
        Tự tính width
        */

        const scale =

            targetHeight /
            frameHeight;


        const targetWidth =

            frameWidth *
            scale;


        ctx.save();


        if (
            player.direction ===
            "left"
        ) {

            ctx.translate(
                sx,
                sy
            );


            ctx.scale(
                -1,
                1
            );


            ctx.drawImage(

                images.player,

                player.spriteFrame *
                frameWidth,

                0,

                frameWidth,

                frameHeight,

                -targetWidth / 2,

                -targetHeight / 2,

                targetWidth,

                targetHeight

            );

        } else {

            ctx.drawImage(

                images.player,

                player.spriteFrame *
                frameWidth,

                0,

                frameWidth,

                frameHeight,

                sx -
                targetWidth / 2,

                sy -
                targetHeight / 2,

                targetWidth,

                targetHeight

            );

        }


        ctx.restore();

    }

}


/* =====================================================
   DRAW PROJECTILES
===================================================== */

function drawProjectiles() {

    for (
        const p
        of projectiles
    ) {

        const sx =

            p.x -
            camera.x;


        const sy =

            p.y -
            camera.y;


        /*
        FIREBALL
        */

        if (

            p.type ===
            "fireball"

            &&

            imageReady(
                images.fireball
            )

        ) {

            const targetHeight =
                36;


            const scale =

                targetHeight /
                images.fireball.naturalHeight;


            const targetWidth =

                images.fireball.naturalWidth *
                scale;


            ctx.drawImage(

                images.fireball,

                sx -
                targetWidth / 2,

                sy -
                targetHeight / 2,

                targetWidth,

                targetHeight

            );

        }


        /*
        BULLET
        */

        if (

            p.type ===
            "bullet"

            &&

            imageReady(
                images.bullet
            )

        ) {

            const targetHeight =
                20;


            const scale =

                targetHeight /
                images.bullet.naturalHeight;


            const targetWidth =

                images.bullet.naturalWidth *
                scale;


            ctx.drawImage(

                images.bullet,

                sx -
                targetWidth / 2,

                sy -
                targetHeight / 2,

                targetWidth,

                targetHeight

            );

        }


        /*
        GAS
        */

        if (

            p.type ===
            "gas"

            &&

            imageReady(
                images.gas
            )

        ) {

            ctx.globalAlpha =
                0.6;


            ctx.drawImage(

                images.gas,

                sx -
                p.radius,

                sy -
                p.radius,

                p.radius * 2,

                p.radius * 2

            );


            ctx.globalAlpha =
                1;

        }

    }

}


/* =====================================================
   DRAW DROP
===================================================== */

function drawDrops() {

    for (
        const drop
        of drops
    ) {

        const sx =

            drop.x -
            camera.x;


        const sy =

            drop.y -
            camera.y;


        if (
            drop.type ===
            "exp"
        ) {

            ctx.fillStyle =
                "#00ffff";


            ctx.beginPath();


            ctx.arc(

                sx,

                sy,

                8,

                0,

                Math.PI * 2

            );


            ctx.fill();

        }


        if (
            drop.type ===
            "gold"
        ) {

            ctx.fillStyle =
                "#ffd700";


            ctx.beginPath();


            ctx.arc(

                sx,

                sy,

                8,

                0,

                Math.PI * 2

            );


            ctx.fill();

        }

    }

}


/* =====================================================
   HUD
===================================================== */

function drawHUD() {

    /*
    HP BACKGROUND
    */

    ctx.fillStyle =
        "black";


    ctx.fillRect(

        15,

        15,

        220,

        22

    );


    /*
    HP
    */

    ctx.fillStyle =
        "red";


    ctx.fillRect(

        15,

        15,

        220 *
        Math.max(

            0,

            player.hp /
            player.maxHp

        ),

        22

    );


    ctx.strokeStyle =
        "white";


    ctx.strokeRect(

        15,

        15,

        220,

        22

    );


    ctx.fillStyle =
        "white";


    ctx.font =
        "14px Arial";


    ctx.fillText(

        `HP: ${Math.floor(
            player.hp
        )} / ${player.maxHp}`,

        25,

        31

    );


    /*
    LEVEL
    */

    ctx.font =
        "18px Arial";


    ctx.fillText(

        `Level: ${player.level}`,

        15,

        62

    );


    /*
    EXP
    */

    ctx.fillText(

        `EXP: ${Math.floor(
            player.exp
        )} / ${player.expNeed}`,

        15,

        86

    );


    /*
    GOLD
    */

    ctx.fillText(

        `💰 ${player.money}`,

        15,

        110

    );


    /*
    DAMAGE
    */

    ctx.fillText(

        `Damage: ${player.damage}`,

        15,

        134

    );


    /*
    SKILLS
    */

    let skillText =
        "Skill: ";


    if (
        skills.fireball
    ) {

        skillText +=
            "🔥 ";

    }


    if (
        skills.gas
    ) {

        skillText +=
            "⛽ ";

    }


    if (
        skills.gun
    ) {

        skillText +=
            "🔫 ";

    }


    ctx.fillText(

        skillText,

        15,

        158

    );

}


/* =====================================================
   GAME OVER
===================================================== */

function drawGameOver() {

    if (
        !gameOver
    ) {

        return;

    }


    ctx.fillStyle =
        "rgba(0,0,0,0.75)";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.fillStyle =
        "white";


    ctx.textAlign =
        "center";


    ctx.font =
        "45px Arial";


    ctx.fillText(

        "GAME OVER",

        canvas.width / 2,

        canvas.height / 2 - 30

    );


    ctx.font =
        "20px Arial";


    ctx.fillText(

        `Level ${player.level}`,

        canvas.width / 2,

        canvas.height / 2 + 15

    );


    ctx.fillText(

        "F5 để chơi lại",

        canvas.width / 2,

        canvas.height / 2 + 55

    );


    ctx.textAlign =
        "left";

}


/* =====================================================
   UPDATE
===================================================== */

function update() {

    ensureChunksAroundPlayer();


    updatePlayerMovement();


    updateAttackAnimation();


    if (
        player.attackCooldown >
        0
    ) {

        player.attackCooldown--;

    }


    updateEnemies();


    updateDrops();


    updateSkills();


    updateProjectiles();


    updateGoldPopups();


    updateCamera();

}


/* =====================================================
   DRAW
===================================================== */

function draw() {

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    drawMap();


    drawDrops();


    drawEnemies();


    drawProjectiles();


    drawPlayer();


    drawHUD();


    drawGoldPopups();


    drawGameOver();

}


/* =====================================================
   RESET GAME
===================================================== */

function resetGame() {

    player.x =
        CHUNK_SIZE / 2;


    player.y =
        CHUNK_SIZE / 2;


    player.maxHp =

        100 +
        savedHpLevel *
        20;


    player.hp =
        player.maxHp;


    player.level =
        1;


    player.exp =
        0;


    player.expNeed =
        100;


    player.money =
        savedGold;


    player.damage =

        25 +
        savedDamageLevel *
        5;


    player.attackCooldown =
        0;


    player.isAttacking =
        false;


    player.attackFrame =
        0;


    player.attackFrameTimer =
        0;


    player.spriteFrame =
        0;


    player.spriteTimer =
        0;


    player.moving =
        false;


    gameOver =
        false;


    selectingSkill =
        false;


    enemies = [];


    drops = [];


    projectiles = [];


    chunks.clear();


    skills.fireball =
        false;


    skills.gas =
        false;


    skills.gun =
        false;


    fireCooldown =
        0;


    gasCooldown =
        0;


    gunCooldown =
        0;


    goldPopups = [];


    ensureChunksAroundPlayer();


    updateCamera();

}


/* =====================================================
   START
===================================================== */

showHome();


updateGoldUI();


gameLoop();


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    update();


    draw();


    requestAnimationFrame(
        gameLoop
    );

}