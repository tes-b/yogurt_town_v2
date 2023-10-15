// initLocalStorage();

// ====================================================
// Variables
// ====================================================

let guessedWords = [[]] // 시도한 단어
let availableSpace = 1; // 현재 글자가 들어갈 자리


let guessedWordCount = 0;
let onPlay = false;
let onResultBox = false;

const keys = document.querySelectorAll(".keyboard-row button") // 키보드 버튼

const colorGreen = "rgb(83,  141, 78)";
const colorYellow = "rgb(181, 159, 59)";
const colorGrey = "rgb(58,  58,  60)";
const colorRed = "rgb(154, 35,  53)";

let word = "";
let word_id = 0;

let username = "";
let user_id = null;


// ====================================================
// Process
// ====================================================

getUserInfo();
newGame();
keyInput();


// ====================================================
// FUNCTIONS
// ====================================================

function resetPage() {
    // console.log(word_id, word);
    guessedWords = [[]]; // 시도한 단어
    availableSpace = 1; // 현재 글자가 들어갈 
    guessedWordCount = 0;
    onPlay = true;
    closeResultBox();
    createSquares();
    resetGuessedKeys();
}



function newGame() {
    // 이 과정에서 각 단어의 정답률, 평균 시도 횟수 등을 통계처리 할 수 있을 듯

    // const wordArr = ['seven', 'world', 'about', 'again', 'heart', 'pizza', 'water', 'happy', 'sixty', 'board', 'month', 'angel', 'death', 'green', 'music', 'fifty', 'three', 'party', 'piano', 'kelly', 'mouth'];

    fetch("/wordle/api?rand=true") // 데이터베이스에서 랜덤으로 단어 가져옴
        .then(response => {
            // console.log(response)
            if (response.status == 200) {
                return response.json();
            }
            else {
                throw new Error("단어를 받아오지 못했습니다.");
            }
        })
        .then(data => {
            word = data['word'];
            word_id = data['id'];
            resetPage();
        })
        .catch(error => {
            console.log('Fetch Error', error);
            window.alert(error.message);
        });
}

function getCurrentWordArr() { // 입력한 단어 리스트
    const numberOfGuessedWords = guessedWords.length
    return guessedWords[numberOfGuessedWords - 1]
}

function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);

        const availableSpaceEl = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;

        availableSpaceEl.textContent = letter;
    }
}

function updateGuessedKeys(letter, color) { // 키 색 변경
    const buttonEl = document.querySelector(`button[data-key=${letter}]`); // 글자 버튼 가져오기
    const bgColor = window.getComputedStyle(buttonEl).getPropertyValue('background-color'); // 색상 가져오기
    if (bgColor === colorGreen) { return; } // 색상 green 이면 리턴
    buttonEl.style = `background-color:${color};border-color:${color}`; // 색상 변경
}

function resetGuessedKeys() { // 키 색 초기화
    for (let i = 0; i < keys.length; i++) {
        keys[i].style.removeProperty("background-color");
    }
}

function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
        return colorGrey;
    };

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
        return colorGreen;
    }

    return colorYellow;
}

