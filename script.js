/*----- state variables -----*/
let size = 0;
let format = "";
let score = [];
let settingsComplete = false;
let gameOver = false;
let blackPlayer = "";
let whitePlayer = "";
let currPlayer = "black";
let currMove = 0;
let optionTourn;
let optionTourn2;
let winner;

/*----- constants -----*/
const board = document.querySelector("#board");
const footer = document.querySelector("#footer");
const footerText = footer.querySelector("p");
const decisions = document.querySelector("#decisions");
const sideBar1 = document.querySelector("#sidebar-1");
const sideBar2 = document.querySelector("#sidebar-2");
const settingsView = document.querySelector("#settings");
const rulesView = document.querySelector("#rules");
const returnButton = rulesView.querySelector("button");
const navigation = document.querySelector("#navigation");
const navigationButtons = navigation.querySelectorAll("button");

/*-----     Settings Page (Default Page)   -----*/
window.onload = function () {
  launch();
};

function launch() {
  const settingButtons = settingsView.querySelectorAll("button");
  for (let i = 0; i < 4; i++) {
    settingButtons[i].addEventListener("click", function (e) {
      e.target.classList.add("selected");
      if (e.target === settingButtons[0]) {
        settingButtons[1].classList.remove("selected");
        size = 15;
      } else if (e.target === settingButtons[1]) {
        settingButtons[0].classList.remove("selected");
        size = 19;
      }

      if (e.target === settingButtons[2]) {
        settingButtons[3].classList.remove("selected");
        format = "freestyle";
      } else if (e.target === settingButtons[3]) {
        settingButtons[2].classList.remove("selected");
        format = "tournament";
      }
    });
  }

  settingButtons[4].addEventListener("click", function () {
    const blackName = document.getElementById("black-name");
    const whiteName = document.getElementById("white-name");
    blackPlayer = blackName.value;
    whitePlayer = whiteName.value;
    if (
      size !== 0 &&
      format !== "" &&
      blackPlayer !== "" &&
      whitePlayer !== ""
    ) {
      settingsComplete = true;
      settingsView.style.display = "none";
      board.style.display = "flex";
      buildBoard();
    }
  });
}

/*-----     Rules Page (Default Page)   -----*/

returnButton.addEventListener("click", function (e) {
  if (settingsComplete != true) {
    rulesView.style.display = "none";
    board.style.display = "none";
    settings.style.display = "grid";
  } else {
    rulesView.style.display = "none";
    board.style.display = "flex";
    settingsView.style.displau = "none";
  }
});

/*-----     Navigation   -----*/

navigationButtons[0].addEventListener("click", function () {
  rulesView.style.display = "flex";
  board.style.display = "none";
  settings.style.display = "none";
});

navigationButtons[1].addEventListener("click", function () {
  location.reload();
});

/*-----     Gameplay: Building Board -----*/

function buildBoard() {
  const blackName = document.createElement("p");
  blackName.innerText = `${blackPlayer}`;
  const whiteName = document.createElement("p");
  whiteName.innerText = `${whitePlayer}`;
  whiteName.style.textShadow = "2px 2px black";
  sideBar1.append(blackName);
  sideBar2.append(whiteName);
  for (let row = 0; row < size; row++) {
    let rowArray = [];
    // to push into score array which will be used to check for Winner every round
    for (let col = 0; col < size; col++) {
      rowArray.push("empty");
      let cell = document.createElement("div");
      cell.classList.add("cell-" + `${size}`);
      cell.setAttribute("id", `${row}-${col}`);
      if (format === "freestyle") {
        cell.addEventListener("click", setPieceFree);
      } else {
        cell.addEventListener("click", setPieceTourn);
      }

      if (col === 0 && row === 0) {
        cell.classList.add("corner-tl");
      } else if (col === size - 1 && row === 0) {
        cell.classList.add("corner-tr");
      } else if (col === 0 && row === size - 1) {
        cell.classList.add("corner-bl");
      } else if (col === size - 1 && row === size - 1) {
        cell.classList.add("corner-br");
      } else if (col === 0) {
        cell.classList.add("left-edge");
      } else if (col === size - 1) {
        cell.classList.add("right-edge");
      } else if (row === 0) {
        cell.classList.add("top-edge");
      } else if (row === size - 1) {
        cell.classList.add("bottom-edge");
      } else {
        cell.classList.add("centre-board");
      }
      board.append(cell);
    }
    score.push(rowArray);
    footerText.innerText = `It is ${blackPlayer}'s turn`;
  }
}

