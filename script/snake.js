const playGround = document.querySelector('.snake__playground');
const settings = document.querySelector('.settings');

let basicDirectors = {
  up: 0,
  left: -1,
  down: 0,
  right: 1,
};

let actualDirectors = basicDirectors.left;

const START_SNAKE_LENGHT = 4;

let snakePosition = [];
let playgroundBorderPositions = [];

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
    if (
      i <= size ||
      i > playGroundSize - size ||
      lastIterationChar === '1' ||
      lastIterationChar === '0'
    ) {
      playgroundBorderPositions = [...playgroundBorderPositions, i];
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

const startBtn = document.querySelector('.settings__btn');

startBtn.addEventListener('click', startGame);

function startGame() {
  settings.classList.add('settings--hidden');

  playGround.innerHTML = '';
  const difficult = document.querySelector('input[name=difficulty]:checked')
    .value;
  const playGroundSize = document.querySelector(
    '.settings__playground-size-select'
  ).value;
  basicDirectors = {
    ...basicDirectors,
    up: -playGroundSize,
    down: +playGroundSize,
  };

  const style = document.documentElement.style;
  style.setProperty('--rowNum', playGroundSize);
  style.setProperty('--colNum', playGroundSize);

  generatePlayground(playGroundSize);
  console.log(playgroundBorderPositions);

  playGround.classList.remove('snake__playground--hidden');

  if (difficult == 2) {
    playGround.classList.add('snake__playground--medium');
  }
  if (difficult == 3) {
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
