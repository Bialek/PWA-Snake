const playGround = document.querySelector('.snake__playground');
const settings = document.querySelector('.settings');

let basicDirectors = {
  top: 0,
  left: -1,
  down: 0,
  right: 1,
};

let actualDirectors = basicDirectors.left;

const gameSetting = {
  defaultDirector: basicDirectors.left,
  basicDifficults: {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard',
  },
  actualDifficult: 'Easy',
  playgroundSize: 0,
  playgroundFullSize: 0,
  foodId: 0,
  gameSpeed: 1000,
  points: 0,
  startSnakeLenght: 4,
};

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
  for (let i = 0; i <= gameSetting.startSnakeLenght; i++) {
    addSnakeClassToElement(position + i);
    snakePosition = [...snakePosition, position + i];
  }
}

function generatePlayground(size) {
  const playgroundFullSize = size * size;
  gameSetting.playgroundFullSize = playgroundFullSize;
  let isLeftBorder;
  playgroundBorderPositionsTop = [];
  playgroundBorderPositionsLeft = [1];
  playgroundBorderPositionsDown = [];
  playgroundBorderPositionsRight = [];
  for (let i = 1; i <= playgroundFullSize; i++) {
    if (i <= size) {
      playgroundBorderPositionsTop = [...playgroundBorderPositionsTop, i];
    }
    if (i > playgroundFullSize - size) {
      playgroundBorderPositionsDown = [...playgroundBorderPositionsDown, i];
    }

    isLeftBorder = i % size;

    if (isLeftBorder === 0) {
      playgroundBorderPositionsRight = [...playgroundBorderPositionsRight, i];
      if (i !== gameSetting.playgroundFullSize) {
        let nextIndex = i + 1;
        playgroundBorderPositionsLeft = [
          ...playgroundBorderPositionsLeft,
          nextIndex,
        ];
      }
    }

    playGround.insertAdjacentHTML(
      'beforeend',
      `<div id=${i} class="snake__box">`
    );
  }

  generateSnake(playgroundFullSize / 2 - size / 2);
}

function moving(direct) {
  let newPositionIds = [];

  snakePosition.forEach((positionId, key) => {
    const FIRST_ARRAY_ELEMENT = 0;

    let newFirstElementPosition = direct + positionId;

    if (key === FIRST_ARRAY_ELEMENT) {
      switch (actualDirectors) {
        case basicDirectors.top:
          {
            if (newFirstElementPosition < 0) {
              if (
                gameSetting.actualDifficult === gameSetting.basicDifficults.Easy
              ) {
                newFirstElementPosition =
                  gameSetting.playgroundFullSize + newFirstElementPosition;

                break;
              }

              return endGame();
            }
          }
          break;

        case basicDirectors.right:
          {
            const searchPositionId = playgroundBorderPositionsRight.find(
              id => id === positionId
            );

            const searchNewPositionId = playgroundBorderPositionsLeft.find(
              id => id === newFirstElementPosition
            );

            if (
              searchPositionId &&
              searchNewPositionId |
                (newFirstElementPosition > gameSetting.playgroundFullSize)
            ) {
              if (
                gameSetting.actualDifficult === gameSetting.basicDifficults.Hard
              ) {
                return endGame();
              }

              newFirstElementPosition =
                newFirstElementPosition - gameSetting.playgroundSize;
            }
          }
          break;

        case basicDirectors.down:
          {
            if (newFirstElementPosition > gameSetting.playgroundFullSize) {
              if (
                gameSetting.actualDifficult === gameSetting.basicDifficults.Easy
              ) {
                newFirstElementPosition =
                  newFirstElementPosition - gameSetting.playgroundFullSize;

                break;
              }

              return endGame();
            }
          }
          break;

        case basicDirectors.left:
          {
            const searchPositionId = playgroundBorderPositionsLeft.find(
              id => id === positionId
            );

            const searchNewPositionId = playgroundBorderPositionsRight.find(
              id => id === newFirstElementPosition
            );

            if (
              (searchPositionId && searchNewPositionId) |
              !newFirstElementPosition
            ) {
              if (
                gameSetting.actualDifficult === gameSetting.basicDifficults.Hard
              ) {
                return endGame();
              }
              newFirstElementPosition += gameSetting.playgroundSize;
            }
          }
          break;

        default:
          break;
      }

      const isCollision = snakePosition.findIndex(
        id => id === newFirstElementPosition
      );

      if (isCollision !== -1) {
        return endGame();
      }

      addSnakeClassToElement(newFirstElementPosition);

      newPositionIds = [...newPositionIds, newFirstElementPosition];
    }

    if (key === snakePosition.length - 1) {
      if (newPositionIds[0] === gameSetting.foodId) {
        removeFoodToPlayground();

        newPositionIds = [...newPositionIds, positionId];
      }

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
    actualDirectors = basicDirectors.left;
  }
};

const moveRight = () => {
  if (
    actualDirectors !== basicDirectors.left &&
    actualDirectors !== basicDirectors.right
  ) {
    actualDirectors = basicDirectors.right;
  }
};

const movetop = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.top
  ) {
    actualDirectors = basicDirectors.top;
  }
};