/*-----     Gameplay - Setting Pieces   -----*/

//Tournament
function setPieceTourn(e) {
  if (gameOver) return;
  if (e.target.innerHTML.includes("img")) {
    return;
  }
  if (footer.innerHTML.includes("button")) {
    return;
  }
  let targetId = e.target.getAttribute("id");
  let targetCoord = targetId.split("-");
  let r = parseInt(targetCoord[0]);
  let c = parseInt(targetCoord[1]);
  score[r][c] = currPlayer;

  if (currMove < 3) {
    if (currPlayer === "black") {
      let piece = document.createElement("img");
      piece.setAttribute("src", `images/black-piece.png`);
      piece.classList.add(`piece-${size}`);
      e.target.append(piece);
      currPlayer = "white";
    } else {
      let piece = document.createElement("img");
      piece.setAttribute("src", `images/white-piece.png`);
      piece.classList.add(`piece-${size}`);
      e.target.append(piece);
      currPlayer = "black";
    }
    currMove++;
    return;
  }

  if (currMove === 3) {
    score[r][c] = "empty";
    makeDecision();
    currMove++;
    return;
  }

  if (currMove > 3 && (optionTourn === "continue" || optionTourn === "swap")) {
    setImage(e);
    currMove++;
    checkWinner();
    return;
  }

  if (currMove > 3 && currMove < 6 && optionTourn === "defer") {
    if (currPlayer === "black") {
      let piece = document.createElement("img");
      piece.setAttribute("src", `images/black-piece.png`);
      piece.classList.add(`piece-${size}`);
      e.target.append(piece);
      currPlayer = "white";
    } else {
      let piece = document.createElement("img");
      piece.setAttribute("src", `images/white-piece.png`);
      piece.classList.add(`piece-${size}`);
      e.target.append(piece);
      currPlayer = "black";
    }
    currMove++;
    checkWinner();
    return;
  }

  if (currMove === 6 && optionTourn === "defer") {
    score[r][c] = "empty";
    makeDecision2();
    currMove++;
    checkWinner();
    return;
  }

  if (currMove > 6 && optionTourn === "defer" && optionTourn2 === "continue") {
    setImage(e);
    currMove++;
    checkWinner();
    return;
  }
  if (currMove > 6 && optionTourn === "defer" && optionTourn2 === "swap") {
    setImage(e);
    currMove++;
    checkWinner();
  }
}
//Tournament White Decision
function makeDecision() {
  footerText.innerText = `${whitePlayer} chooses how to proceed`;

  let continueButton = document.createElement("button");
  continueButton.classList.add("decision");
  continueButton.innerText = `CONTINUE`;
  continueButton.addEventListener("click", contin);

  let swapButton = document.createElement("button");
  swapButton.classList.add("decision");
  swapButton.innerText = `SWAP`;
  swapButton.addEventListener("click", swap);

  let deferButton = document.createElement("button");
  deferButton.classList.add("decision");
  deferButton.innerText = `DEFER`;
  deferButton.addEventListener("click", defer);

  decisions.append(continueButton, swapButton, deferButton);
}

function contin() {
  optionTourn = "continue";
  footerText.innerText = `${whitePlayer} has chosen to continue\nIt is ${whitePlayer}'s turn`;
  const removeButtons = footer.querySelectorAll("button");
  removeButtons.forEach((button) => button.remove());
}

function swap() {
  optionTourn = "swap";
  let white = whitePlayer;
  whitePlayer = blackPlayer;
  blackPlayer = white;
  refreshNames();
  footerText.innerText = `${blackPlayer} has chosen to swap colours\nIt is ${whitePlayer}'s turn to move`;
  const removeButtons = footer.querySelectorAll("button");
  removeButtons.forEach((button) => button.remove());
}

