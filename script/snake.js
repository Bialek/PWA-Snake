const playGround = document.querySelector('.snake__playground');
const settings = document.querySelector('.settings');

let basicDirectors = {
  top: 0,
  left: -1,
  down: 0,
  right: 1,
};

const gameSetting = {
  basicDifficults: {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard',
  },
  actualDifficult: 'Easy',
};

let actualDirectors = basicDirectors.left;

const START_SNAKE_LENGHT = 4;

let snakePosition = [];
let playgroundBorderPositionsTop = [];
let playgroundBorderPositionsLeft = [];
let playgroundBorderPositionsDown = [];
let playgroundBorderPositionsRight = [];

function addSnakeClassToElement(elementId) {
  const snakeElement = document.getElementById(elementId);
  snakeElement.classList.add('snake__figure');
}

function removeSnakeClassToElement(elementId) {
  const snakeElement = document.getElementById(elementId);
  snakeElement.classList.remove('snake__figure');
}

function generateSnake(position) {
  for (let i = 0; i <= START_SNAKE_LENGHT; i++) {
    addSnakeClassToElement(position + i);
    snakePosition = [...snakePosition, position + i];
  }
}

function generatePlayground(size) {
  const playGroundSize = size * size;
  for (let i = 1; i <= playGroundSize; i++) {
    let lastIterationChar = `${i}`.slice(-1);
    //pushing first ten, last ten and
    //every id number that last character is 0 or 1 to array to get
    //borders positions ids
    if (i <= size) {
      playgroundBorderPositionsTop = [...playgroundBorderPositionsTop, i];
    }
    if (i > playGroundSize - size) {
      playgroundBorderPositionsDown = [...playgroundBorderPositionsDown, i];
    }
    if (lastIterationChar === '1') {
      playgroundBorderPositionsLeft = [...playgroundBorderPositionsLeft, i];
    }
    if (lastIterationChar === '0') {
      playgroundBorderPositionsRight = [...playgroundBorderPositionsRight, i];
    }

    playGround.insertAdjacentHTML(
      'beforeend',
      `<div id=${i} class="snake__box">`
    );
  }
  generateSnake(playGroundSize / 2 - size / 2);
}

function moving(direct) {
  let newPositionIds = [];

  snakePosition.forEach((positionId, key) => {
    const FIRST_ARRAY_ELEMENT = 0;
    let newFirstElementPosition = positionId + direct;

    if (key === FIRST_ARRAY_ELEMENT) {
      switch (actualDirectors) {
        case basicDirectors.top: {
          console.log('top');
          endGame();
        }

        case basicDirectors.right:
          console.log('top');

        case basicDirectors.down:
          console.log('top');

        case basicDirectors.left: {
          const searchPositionId = playgroundBorderPositionsLeft.find(
            id => id === positionId
          );
          // console.log(searchPositionId);

          const searchNewPositionId = playgroundBorderPositionsRight.find(
            id => id === newFirstElementPosition
          );

          if (searchPositionId && searchNewPositionId) {
            if (
              gameSetting.actualDifficult === gameSetting.basicDifficults.Hard
            ) {
              endGame();
            }
            newFirstElementPosition += 10;
          }
        }
      }

      addSnakeClassToElement(newFirstElementPosition);
      newPositionIds = [...newPositionIds, newFirstElementPosition];
    }

    if (key === snakePosition.length - 1) {
      removeSnakeClassToElement(positionId);
    }

    if (key !== 0) {
      newPositionIds = [...newPositionIds, snakePosition[key - 1]];
    }
  });

  snakePosition = newPositionIds;
}

const moveLeft = () => {
  if (
    actualDirectors !== basicDirectors.left &&
    actualDirectors !== basicDirectors.right
  ) {
    moving(basicDirectors.left);
    actualDirectors = basicDirectors.left;
  }
};

const moveRight = () => {
  if (
    actualDirectors !== basicDirectors.left &&
    actualDirectors !== basicDirectors.right
  ) {
    moving(basicDirectors.right);
    actualDirectors = basicDirectors.right;
  }
};

const movetop = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.top
  ) {
    moving(basicDirectors.top);
    actualDirectors = basicDirectors.top;
  }
};

const moveDown = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.top
  ) {
    moving(basicDirectors.down);
    actualDirectors = basicDirectors.down;
  }
};

function detectKey(event) {
  switch (event.keyCode) {
    case 37:
    case 97:
      moveLeft();
      break;
    case 38:
    case 119:
      movetop();
      break;
    case 39:
    case 100:
      moveRight();
      break;
    case 40:
    case 115:
      moveDown();
      break;
    default:
      break;
  }
}

const startBtn = document.querySelector('.settings__btn');

startBtn.addEventListener('click', startGame);

function startGame() {
  settings.classList.add('settings--hidden');

  playGround.innerHTML = '';
  gameSetting.actualDifficult = document.querySelector(
    'input[name=difficulty]:checked'
  ).value;
  const playGroundSize = document.querySelector(
    '.settings__playground-size-select'
  ).value;

  basicDirectors = {
    ...basicDirectors,
    top: -playGroundSize,
    down: +playGroundSize,
  };
  console.log(gameSetting.actualDifficult);

  const style = document.documentElement.style;
  style.setProperty('--rowNum', playGroundSize);
  style.setProperty('--colNum', playGroundSize);

  generatePlayground(playGroundSize);

  playGround.classList.remove('snake__playground--hidden');

  if (gameSetting.actualDifficult === gameSetting.basicDifficults.Medium) {
    playGround.classList.add('snake__playground--medium');
  }
  if (gameSetting.actualDifficult === gameSetting.basicDifficults.Hard) {
    playGround.classList.add('snake__playground--hard');
  }

  document.addEventListener('keypress', detectKey);
  const autoMove = setInterval(() => moving(actualDirectors), 1000);
  return autoMove;
}

function endGame() {
  alert('Game Over!');
  playGround.classList.remove(
    'snake__playground--medium',
    'snake__playground--hard'
  );
  playGround.classList.add('snake__playground--hidden');

  clearInterval(autoMove);
  document.removeEventListener('keypress', detectKey);
  settings.classList.remove('settings--hidden');
}