const moveDown = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.top
  ) {
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

function addFoodToPlayground(elementId) {
  const element = document.getElementById(elementId);

  element.insertAdjacentHTML('beforeend', `<div class="snake__food"></div>`);
}

const randomIdgenerator = () =>
  Math.floor(Math.random() * gameSetting.playgroundFullSize);

const generateFood = () => {
  let foodId;
  let isCorrectId;
  do {
    foodId = randomIdgenerator();
    isCorrectId = snakePosition.find(id => id === foodId);
  } while (isCorrectId);

  gameSetting.foodId = foodId;

  addFoodToPlayground(foodId);
};

const startBtn = document.querySelector('.settings__btn');

startBtn.addEventListener('click', startGame);
let autoMove = null;

const startAutoMove = () =>
  (autoMove = setInterval(
    () => moving(actualDirectors),
    gameSetting.gameSpeed
  ));

function startGame() {
  snakePosition = [];
  actualDirectors = gameSetting.defaultDirector;
  gameSetting.gameSpeed = 1000;
  gameSetting.points = 0;
  settings.classList.add('settings--hidden');

  playGround.innerHTML = '';
  gameSetting.actualDifficult = document.querySelector(
    'input[name=difficulty]:checked'
  ).value;
  const playgroundSize = document.querySelector(
    '.settings__playground-size-select'
  ).value;

  gameSetting.playgroundSize = parseInt(playgroundSize);

  basicDirectors = {
    ...basicDirectors,
    top: -playgroundSize,
    down: +playgroundSize,
  };

  const style = document.documentElement.style;
  style.setProperty('--rowNum', playgroundSize);
  style.setProperty('--colNum', playgroundSize);

  generatePlayground(playgroundSize);

  playGround.classList.remove('snake__playground--hidden');

  if (gameSetting.actualDifficult === gameSetting.basicDifficults.Medium) {
    playGround.classList.add('snake__playground--medium');
  }

  if (gameSetting.actualDifficult === gameSetting.basicDifficults.Hard) {
    playGround.classList.add('snake__playground--hard');
  }
  generateFood();
  document.addEventListener('keypress', detectKey);
  startAutoMove();
}

function removeFoodToPlayground() {
  const element = document.querySelector('.snake__food');
  element.remove();
  gameSetting.points += 10;
  generateFood();
  if (gameSetting.gameSpeed !== 100) {
    gameSetting.gameSpeed = gameSetting.gameSpeed - 50;
  }
  clearInterval(autoMove);
  startAutoMove();
}

function endGame() {
  alert('Game Over!\n Points: ' + gameSetting.points);
  playGround.classList.remove(
    'snake__playground--medium',
    'snake__playground--hard'
  );
  playGround.classList.add('snake__playground--hidden');
  clearInterval(autoMove);
  document.removeEventListener('keypress', detectKey);
  settings.classList.remove('settings--hidden');
}