function defer() {
  optionTourn = "defer";
  footerText.innerText = `${whitePlayer} has chosen to defer their decision\nIt is ${whitePlayer}'s turn to move`;
  const removeButtons = footer.querySelectorAll("button");
  removeButtons.forEach((button) => button.remove());
}

//Tournament Black Decision
function makeDecision2() {
  footerText.innerText = `${blackPlayer} chooses how to proceed`;

  let continueButton2 = document.createElement("button");
  continueButton2.classList.add("decision");
  continueButton2.innerText = `CONTINUE`;
  continueButton2.addEventListener("click", contin2);

  let swapButton2 = document.createElement("button");
  swapButton2.classList.add("decision");
  swapButton2.innerText = `SWAP`;
  swapButton2.addEventListener("click", swap2);

  decisions.append(continueButton2, swapButton2);
}

function contin2() {
  optionTourn2 = "continue";
  footerText.innerText = `${blackPlayer} has chosen to continue\nIt is ${whitePlayer}'s turn`;
  const removeButtons = footer.querySelectorAll("button");
  removeButtons.forEach((button) => button.remove());
}

function swap2() {
  optionTourn2 = "swap";
  let white = whitePlayer;
  whitePlayer = blackPlayer;
  blackPlayer = white;
  refreshNames();
  footerText.innerText = `${whitePlayer} has chosen to swap colours\nIt is ${whitePlayer}'s turn`;
  const removeButtons = footer.querySelectorAll("button");
  removeButtons.forEach((button) => button.remove());
}

function refreshNames() {
  const blackName = sideBar1.querySelector("p");
  blackName.innerText = `${blackPlayer}`;
  const whiteName = sideBar2.querySelector("p");
  whiteName.innerText = `${whitePlayer}`;
}

//Freestyle
function setPieceFree(e) {
  if (gameOver) return;
  if (e.target.innerHTML.includes("img")) return;
  let targetId = e.target.getAttribute("id");
  let targetCoord = targetId.split("-");
  let r = parseInt(targetCoord[0]);
  let c = parseInt(targetCoord[1]);
  score[r][c] = currPlayer;
  setImage(e);
  currMove++;
  checkWinner();
}

//Visuals
function setImage(e) {
  if (currPlayer === "black") {
    let piece = document.createElement("img");
    piece.setAttribute("src", `images/black-piece.png`);
    piece.classList.add(`piece-${size}`);
    e.target.append(piece);
    currPlayer = "white";
    footerText.innerText = `It is ${whitePlayer}'s turn`;
  } else {
    let piece = document.createElement("img");
    piece.setAttribute("src", `images/white-piece.png`);
    piece.classList.add(`piece-${size}`);
    e.target.append(piece);
    currPlayer = "black";
    footerText.innerText = `It is ${blackPlayer}'s turn`;
  }
}

