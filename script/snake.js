const playGround = document.querySelector('.snake__playground');
const difficult = document.querySelector('input[name=difficulty]:checked')
  .value;
const playGroundSize = document.querySelector(
  '.settings__playground-size-select'
).value;
console.log(difficult);
console.log(playGroundSize);

const basicDirectors = {
  up: -20,
  left: -1,
  down: 20,
  right: 1,
};

let actualDirectors = basicDirectors.left;

const START_POSITION = 190;
const START_SNAKE_LENGHT = 4;

let snakePosition = [];

function addSnakeClassToElement(elementId) {
  const snakeElement = document.getElementById(elementId);
  snakeElement.classList.add('snake__figure');
}

function removeSnakeClassToElement(elementId) {
  const snakeElement = document.getElementById(elementId);
  snakeElement.classList.remove('snake__figure');
}

function generateSnake() {
  for (let i = 0; i <= START_SNAKE_LENGHT; i++) {
    addSnakeClassToElement(START_POSITION + i);
    snakePosition = [...snakePosition, START_POSITION + i];
  }
}

function generatePlayground() {
  for (let i = 1; i <= 400; i++) {
    playGround.insertAdjacentHTML(
      'beforeend',
      `<div id=${i} class="snake__box">`
    );
  }
  generateSnake();
}

function moving(direct) {
  let newPositionIds = [];

  snakePosition.map((positionId, key) => {
    const FIRST_ARRAY_ELEMENT = 0;
    if (key === FIRST_ARRAY_ELEMENT) {
      const newFirstElementPosition = positionId + direct;
      addSnakeClassToElement(newFirstElementPosition);
      newPositionIds = [...newPositionIds, newFirstElementPosition];
      return (newPositionIds = [...newPositionIds, positionId]);
    }
    if (key === snakePosition.length - 1) {
      return removeSnakeClassToElement(positionId);
    }

    if (key !== 0) {
      return (newPositionIds = [...newPositionIds, positionId]);
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

const moveUp = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.up
  ) {
    moving(basicDirectors.up);
    actualDirectors = basicDirectors.up;
  }
};

const moveDown = () => {
  if (
    actualDirectors !== basicDirectors.down &&
    actualDirectors !== basicDirectors.up
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
      moveUp();
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

const autoMove = setInterval(() => moving(actualDirectors), 1000);

document.addEventListener('load', generatePlayground());
document.addEventListener('keypress', detectKey, false);
