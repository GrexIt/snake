import React, { Component } from 'react';
import './App.css';

const GRID_LENGTH = 520;
const PIXEL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 7;
const GRID_SIZE = Math.floor(GRID_LENGTH/PIXEL_SIZE);
const SNAKE_X_INITIAL_POSITION = 0;
const SNAKE_Y_INITIAL_POSITION = parseInt(GRID_SIZE/2, 10);
const LIGHT_GREEN = '#9FD959';
const DARK_GREEN = '#84CC4C';
const BLUE = '#4F77F4';


const DIRECTION_MAP = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down'
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            snake: [],
            movingDirection: 'right',
            gameOver: false
        };
        this.initializeGrid();
    }

    // GRID_SIZE is the number of pixels in the grid
    // Our 2D matrix would be GRID_SIZE x GRID_SIZE
    initializeGrid() {
        for(let row=0;row< GRID_SIZE;row++){
            const temp_array = [];
            for(let col =0; col < GRID_SIZE; col++) {
                temp_array[col] = 0;
            }
            this.state.grid.push(temp_array);
        }
    }

    /**
    * Start the Game
    * Sets Inital position for snake, set moving direction to right
    * Sets interval of snake movement
    */
    startGame(){
      this.setInitialPostionForSnake();
      this.setState({gameOver: false, movingDirection: 'right'})
      this.snakeMovingInterval = setInterval(this.moveSnake.bind(this), 200);
    }

    /**
    * Ends the Game
    * Clears interval of snake movement
    */
    endGame() {
      alert("Game Over");
      if (this.snakeMovingInterval) {
        clearInterval(this.snakeMovingInterval);
      }
    }

    /**
    * Changes snake's direction
    * If new direction is same as current direction, do nothing
    * If new direction is opposite to current direction, do nothing
    */
    changeDirection(e) {
      const {keyCode} = e;
      const {movingDirection} = this.state;
      const newDirection = DIRECTION_MAP[keyCode];

      if (movingDirection === newDirection ||
          (['left', 'right'].indexOf(movingDirection) > -1 && ['left', 'right'].indexOf(newDirection) > -1) ||
          (['up', 'down'].indexOf(movingDirection) > -1 && ['up', 'down'].indexOf(newDirection) > -1)) {
          return;
      }

      this.setState({ movingDirection: DIRECTION_MAP[keyCode] });
    }

    /**
     * This function moves the snake in defined direction
     * The idea is to set the new head of the snake according to the defined direction
     * Then Remove the tail of the snake's old position
     * Finally joining the rest of the body with new head to set snake's new position
     */
    moveSnake() {
      if (this.state.gameOver) {
          this.endGame();
          return
      }
      var newSnake = [];
      const oldSnake = this.state.snake;
      switch (this.state.movingDirection) {
        case 'left':
          newSnake[0] = {ypos: oldSnake[0].ypos, xpos: oldSnake[0].xpos - 1};
          break;
        case 'right':
          newSnake[0] = {ypos: oldSnake[0].ypos, xpos: oldSnake[0].xpos + 1};
          break;
        case 'up':
          newSnake[0] = {ypos: oldSnake[0].ypos - 1, xpos: oldSnake[0].xpos};
          break;
        case 'down':
          newSnake[0] = {ypos: oldSnake[0].ypos + 1, xpos: oldSnake[0].xpos};
          break;
        default:
          break;
      }

      if (this.isInValid(newSnake[0]) || this.isOverlapping(newSnake[0], oldSnake)) {
        this.setState({gameOver: true});
        return
      }

      oldSnake.pop();
      newSnake.push(...oldSnake);

      this.setState({ snake: newSnake });
    }

    /**
     * Checks snake's new head for valid cell
     */
    isInValid(head) {
      return head.xpos === GRID_SIZE || head.ypos === -1 || head.xpos === -1 || head.ypos === GRID_SIZE
    }

    /**
     * Checks whether snake's new head overlaps with the body
     */
    isOverlapping(head, oldSnake) {
      return (
        oldSnake.filter(c => {
          return head.xpos === c.xpos && head.ypos === c.ypos
        }).length > 0
      );
    }

    /**
     * We are trying to set the initial position of snake in the mid section
     * After the setState Grid rerenders itself
     */
    setInitialPostionForSnake() {
        var snake = [];
        let  x = SNAKE_X_INITIAL_POSITION;
        for(let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i-- ) {
          snake.unshift({ypos: SNAKE_Y_INITIAL_POSITION, xpos: x++})
        }
        this.setState({ snake: snake });
    }

    /**
     * value 0 means snake is not present here
     * value 1 means snake is present in this pixel
     * value 2 means we are going to keep an apple here for snake's breakfast
     */
    renderPixel(value, colIndex, rowIndex) {
        let finalClass;
        if (value === 0) {
            finalClass = Object.assign({}, pixelStyle, lightGreenBackground)
            const sum = colIndex + rowIndex;
            // This is to make the grid like chess board
            if (sum%2 === 0) {
                finalClass = Object.assign({}, pixelStyle, darkGreenBackground)
            }
        }
        // This means snake is present in this pixel
        else if (value === 1) {
            finalClass = Object.assign({}, pixelStyle, blueBackground)
        }

        return <div style={finalClass}></div>;
    }

    renderRows(rowArray, colIndex) {
        return rowArray.map( (value, rowIndex) => {
            const key = "row_" + rowIndex;
            let snakeCell = this.state.snake.filter(c => c.xpos === rowIndex && c.ypos === colIndex);
            if(snakeCell.length > 0) {
              value = 1
            }
            return <div key={key} id={key}>
                {this.renderPixel(value, colIndex, rowIndex)}
            </div>;
        });
    }

    renderColumns() {
        return this.state.grid.map( (rowArray, colIndex) => {
            const key = "col_" + colIndex;
            return <div key={key} id={key} style={columnStyle}>
                {this.renderRows(rowArray, colIndex)}
            </div>;
        });
    }

    renderGrid(){
        return (
            <div style={parentStyle}>
                {this.renderColumns()}
            </div>
        );
    }

    render() {
        return (
          <div className="App" onKeyDown={this.changeDirection.bind(this)}>
            <h1>Snake @ Hiver</h1>
            <div style={topMostParent}>
                {this.renderGrid()}
            </div>

            <button style={buttonStyle} onClick={this.startGame.bind(this)}>Start Game</button>
          </div>
        );
    }
}

const topMostParent = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const parentStyle = {
    borderColor: "#f44336",
    border: '1px solid red',
    display: 'flex',
    flexDirection: 'column'
};

const columnStyle = {
    display: 'flex',
    flexDirection: 'row'
};

const darkGreenBackground = {
    backgroundColor: DARK_GREEN
}

const lightGreenBackground = {
    backgroundColor: LIGHT_GREEN
}

const blueBackground = {
    backgroundColor: BLUE
}

const pixelStyle = {
    width: PIXEL_SIZE,
    height: PIXEL_SIZE
};

const buttonStyle = {
  backgroundColor : '#f2f2f2',
  color: 'black',
  borderRadius: '3px',
  marginTop: '10px',
  padding: '4px',
  cursor: 'pointer'
}

export default App;