/*-----     Gameplay - Winning Logic   -----*/
function checkWinner() {
  //horizontal
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 4; col++) {
      if (
        score[row][col] !== "empty" &&
        score[row][col] === score[row][col + 1] &&
        score[row][col + 1] === score[row][col + 2] &&
        score[row][col + 2] === score[row][col + 3] &&
        score[row][col + 3] === score[row][col + 4]
      ) {
        winner = score[row][col];
        //visuals
        const piece1 = document.getElementById(`${row}-${col}`);
        const piece2 = document.getElementById(`${row}-${col + 1}`);
        const piece3 = document.getElementById(`${row}-${col + 2}`);
        const piece4 = document.getElementById(`${row}-${col + 3}`);
        const piece5 = document.getElementById(`${row}-${col + 4}`);
        for (const piece of [piece1, piece2, piece3, piece4, piece5]) {
          const img = piece.querySelector("img");
          img.setAttribute("src", `images/${winner}-win.png`);
        }
        announceWinner();
        //terminate game
        gameOver = true;
        return;
      }
    }
  }
  //vertical
  for (let row = 0; row < size - 4; row++) {
    for (let col = 0; col < size; col++) {
      if (
        score[row][col] !== "empty" &&
        score[row][col] === score[row + 1][col] &&
        score[row + 1][col] === score[row + 2][col] &&
        score[row + 2][col] === score[row + 3][col] &&
        score[row + 3][col] === score[row + 4][col]
      ) {
        winner = score[row][col];
        //visuals
        const piece1 = document.getElementById(`${row}-${col}`);
        const piece2 = document.getElementById(`${row + 1}-${col}`);
        const piece3 = document.getElementById(`${row + 2}-${col}`);
        const piece4 = document.getElementById(`${row + 3}-${col}`);
        const piece5 = document.getElementById(`${row + 4}-${col}`);
        for (const piece of [piece1, piece2, piece3, piece4, piece5]) {
          const img = piece.querySelector("img");
          img.setAttribute("src", `images/${winner}-win.png`);
        }
        announceWinner();
        //terminate game
        gameOver = true;
        return;
      }
    }
  }
  // //diagonal
  for (let row = 0; row < size - 4; row++) {
    for (let col = 0; col < size - 4; col++) {
      if (
        score[row][col] !== "empty" &&
        score[row][col] === score[row + 1][col + 1] &&
        score[row + 1][col + 1] === score[row + 2][col + 2] &&
        score[row + 2][col + 2] === score[row + 3][col + 3] &&
        score[row + 3][col + 3] === score[row + 4][col + 4]
      ) {
        winner = score[row][col];
        //visuals
        const piece1 = document.getElementById(`${row}-${col}`);
        const piece2 = document.getElementById(`${row + 1}-${col + 1}`);
        const piece3 = document.getElementById(`${row + 2}-${col + 2}`);
        const piece4 = document.getElementById(`${row + 3}-${col + 3}`);
        const piece5 = document.getElementById(`${row + 4}-${col + 4}`);
        for (const piece of [piece1, piece2, piece3, piece4, piece5]) {
          const img = piece.querySelector("img");
          img.setAttribute("src", `images/${winner}-win.png`);
        }
        announceWinner();
        //terminate game
        gameOver = true;
        return;
      }
    }
  }

  // anti-diagonal
  for (let row = 0; row < size - 4; row++) {
    for (let col = 4; col < size; col++) {
      if (
        score[row][col] !== "empty" &&
        score[row][col] === score[row + 1][col - 1] &&
        score[row + 1][col - 1] === score[row + 2][col - 2] &&
        score[row + 2][col - 2] === score[row + 3][col - 3] &&
        score[row + 3][col - 3] === score[row + 4][col - 4]
      ) {
        winner = score[row][col];
        //visuals
        const piece1 = document.getElementById(`${row}-${col}`);
        const piece2 = document.getElementById(`${row + 1}-${col - 1}`);
        const piece3 = document.getElementById(`${row + 2}-${col - 2}`);
        const piece4 = document.getElementById(`${row + 3}-${col - 3}`);
        const piece5 = document.getElementById(`${row + 4}-${col - 4}`);
        for (const piece of [piece1, piece2, piece3, piece4, piece5]) {
          const img = piece.querySelector("img");
          img.setAttribute("src", `images/${winner}-win.png`);
        }
        announceWinner();
        //terminate Game
        gameOver = true;
        return;
      }
    }
  }
  if (format === "freestyle" && currMove === size * size) {
    footerText.innerText = `The game ended up in a draw\nClick restart to play another game`;
    gameOver = true;
  } else if (
    format === "tournament" &&
    (optionTourn === "continue" || optionTourn === "swap") &&
    currMove === size * size + 1
  ) {
    footerText.innerText = `The game ended up in a draw\nClick restart to play another game`;
    gameOver = true;
  } else if (
    format === "tournament" &&
    optionTourn === "defer" &&
    currMove === size * size + 2
  ) {
    footerText.innerText = `The game ended up in a draw\nClick restart to play another game`;
    gameOver = true;
  }
}

//Announcing Winner
function announceWinner() {
  if (winner === "black") {
    footerText.innerText = `${blackPlayer} is the winner.\nClick restart to play another game`;
  } else {
    footerText.innerText = `${whitePlayer} is the winner\nClick restart to play another game`;
  }
}
