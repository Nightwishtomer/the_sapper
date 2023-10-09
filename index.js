class Game {

  constructor() {
    this.myCANVAS = document.getElementById("myCanvas"); // variable with myCanvas
    document.title = "Sapper JavaScript";
    this.mines = [];
    this.window = {
      clientX: 0,
      clientY: 0,
      height: 0,
      width: 0,
    };
    this.fiald = []; // Basic playing field
    this.settings = { // Basic game settings
      difficulty: "oldfag",
      numCell: 0,
      cellX: 0,
      cellY: 0,
      mines: 0,
      cellSize: 25,
      flags:0,
      moves: 0,
      boom: false,
      win:false,
    };
   
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.outputMinesHTML = document.getElementById("menu-mines"); // Min output
    this.outputStepsCountingHTML = document.getElementById("menu-steps"); // Steps output
    this.outputGameInfoHTML = document.getElementById("game-info"); // Game info
    


    this.image = { // Uploading pictures
      imge : document.getElementById("source_cell"),
      source_1 : document.getElementById("source_1"), 
      source_2 : document.getElementById("source_2"), 
      source_3 : document.getElementById("source_3"),
      source_4 : document.getElementById("source_4"),
      source_5 : document.getElementById("source_5"),
      source_6 : document.getElementById("source_6"),
      source_7 : document.getElementById("source_7"),
      source_8 : document.getElementById("source_8"),
      source_cell : document.getElementById("source_cell"),
      source_cell_active : document.getElementById("source_cell_active"),
      source_flag : document.getElementById("source_flag"),
      source_mine : document.getElementById("source_mine"),
      source_mine_active : document.getElementById("source_mine_active"),
    };
    

  }

  //Инициализация игры и начало
  start_game(menuCellY, menuCellX, menuMines, menutype) {
    this.initialization(menuCellY, menuCellX, menuMines, menutype); // write the field settings to an array with settings
    this.generationField(); // Generating the playing field
    this.mineGeneration(); // Laying mines on the field
    this.minesNighborCount();// Count neighboring cells min
    this.initInterface(); // Display the game interface
    this.drawField(); // Displaying the game field
    this.mouseEvent(); // Initialize the mouse operation. position, key press
  }

  // Write the field settings to an array with settings
  initialization(menuCellY, menuCellX, menuMines, menutype) {
    this.settings.cellY = menuCellY // Set the size of the Y field in the settings
    this.settings.cellX = menuCellX; // Set the size of the X field in the settings
    this.settings.mines = menuMines; // Record the number of mines in the settings
    this.settings.type = menutype; // Record the difficulty level of the game
    this.settings.difficulty = menutype; // Record the difficulty level of the game
  }

  //Generating the playing field
  generationField() { 
    let numCell = 0; // Cell counter
    for (let y = 0; y < this.settings.cellY; y++) { // Generate an array by Y
      this.fiald[y] = [];
      for (let x = 0; x < this.settings.cellX; x++) { // Generate an array by X
        this.fiald[y][x] = { // Cell array
          numCell: numCell, // Serial number
          numX: x, // Number by X
          numY: y, // number by Y
          mined: false, // Mine or not
          flag: false, // Is the flag worth it?
          nearby: 0, // Number of mines nearby
          pressed: false, // Whether the cell is open by the user
        };
        numCell++; // Cell counter increment
      }
    }
    this.settings.numCell = numCell; // Writes continuous numbering of cells into an array with settings
  }

  // Laying mines on the field
  mineGeneration() {
    if (this.mines.length < this.settings.mines) { // Recursive conditions when creating mines
      let rnd = this.randomIntFromInterval((this.settings.cellX * this.settings.cellY + 1) - 1); // Getting a random value
      if (!this.checkMineGeneration(rnd)) {
        this.mines.push(rnd); 
        this.setMineGeneration(rnd);
      }
      this.mineGeneration();
    }
    return;
  }

  // Generating random numbers from 0 to max
  randomIntFromInterval(max) { 
    return Math.floor(Math.random() * (max + 1));
  }

  // Checking if the mine is installed
  checkMineGeneration(num) {
    return (this.mines.includes(num)) ? true : false;
  }

  // Placing a mine in a cell
  setMineGeneration(cell) { 
    for (let y = 0; y < this.settings.cellY; y++) { // Generate an array by Y
      for (let x = 0; x < this.settings.cellX; x++) { // Generate an array by X
        if (this.fiald[y][x].numCell == cell) {
          this.fiald[y][x].mined = true; // Set a mine
        }
      }
    }
  }

  // Calculate cells for neighboring mines
  minesNighborCount() { 
    for (let y = 0; y < this.fiald.length; y++) { // Generate an array by Y
      for (let x = 0; x < this.fiald[y].length; x++) { // Generate an array by X
        if (this.fiald[y][x].mined == false) {
          let count = 0;
          if (((x-1) >= 0) && ((y-1) >= 0)){ if (this.fiald[y-1][x-1].mined == true) { count++; } }
          if ((y-1) >= 0){ if (this.fiald[y-1][x].mined == true) { count++; } }
          if (((y-1) >= 0) && ((x+1) < this.settings.cellX)){ if (this.fiald[y-1][x+1].mined == true) { count++; } }
          if ((x-1) >= 0){ if (this.fiald[y][x-1].mined == true) { count++; } }
          if ((x+1) < this.settings.cellX){ if (this.fiald[y][x+1].mined == true) { count++; } }
          if (((x-1) >= 0) && ((y+1) < this.settings.cellY)){ if (this.fiald[y+1][x-1].mined == true) { count++; } }
          if ((y+1) < this.settings.cellY){ if (this.fiald[y+1][x].mined == true) { count++; } }
          if (((x+1) < this.settings.cellX) && ((y+1) < this.settings.cellY)){ if (this.fiald[y+1][x+1].mined == true) { count++; } }
          this.fiald[y][x].nearby = count;
        }
      }
    }
  }

  // Application Appearance
  initInterface() { 
    this.window.height = this.settings.cellSize*this.settings.cellY;
    this.window.width = this.settings.cellSize*this.settings.cellX;
    this.canvas.style.height = this.window.height+ + "px";
    this.canvas.style.width = this.window.width + "px";
    this.resizeFeald(); // Resize the Canvas window, depending on the field size
    this.outputMines(); // Displaying the number of mines
    this.outputStepsCounting(); // Displaying the number of steps
  }

  // Adjusting the canvas size
  resizeFeald() { 
    let clientWidth  = this.canvas.clientWidth; // We get the width of the canvas buffer
    let clientHeight = this.canvas.clientHeight; // Get the height of the canvas buffer
    let displayWidth  = this.canvas.width; // Get the width of the HTML element
    let displayHeight = this.canvas.height; // Get the height of the HTML element
    if (displayWidth  != clientWidth || displayHeight != clientHeight) { // Checking if the canvas size is different
        // Adjust the rendering buffer size to the size of the HTML element
        this.canvas.width  = clientWidth; // Set new width
        this.canvas.height = clientHeight; // Set a new height
    }
  }

  // Output the number of mines in HTML
  outputMines() {
    this.outputMinesHTML.innerHTML = this.settings.mines;
  }

  // Displaying the number of player steps
  outputStepsCounting() { 
    this.outputStepsCountingHTML.innerHTML = this.settings.moves;
  }

  // Field rendering
  drawField(mines = false) { 
    for (let y = 0; y < this.settings.cellY; y++) { // Generate an array by Y
      for (let x = 0; x < this.settings.cellX; x++) { // Generate an array by X
        this.drawCell(y, x, mines);
      }
    }
  }

  // Rendering cells
  drawCell(y, x, mines = false) { 
    let type = "source_cell"; // If so, display the closed cell
    if (this.fiald[y][x].pressed) { // If the cell is pressed
      if (this.fiald[y][x].flag) { // Check for flag
        type = "source_flag"; // Display the flag
      } else {
        if (this.fiald[y][x].mined) {
          if (mines) {
            type = "source_mine_active"; // We bring out the mine
          } else {
            type = "source_mine"; // We bring out the mine
          }
        } else {
          if (this.fiald[y][x].nearby == 0) {
            type = "source_cell_active";
          } else if (this.fiald[y][x].nearby == 1) {
            type = "source_1";
          } else if (this.fiald[y][x].nearby == 2) {
            type = "source_2";
          } else if (this.fiald[y][x].nearby == 3) {
            type = "source_3";
          } else if (this.fiald[y][x].nearby == 4) {
            type = "source_4";
          } else if (this.fiald[y][x].nearby == 5) {
            type = "source_5";
          } else if (this.fiald[y][x].nearby == 6) {
            type = "source_6";
          } else if (this.fiald[y][x].nearby == 7) {
            type = "source_7";
          } else if (this.fiald[y][x].nearby == 8) {
            type = "source_8";
          }
        }
      }
    } else {
      if (this.fiald[y][x].mined) {
        if (mines) {
          type = "source_mine"; // We bring out the mine
        }
      }
    }
    this.ctx.drawImage(this.image[type], this.settings.cellSize*x, this.settings.cellSize*y, this.settings.cellSize, this.settings.cellSize);
  }

  // Initialize the mouse operation. position, key press
  mouseEvent() { 
    // Left button
    this.canvas.addEventListener('click', (event) => {
      if(!this.settings.boom || !this.settings.win){
        this.window.clientX = event.offsetX; // X coordinate relative to the element on which the event occurred
        this.window.clientY = event.offsetY; // Y coordinate relative to the element on which the event occurred
        this.buttonCell(this.cellSearch().x, this.cellSearch().y); // Left button.
        this.settings.moves++; // Step counting
        this.outputStepsCounting(); // Displaying the number of steps in HTML
        this.outputMines(); // Output the number of mines in HTML
        this.winCheck();
      }
    });
    // Right button
    document.oncontextmenu = function (){return false};
    this.canvas.addEventListener('contextmenu', (event) => {
      if(!this.settings.boom || !this.settings.win){
        this.window.clientX = event.offsetX; // X coordinate relative to the element on which the event occurred
        this.window.clientY = event.offsetY; // Y coordinate relative to the element on which the event occurred
        this.buttonFlag(this.cellSearch()); // Right button
        this.settings.moves++; // Step counting
        this.outputStepsCounting(); // Displaying the number of steps in HTML
        this.outputMines(); // Output the number of mines in HTML
      }
    });
  }

  // Returns the cell number after a button is pressed
  cellSearch(){ 
    return {x : Math.floor(this.window.clientX/this.settings.cellSize), y : Math.floor(this.window.clientY/this.settings.cellSize)}; 
  }

  // Setting the flag
  buttonFlag({x = null , y = null}) { 
    if (x != null || y != null) { 
      if (this.fiald[y][x].pressed  == this.fiald[y][x].flag ) {
        this.setCellPressed(x, y);
        this.setCellFlag(x, y);
        this.drawField(); // Redrawing the field
      }
    }
  }

  // Setting the value of pressing
  setCellPressed(x, y) {
    this.fiald[y][x].pressed = !this.fiald[y][x].pressed;
  }
  
  // Installing and removing the flag
  setCellFlag(x, y) { 
    this.fiald[y][x].flag = !this.fiald[y][x].flag;
    if (this.fiald[y][x].flag) {
      this.settings.flags--;
    } else {
      this.settings.flags++; 
    }
  }

  // Open cell, left button
  buttonCell(x = null, y = null) {
    if (x != null || y != null) { // If cell numbers
      if (!this.fiald[y][x].pressed && !this.fiald[y][x].flag ) { // If there is no flag on the cell and it is not pressed
        if (!this.fiald[y][x].mined) {
          if (this.fiald[y][x].nearby > 0) {
            this.setCellValue(x, y, "pressed"); // Setting a cell to pressed
          } else {
            let cell_2, cell_4, cell_6, cell_8 = false;
            // 2
            if ((y-1) >= 0){  // Outer cell condition
              if (!this.fiald[y-1][x].mined) { // If the cell is not a mine
                if (this.fiald[y-1][x].nearby == 0) { // If there is no neighborhood, we move recursively
                  cell_2 = true;
                  this.buttonCell(x, y-1);
                }
                this.setCellValue(x, y-1, "pressed"); // Setting a cell to pressed
              }
            }

            // 4
            if ((x-1) >= 0){  // Outer cell condition
              if (!this.fiald[y][x-1].mined) { // If the cell is not a mine
                if (this.fiald[y][x-1].nearby == 0) { // If there is no neighborhood, we move recursively
                  cell_4 = true;
                  this.buttonCell(x-1, y);
                }
                this.setCellValue(x-1, y, "pressed"); // Setting a cell to pressed  
              }
            }

            // 5
            this.setCellValue(x, y, "pressed"); // Setting a cell to pressed

            // 6
            if ((x+1) < this.settings.cellX){  // Outer cell condition
            if (!this.fiald[y][x+1].mined) { // If the cell is not a mine
                if (this.fiald[y][x+1].nearby == 0) { // If there is no neighborhood, we move recursively
                  cell_6 = true;
                  this.buttonCell(x+1, y);
                }
                this.setCellValue(x+1, y, "pressed"); // Setting a cell to pressed
              }
            }

            // 8
            if ((y+1) < this.settings.cellY){  // Outer cell condition
              if (!this.fiald[y+1][x].mined) { // If the cell is not a mine
                if (this.fiald[y+1][x].nearby == 0) { // If there is no neighborhood, we move recursively
                  cell_8 = true;
                  this.buttonCell(x, y+1);
                }
                this.setCellValue(x, y+1, "pressed"); // Setting a cell to pressed
              }
            }

            // 1
            if (cell_2 && cell_4){
              if (((x-1) >= 0) && ((y-1) >= 0)){  // Outer cell condition
                if (!this.fiald[y-1][x-1].mined) { // If the cell is not a mine
                  if (this.fiald[y-1][x-1].nearby == 0) { // If there is no neighborhood, we move recursively
                    this.buttonCell(x-1, y-1);
                  }
                  this.setCellValue(x-1, y-1, "pressed"); // Setting a cell to pressed   
                }
              }
            }

            // 3
            if (cell_2 && cell_6){
              if (((y-1) >= 0) && ((x+1) < this.settings.cellX)){  // Outer cell condition
                if (!this.fiald[y-1][x+1].mined) { // If the cell is not a mine
                  if (this.fiald[y-1][x+1].nearby == 0) { // If there is no neighborhood, we move recursively
                    this.buttonCell(x+1, y-1);
                  }
                  this.setCellValue(x+1, y-1, "pressed"); // Setting a cell to pressed
                }
              }
            }

            // 7
            if (cell_4 && cell_8){
              if (((x-1) >= 0) && ((y+1) < this.settings.cellY)){  // Outer cell condition
                if (!this.fiald[y+1][x-1].mined) { // If the cell is not a mine
                  if (this.fiald[y+1][x-1].nearby == 0) { // If there is no neighborhood, we move recursively
                    this.buttonCell(x-1, y+1);
                  }
                  this.setCellValue(x-1, y+1, "pressed"); // Setting a cell to pressed
                }
              }
            }

            // 9
            if (cell_6 && cell_8){
              if (((x+1) < this.settings.cellX) && ((y+1) < this.settings.cellY)){ // Outer cell condition 
                if (!this.fiald[y+1][x+1].mined) { // If the cell is not a mine
                  if (this.fiald[y+1][x+1].nearby == 0) { // If there is no neighborhood, we move recursively
                    this.buttonCell(x+1, y+1);
                  }
                  this.setCellValue(x+1, y+1, "pressed"); // Setting a cell to pressed
                }
              }
            }
          }
          this.drawField(); // Redrawing the field 
        } else {
          this.setCellValue(x, y, "pressed"); // Setting a cell to pressed
          this.drawCell(y, x); // Explosion of mines
          this.messageGameInfo("boom"); // Displaying a loss message
          this.drawField(true); // Redrawing the field 
        }
        
      }
    }
  }

  // Setting cell values
  setCellValue(x, y, value = null) { 
    if (value != null) {
      if (!this.fiald[y][x].pressed) {
        this.fiald[y][x][value] = !this.fiald[y][x][value];
      } 
    }
  }

  // Walk across the field
  winCheck() { 
    let result = false;
    for (let y = 0; y < this.settings.cellY; y++) { // Go along Y
      for (let x = 0; x < this.settings.cellX; x++) { // Go along X
        if (!this.fiald[y][x].mined) {
          if (this.fiald[y][x].pressed) {
            result = true;
          } else {
            return false;
          }
        }
      }
    }
    this.messageGameInfo("win"); // Displaying a message about winnings
    return result;
  }

  // Displaying a message about winning or losing
  messageGameInfo(message = null) {
    // Winning
    if (message == "win") {
      this.settings.win = true;
      this.outputGameInfoHTML.innerHTML = "YOU WIN!";
    }
    // Losing
    if (message == "boom") {
      this.settings.boom = true;
      this.outputGameInfoHTML.innerHTML = "BOOM!";
    }
    // Empty message
    if (message == null) {
        this.settings.win = false;
        this.settings.boom = false;
        this.outputGameInfoHTML.innerHTML = "";
    }
  }

}