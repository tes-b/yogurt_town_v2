var mouseX = 0;
var mouseY = 0;

var clientX = 0;
var clientY = 0;
var rectLeft = 0;
var rectTop = 0;

let lastTime = 0;
const targetFPS = 60;
const frameDuration = 1000 / targetFPS;

var tileSize = 16;
var objectScale = 6 * canvas.height * 0.001;

var onOverlay = false;


var cam = new Camera(canvas);
var bg = new Background();
var map = new Map();

var button_prev = new Button(imgBtnPrev,prevSection, 2, 2, 0, 9);
var button_next = new Button(imgBtnNext,nextSection, 2, 2, 2, 9);
var button_select = new Button(imgBtnSelect,selectSection, 3, 2, 4, 9);

var listButtons = [
    button_prev,
    button_next,
    button_select,
];

// 빌보드 초기화 ==============================

// const SECTION_INTRO = 0;
const SECTION_GITHUB = 0;
const SECTION_BLOG = 1;
const SECTION_PROJECTS = 2;
const SECTION_RESUME = 3;
/*const SECTION_WORDLE = 1;*/

var currentSection = { "section": SECTION_GITHUB};

var start_pos = 6;
var board_gap = 12;

var listBoard = [
    new Board(start_pos + (board_gap * SECTION_GITHUB), 3, imgObjBoardGithub, SECTION_GITHUB, "https://github.com/tes-b"),
    new Board(start_pos + (board_gap * SECTION_BLOG), 3, imgObjBoardBlog, SECTION_BLOG, "https://tes-b.github.io/"),
    new Board(start_pos + (board_gap * SECTION_PROJECTS), 3, imgObjBoardProjects, SECTION_PROJECTS, "https://youtube.com/playlist?list=PL2QNFtrDTeb68f6i1MfZrjDSH9rzKrFlk"),
    new Board(start_pos + (board_gap * SECTION_RESUME), 3, imgObjBoardResume, SECTION_RESUME, "https://docs.google.com/document/d/1ewpYogaF_9VN_tIuevlasXyUdC_toG6xpavs3bUC258/edit?usp=sharing"),
    /*new Board(54, 3, imgObjBoardWordle, SECTION_WORDLE, "/wordle/"),*/
];

const SECTION_MAX = listBoard.length;

// 캐릭터 =================================
var charactor = new Charactor(start_pos, 7);
var info = new Info(charactor, currentSection);

cam.followObj = charactor;

var drawInfo = false;

// RUN FUNCTIONS ============;
keyInput();
mouseInput();
changeSection(currentSection.section);
run();
// charactor.move("stop");  // 캐릭터 급발진 방지

// DECLARE FUNCTIONS=========

function nextSection() {
    var section = currentSection.section;
    if (section + 1 >= SECTION_MAX) { return; }
    section += 1;
    changeSection(section);
    charactor.changeSection(section);
}

function prevSection() {
    var section = currentSection.section;
    if (section - 1 < 0) { return; }
    section -= 1;
    changeSection(section);
    charactor.changeSection(section);
}

function selectSection(newTab=true) {
    charactor.move("stop"); // 캐릭터 멈추기

    if (newTab) {
        window.open(listBoard[currentSection.section].url);
    }
    else {
        location.href = listBoard[currentSection.section].url;
    }
    
}

function changeSection(section) {
    currentSection.section = section;
    listBoard.forEach((board) => {
        board.lightOn = false;
    });
    listBoard[section].lightOn = true;
}

function mouseInput() {
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();

        clientX = event.clientX;
        clientY = event.clientY;
        rectLeft = rect.left;
        rectTop = rect.top;
        
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (event) => {
        listButtons.forEach((button) => {
            button.press();
        });
    });

    canvas.addEventListener('mouseup', (event) => {
        listButtons.forEach((button) => {
            button.up();
        });
    });
}

function keyInput() {
    document.addEventListener('keydown', function (e) {
        console.log(e);
        if (e.code === 'Enter') {
            selectSection();
        }
        if (e.code === 'Space') {
            selectSection();
        }
        if (e.code === 'ArrowLeft') {
            prevSection();
        }
        if (e.code === 'ArrowRight') {
            nextSection();
        }
        if (e.code === 'ArrowUp') {
            selectSection();
        }
        if (e.code === 'ArrowDown') {

        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.code === 'ArrowLeft') {
        }
        if (e.code === 'ArrowRight') {
        }
        if (e.code === 'ArrowUp') {
        }
        if (e.code === 'ArrowDown') {
        }
    });
}


function run() {

    animation = requestAnimationFrame(run);
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= frameDuration) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        charactor.update(elapsedTime);
        cam.update(elapsedTime);
        listButtons.forEach((button) => {
            button.update();
        });
        
        if (!onOverlay) {
            bg.draw();
            map.draw();
            listBoard.forEach((board) => {
                board.draw();
            });

            listButtons.forEach((button) => {
                button.draw();
            });
        }
        charactor.draw(hitbox = false);

        if (drawInfo) {
            info.draw();
        }


        // if (lastTime % cactusSpawnTime <= frameDuration) {
        //     var cactus = new Cactus();
        //     cactusArr.push(cactus);
        // }


        //===================================================
        lastTime = currentTime - (elapsedTime % frameDuration);
    }
}



function collisionCheck(obj1, obj2) {
    var diffX = Math.abs(obj1.x - obj2.x);
    var diffY = Math.abs(obj1.y - obj2.y);

    if ((diffX < (obj1.widthHalf + obj2.widthHalf))
        && (diffY < (obj1.heightHalf + obj2.heightHalf))) {
        return true;
    }
    return false;
}