function sendResult(result) {
    
    // 게임 결과 보내기
    let data = {
        'word': word_id,
        'result': result,
        'tries': guessedWordCount,
        'user': user_id
    }
    for (var i=0; i<guessedWords.length; i++) {
        let column = "guess" + String(i+1);
        data[column] = guessedWords[i].join('');
    }

    fetch("/leaderboard/api/record/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        })
        .then(response => {
            // console.log(response)
            if (response.status == 200) {
                return;
            }
            else {
                throw new Error("Result sending failed");
            }
        })
}

function openResultBox(result) {
    // console.log("open-result-box");
    onPlay = false;
    onResultBox = true;
    document.getElementById("result-box").style.display = "block";

    // for (let index = 0; index < 30; index++) {
    //     let square = document.createElement("div");
    //     square.classList.add("square");
    //     square.classList.add("animate__animated");
    //     square.setAttribute("id", index + 1);
    //     gameBoard.appendChild(square);
    // }

    // const gameBoard = document.getElementById("board");
    let textResult = result ? 'WIN' : 'LOOSE';
    let colourResult = result ? colorGreen : colorRed;
    var template = `
    <div>
        <h1 style="color:${colourResult};
        text-shadow:
        -1px -1px 0 #FFFFFF,
         1px -1px 0 #FFFFFF,
        -1px  1px 0 #FFFFFF,
         1px  1px 0 #FFFFFF;">${textResult}</h1>
        <div>ANSWER</div>
        <div id="board-container">
            <div id="answer-board">
                <div class="square" id="answer">${word[0]}</div>
                <div class="square" id="answer">${word[1]}</div>
                <div class="square" id="answer">${word[2]}</div>
                <div class="square" id="answer">${word[3]}</div>
                <div class="square" id="answer">${word[4]}</div>
            </div>
        </div>
        <div>TRIES : ${guessedWordCount}</div>
    </div>`;
    const resultEl = document.getElementById("result-content");
    while (resultEl.hasChildNodes()) {
        resultEl.removeChild(resultEl.firstChild);
    }

    resultEl.insertAdjacentHTML("afterbegin", template);

    // 결과창에 통계 보여준다. 
    // 평균 답안 수
    // 개인 평균
    // 정답글자
    // 새게임
}

function closeResultBox() {
    // console.log("close-result-box");
    onResultBox = false;
    document.getElementById("result-box").style.display = "none";
}

function checkResult(currentWord) {
    guessedWordCount += 1;

    if (currentWord === word) { // 정답
        sendResult(true);
        openResultBox(true);
        return;
    }

    if (guessedWords.length === 6) {
        sendResult(false);
        openResultBox(false);
        return;
    }

    guessedWords.push([]);
    onPlay = true;
}

function handleSubmitWord() {
    console.log("handleSubmitWord");
    
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) { // 5 letter only
        // window.alert("5글자 단어를 제출하세요거트~");
        // shakeX 애니메이션 
        // 글자 지우기
        onPlay = true;
        return;
    }

    const currentWord = currentWordArr.join('') // 단어조합

    fetch(`/wordle/api?word=${currentWord}`)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                throw new Error("단어를 받아오지 못했습니다.");
            }
        })
        .then(data => {
            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 100;

            if (data) { // 단어가 데이터베이스에 있는 경우
                const promises = [];
                currentWordArr.forEach(function (letter, index) {
                    promises.push(new Promise((resolve) => {
                        setTimeout(() => {
                            const tileColor = getTileColor(letter, index);

                            const letterId = firstLetterId + index;
                            const letterEl = document.getElementById(letterId);
                            letterEl.classList.add("animate__flipInX");
                            // letterEl.style.setProperty('--animate-duration', '.5s');
                            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                            letterEl.addEventListener("animationend", () => {
                                resolve(); // resolve the promise when the animation is completed
                            });
                            updateGuessedKeys(letter, tileColor);
                        }, interval * index);
                    }));
                });

                Promise.all(promises).then(() => {
                    checkResult(currentWord)

                }); // 모든 애니메이션이 끝나면 결과 확인한다.
            }
            else { // 단어가 데이터베이스에 없는 경우
                const promises = [];
                currentWordArr.forEach(function (letter, index) {
                    promises.push(new Promise((resolve) => {
                        setTimeout(() => {
                            const tileColor = colorRed;

                            const letterId = firstLetterId + index;
                            const letterEl = document.getElementById(letterId);
                            letterEl.classList.add("animate__headShake");
                            // letterEl.style.setProperty('--animate-duration', '.5s');
                            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                            letterEl.addEventListener("animationend", () => {
                                resolve(); // resolve the promise when the animation is completed
                            });
                        }, 0);
                    }));
                });
                Promise.all(promises).then(() => { // 단어 지우기
                    for (let index = 0; index < 5; index++) {
                        handleDeleteLetter();
                        const letterId = firstLetterId + index;
                        const letterEl = document.getElementById(letterId);
                        letterEl.style = "";
                        letterEl.classList.remove("animate__headShake");
                    }
                    onPlay = true;
                }); // 모든 애니메이션이 끝나면 결과 확인한다.
            }
        })
        .catch(error => {
            console.log('Fetch Error', error);
            window.alert(error.message);
        })
}
// 글자 삭제
function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr % 5 == 0) { // 이미 확인한 단어는 지우지 못함
        // console.log("Can't delete")
        return;
    }

    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1))

    lastLetterEl.textContent = '';
    availableSpace = availableSpace - 1;
}

function createSquares() { // 글자칸 생성
    const gameBoard = document.getElementById("board");
    while (gameBoard.hasChildNodes()) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    for (let index = 0; index < 30; index++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.classList.add("animate__animated");
        square.setAttribute("id", index + 1);
        gameBoard.appendChild(square);
    }
}

// 글자 입력
function keyInput() {

    // 키보드 입력
    document.addEventListener('keydown', (event) => {
        const letter = event.key;
        // console.log(event);

        if (letter === 'Enter') {
            if (onPlay) {
                onPlay = false;
                handleSubmitWord();
                return;
            }
            else if (onResultBox) {
                newGame();
                return;
            }
        }

        if (!onPlay) { return; }
        if (['Delete', 'Backspace'].includes(letter)) {

            if (availableSpace > 1) {
                handleDeleteLetter();
            }
            return;
        }

        if ('abcdefghijklmnopqrstuvwxyz'.includes(letter)) {
            updateGuessedWords(letter);
            return;
        }
    });

    // 클릭 입력
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            if (!onPlay) { return; }
            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if (letter === 'del') {
                if (availableSpace > 1) {
                    handleDeleteLetter();
                }
                return;
            }

            // console.log(letter);
            updateGuessedWords(letter);
        }
    }
}
