const getTetrominos = (blocksPerRow) => {
  //The Tetrominoes
  const lTetromino = [
    [1, blocksPerRow + 1, blocksPerRow * 2 + 1, 2],
    [blocksPerRow, blocksPerRow + 1, blocksPerRow + 2, blocksPerRow * 2 + 2],
    [1, blocksPerRow + 1, blocksPerRow * 2 + 1, blocksPerRow * 2],
    [blocksPerRow, blocksPerRow * 2, blocksPerRow * 2 + 1, blocksPerRow * 2 + 2],
  ];

  const zTetromino = [
    [0, blocksPerRow, blocksPerRow + 1, blocksPerRow * 2 + 1],
    [blocksPerRow + 1, blocksPerRow + 2, blocksPerRow * 2, blocksPerRow * 2 + 1],
    [0, blocksPerRow, blocksPerRow + 1, blocksPerRow * 2 + 1],
    [blocksPerRow + 1, blocksPerRow + 2, blocksPerRow * 2, blocksPerRow * 2 + 1],
  ];

  const tTetromino = [
    [1, blocksPerRow, blocksPerRow + 1, blocksPerRow + 2],
    [1, blocksPerRow + 1, blocksPerRow + 2, blocksPerRow * 2 + 1],
    [blocksPerRow, blocksPerRow + 1, blocksPerRow + 2, blocksPerRow * 2 + 1],
    [1, blocksPerRow, blocksPerRow + 1, blocksPerRow * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, blocksPerRow, blocksPerRow + 1],
    [0, 1, blocksPerRow, blocksPerRow + 1],
    [0, 1, blocksPerRow, blocksPerRow + 1],
    [0, 1, blocksPerRow, blocksPerRow + 1],
  ];

  const iTetromino = [
    [1, blocksPerRow + 1, blocksPerRow * 2 + 1, blocksPerRow * 3 + 1],
    [blocksPerRow, blocksPerRow + 1, blocksPerRow + 2, blocksPerRow + 3],
    [1, blocksPerRow + 1, blocksPerRow * 2 + 1, blocksPerRow * 3 + 1],
    [blocksPerRow, blocksPerRow + 1, blocksPerRow + 2, blocksPerRow + 3],
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

const createGrid = (grid, blocksPerRow) => {
  const {
    squareBlockSize,
    gridHeight,
    gridWidth,
    blocksPerColumn,
  } = getDimensiones();
  const squaresAmount = blocksPerRow * blocksPerColumn;
  for (let i = 0; i < squaresAmount; i += 1) {
    let div = document.createElement('div');
    div.setAttribute(
      'style',
      `height: ${squareBlockSize}px; width: ${squareBlockSize}px;background-repeat: round;`
    );
    if (i >= squaresAmount - blocksPerRow) {
      div.setAttribute('class', 'green-block');
    }
    grid.appendChild(div);
  }
  const previousGrid = document.querySelector('.previous-grid');
  const previousShape = document.querySelector('.previous-shape');
  for (let i = 0; i < 16; i += 1) {
    let div = document.createElement('div');
    div.setAttribute(
      'style',
      `height: ${squareBlockSize}px; width: ${squareBlockSize}px;background-repeat: round;`
    );
    previousGrid.appendChild(div);
  }
  grid.setAttribute(
    'style',
    `height: ${gridHeight}px; width: ${gridWidth}px;`
  );
  previousGrid.setAttribute(
    'style',
    `height: ${squareBlockSize * 4}px; width: ${squareBlockSize * 4}px;`
  );
  previousShape.setAttribute(
    'style',
    `height: ${squareBlockSize * 4}px; width: ${squareBlockSize * 4}px;`
  );
};

const getDimensiones = () => {
  const squareBlockSize = 20;
  const height = window.innerHeight;
  const gridHeight = Math.round(height / 100) * 100 - 200;
  const gridWidth = gridHeight / 2;
  const blocksPerColumn = gridHeight / squareBlockSize;
  return {
    squareBlockSize,
    gridHeight,
    gridWidth,
    blocksPerColumn,
  };
};

const setGrid = (grid) => {
  const { squareBlockSize, gridWidth, blocksPerColumn } = getDimensiones();
  const blocksPerRow = gridWidth / squareBlockSize;
  createGrid(grid, blocksPerRow);
  return { blocksPerRow, blocksPerColumn };
};

document.addEventListener('DOMContentLoaded', () =>{
  let currentRotation = 0;
  const grid = document.querySelector('.grid');
  const { blocksPerRow, blocksPerColumn } = setGrid(grid);
  const initTimeIntervalLevel = 1000;
  let currentLevel = 0;
    
  const scoreDisplay = document.querySelector('.score-display');
  const linesDisplay = document.querySelector('.lines-display');
  const levelDisplay = document.querySelector('.level-display');
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
  document.addEventListener('keydown', control);

  let squares = Array.from(grid.querySelectorAll('div'));

  const tetrominos = getTetrominos(blocksPerRow);

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
    currentPosition = currentPosition + blocksPerRow;
    draw();
    freeze();
  };

  const moveRight = () => {
    undraw();
    if (!isAtRightEdge()) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1;
    }
    draw();
  };

  const moveLeft = () => {
    undraw();
    if (!isAtLeftEdge()) currentPosition -= 1;
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
    while (isAtRightEdge() && isAtLeftEdge()) {
      currentPosition%10 === 9 ? currentPosition+=1 : currentPosition-= 1;
    }
    draw();
  };

  const isAtRightEdge = () => current.some(index => (currentPosition + index) % blocksPerRow === blocksPerRow - 1);
  const isAtLeftEdge = () => current.some(index => (currentPosition + index) % blocksPerRow === 0);
  
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

  const clearShape = () => {
    smallTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.remove(`${colors[nextRandom]}-block`)
    });
  };

  const freeze = () => {
    if (current.some(index => 
      squares[currentPosition + index + blocksPerRow].classList.contains('green-block') || 
      squares[currentPosition + index + blocksPerRow].classList.contains('block2'))
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

  const displayStartButton = () => {
    startBtn.classList.add('btn-danger');
    startBtn.classList.remove('btn-warning');
    startBtn.innerHTML = 'Start';
  };

  const displayPauseButton = () => {
    startBtn.classList.remove('btn-danger');
    startBtn.classList.add('btn-warning');
    startBtn.innerHTML = 'Pause';
  };

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      clearShape();
      displayStartButton();
    } else {
      currentLevel = 0;
      draw();
      timerId = setInterval(() => {
        moveDown();
      }, initTimeIntervalLevel);
      nextRandom = getRandom(tetrominos.length);
      displayShape();
      displayPauseButton();
    }
  });

  const increaseLevel = (level) => {
    if (timerId) {
      clearInterval(timerId);
    }
    const timeIntervalLevel = initTimeIntervalLevel / (level + 1);
    timerId = setInterval(() => {
      moveDown();
    }, timeIntervalLevel);
    console.log('level UP!', level)
    levelDisplay.innerHTML = level;
  }

  const gameOver = () => {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  };

  const addScore = () => {
    const keys = Array.from(Array(blocksPerRow).keys());
    for (currentIndex = 0; currentIndex < (blocksPerRow * blocksPerColumn) - 1; currentIndex += blocksPerRow) {
      const row = Array.from(keys.map(key => key + currentIndex));
      
      if (row.every(index => squares[index].classList.contains('block2'))) {
        score +=10;
        lines +=1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;

        row.forEach(index => {
          squares[index].classList.remove(...squares[index].classList)
        });
        // splice
        const squaresRemoved = squares.splice(currentIndex, blocksPerRow);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
        if (score % 50 === 0) {
          currentLevel = score / 50;
          increaseLevel(currentLevel);
        }
      }
    }
  };

});

