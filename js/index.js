const getTetrominos = (gridWidth) => {
  //The Tetrominoes
  const lTetromino = [
    [1, gridWidth + 1, gridWidth * 2 + 1, 2],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2],
    [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2],
  ];

  const zTetromino = [
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
  ];

  const tTetromino = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
  ];

  const iTetromino = [
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
  ];

  return [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
};

const getRandom = length => {
  return Math.floor(Math.random() * length);
};

document.addEventListener('DOMContentLoaded', () =>{
  const gridWidth = 10;
  const gridHeight = 20;
  const gridSize = gridWidth * gridHeight;
  let currentRotation = 0;
  const grid = document.querySelector('.grid');
  grid.setAttribute(
    'style',
    `height: ${gridHeight * gridHeight}px; width: ${gridWidth * gridHeight}px;`
  );
  const previousGrid = document.querySelector('.previous-grid');
  const previousShape = document.querySelector('.previous-shape');
  previousGrid.setAttribute(
    'style',
    `height: ${gridHeight*4}px; width: ${gridHeight*4}px;`
  );
  previousShape.setAttribute(
    'style',
    `height: ${gridHeight*4}px; width: ${gridHeight*4}px;`
  );
  const scoreDisplay = document.querySelector('.score-display');
  const linesDisplay = document.querySelector('.lines-display');
  const startBtn = document.querySelector('button');
  let timerId;
  let score = 0;
  let lines = 0;
  const colors = [ 'blue', 'pink', 'navy', 'peach', 'yellow' ];
  
  const control = e => {
    if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 40) {
      moveDown();
    } 
  }
  document.addEventListener('keyup', control);

  const createGrid = (gridSize) => {
    for (let i = 0; i < gridSize; i += 1) {
      let div = document.createElement('div');
      div.setAttribute(
        'style',
        `height: ${gridHeight}px; width: ${gridHeight}px;background-repeat: round;`
      );
      if (i >= (gridSize - gridWidth)) {
        div.setAttribute('class', 'green-block');
      }
      grid.appendChild(div);
    }
    for (let i = 0; i < 16; i += 1) {
      let div = document.createElement('div');
      div.setAttribute(
        'style',
        `height: ${gridHeight}px; width: ${gridHeight}px;background-repeat: round;`
      );
      previousGrid.appendChild(div);
    }
  };
  createGrid(gridSize);
  let squares = Array.from(grid.querySelectorAll('div'));

  const tetrominos = getTetrominos(gridWidth);

  // Random
  let random = getRandom(tetrominos.length);
  let current = tetrominos[random][currentRotation];

  let currentPosition = 4;
  const draw = () => {
    current.forEach(index => {
      squares[currentPosition + index].classList.add(`${colors[random]}-block`)
    });
  };

  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove(`${colors[random]}-block`)
    });
  };

  const moveDown = () => {
    undraw();
    currentPosition = currentPosition + gridWidth;
    draw();
    freeze();
  };

  const moveRight = () => {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % gridWidth === gridWidth - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1;
    }
    draw();
  };

  const moveLeft = () => {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % gridWidth === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition += 1;
    }
    draw();
  };

  const rotate = () => {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = tetrominos[random][currentRotation];
    draw();
  };
  
  // Display
  const displayWidth = 4;
  const displayIndex = 0;
  let nextRandom = 0;
  const displaySquares = document.querySelectorAll('.previous-grid div');

  const smallTetrominos = getTetrominos(displayWidth).map((tetro) => tetro[0]);

  const displayShape = () => {
    displaySquares.forEach(square => {
      square.classList.remove(`${colors[random]}-block`);
    });
    smallTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add(`${colors[nextRandom]}-block`)
    });
  };

  const freeze = () => {
    if (current.some(index => 
      squares[currentPosition + index + gridWidth].classList.contains('green-block') || 
      squares[currentPosition + index + gridWidth].classList.contains('block2'))
    ) {
      current.forEach(index => squares[index + currentPosition].classList.add('block2'))
      random = nextRandom;
      nextRandom = getRandom(tetrominos.length);
      current = tetrominos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      gameOver();
      addScore();
    }
  };

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(() => {
        moveDown();
      }, 1000);
      nextRandom = getRandom(tetrominos.length);
      displayShape();
    }
  });

  const gameOver = () => {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  };

  const addScore = () => {
    for (currentIndex = 0; currentIndex < 199; currentIndex += gridWidth) {
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9];
      
      if (row.every(index => squares[index].classList.contains('block2'))) {
        score +=10;
        lines +=1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;

        row.forEach(index => {
          squares[index].classList.remove('block2') || squares[index].classList.remove(`${colors[random]}-block`)
        });
        // splice
        const squaresRemoved = squares.splice(currentIndex, gridWidth);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  };

});

