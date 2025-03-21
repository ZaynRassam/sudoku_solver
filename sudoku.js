var sudoku = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]]


function tableCreate() {
  tbl = document.createElement('table');
  tbl.style.width = (cell_size*9).toString() + 'px';
  tbl.style.border = '4px solid black';

  for (let i = 0; i < 9; i++) {
    const tr = tbl.insertRow();
    for (let j = 0; j < 9; j++) {
        const td = tr.insertCell();
        td.style.border = "1px solid black"
        td.style.width = cell_size.toString() + "px";
        td.style.height = cell_size.toString() + "px";
        td.id = ((i*9)+j).toString()
        td.style.justifyContent = "center"
        td.style.textAlign = "center"
        td.style.fontSize = "30px"
        td.style.color = "#ff0000"
        // td.appendChild(document.createTextNode(td.id));
        // td.appendChild(document.createTextNode((sudoku[i][j]) != 0 ? sudoku[i][j].toString() : ''));
      }
    }
  document.getElementById("sudoku-parent").appendChild(tbl);
}

const cell_size = 60
tableCreate();
insertSudoku(sudoku)

function generateSudoku() {
    let grid = Array(9).fill().map(() => Array(9).fill(0));

    function isValidPlacement(row, col, num) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }

        // Check 3x3 box
        let boxRowStart = Math.floor(row / 3) * 3;
        let boxColStart = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRowStart + i][boxColStart + j] === num) return false;
            }
        }

        return true;
    }

    function fillGrid(row, col) {
        if (row === 9) {
            return true; // All rows are filled
        }

        if (col === 9) {
            return fillGrid(row + 1, 0); // Move to next row
        }

        if (grid[row][col] !== 0) {
            return fillGrid(row, col + 1); // Skip filled cells
        }

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        nums = nums.sort(() => Math.random() - 0.5); // Shuffle numbers

        for (let num of nums) {
            if (isValidPlacement(row, col, num)) {
                grid[row][col] = num;
                if (fillGrid(row, col + 1)) {
                    return true;
                }
                grid[row][col] = 0; // Backtrack
            }
        }

        return false; // Backtrack if no valid number was found
    }

    fillGrid(0, 0); // Fill grid with numbers

    // Create a puzzle by removing some numbers (set them to 0)
    let emptyCells = 60; // Define how many cells should be empty
    while (emptyCells > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        // Remove a number if it's not already zero
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            emptyCells--;
        }
    }

    return grid;
}

function insertSudoku(sudoku){
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          td = document.getElementById(((i * 9) + j).toString())
          td.appendChild(document.createTextNode((sudoku[i][j]) != 0 ? sudoku[i][j].toString() : ''));
      }
  }
}

function clearSudoku() {
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          td = document.getElementById(((i * 9) + j).toString())
          while (td.firstChild) {
              td.removeChild(td.lastChild)
          }
      }
  }
}

function solveSudokuRec(sudoku, row, col){
            // base case: Reached nth column of the last row
        if (row == 8 && col == 9)
            return true;

        // If last column of the row go to the next row
        if (col == 9) {
            row++;
            col = 0;
        }

        // If cell is already occupied then move forward
        if (sudoku[row][col] != 0)
            return solveSudokuRec(sudoku, row, col + 1);

        for (let num = 1; num <= 9; num++) {

            // If it is safe to place num at current position
            if (safeAll(row, col, sudoku, num)) {
                sudoku[row][col] = num;
                if (solveSudokuRec(sudoku, row, col + 1))
                    return true;
                sudoku[row][col] = 0;
            }
        }
        return false;
}

function solveSudoku(sudoko){
    clearSudoku();
    solveSudokuRec(sudoko, 0, 0)
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          td = document.getElementById(((i * 9) + j).toString())
          td.appendChild(document.createTextNode((sudoko[i][j]) != 0 ? sudoko[i][j].toString() : ''));
      }
  }
}

function safeRow(i, j, sudoku, value){
  for (let k = 0; k < 9; k++) {
      if (sudoku[i][k] == value && j != k){
          return false
      }
  }
  return true
}

function safeColumn(i, j, sudoku, value){
  for (let k = 0; k < 9; k++) {
      if (sudoku[k][j] == value && i != k){
          return false
      }
  }
  return true
}

function safeBox(i, j, sudoku, value){
  var top_left_box_i = find_top_left_of_box(i)
  var top_left_box_j = find_top_left_of_box(j)
  for (let k = top_left_box_i; k < top_left_box_i+3; k++) {
      for (let m = top_left_box_j; m < top_left_box_j+3; m++) {
          if (sudoku[k][m] == value && (i != k || j != m)){
              return false
          }
      }
  }
  return true
}

function safeAll(i,j,sudoku, value) {
    return true ? (safeRow(i, j, sudoku, value) && safeColumn(i, j, sudoku, value) && safeBox(i, j, sudoku, value)) : false
}


function find_top_left_of_box(index) {
    if (index < 3){
        return 0
    }
    if (index % 3 == 0){
        return index
    }
    else {
        return find_top_left_of_box(index-1)
    }
}

document.getElementById("clear").addEventListener("click", function(){
    sudoku = clearSudoku()
    insertSudoku(sudoku)
});
document.getElementById("new_sudoku").addEventListener("click", function(){
    sudoku = clearSudoku()
    sudoku = generateSudoku()
    insertSudoku(sudoku)
});
document.getElementById("solve").addEventListener("click", function(){
    solveSudoku(sudoku)
});