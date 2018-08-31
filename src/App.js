import React, { Component } from 'react';
import './App.css';

const GRID_LENGTH = 520;
const PIXEL_SIZE = 40;
const INITIAL_SNAKE_LENGTH = 4;
const GRID_SIZE = GRID_LENGTH/PIXEL_SIZE;
const SNAKE_X_INITIAL_POSITION = 0;
const SNAKE_Y_INITIAL_POSITION = parseInt(GRID_SIZE/2);
const LIGHT_GREEN = '#9FD959';
const DARK_GREEN = '#84CC4C';
const BLUE = '#4F77F4';

class App extends Component {

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

    // movingDirection can be left, right, up and down
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            head: { ypos: null, xpos: null },
            tail: { ypos: null, xpos: null },
            movingDirection: 'right',
            deltaLeftOnDirectionChange: null,
            snakeLength: INITIAL_SNAKE_LENGTH
        };
        this.initializeGrid();
    }

    componentDidMount() {
        const that = this;
        this.setInitialPostionForSnake();
        setInterval(this.moveSnake.bind(this), 500);
        window.onkeyup = function(e) {
            that.changeDirection(e.keyCode);
        };
    }

    changeDirection(keyCode) {
        let newDirection;
        if(keyCode === 38) {
            newDirection = 'up';
        }
        if(keyCode === 40) {
            newDirection = 'down';
        }
        if(keyCode === 39) {
            newDirection = 'right';
        }
        if(keyCode === 37) {
            newDirection = 'left';
        }
        const { snakeLength } = this.state;
        this.setState({ movingDirection: newDirection, deltaLeftOnDirectionChange:  snakeLength});
    }

    moveTailUpwards() {
        const grid = this.state.grid;
        console.log(this.state.tail);
        grid[this.state.tail.ypos][this.state.tail.xpos-1] = 0;
        const newtail = {ypos: this.state.tail.ypos -1, xpos: this.state.tail.xpos };
        this.setState({ grid, tail: newtail });
    }

    moveTailToRight() {
        const grid = this.state.grid;
        grid[this.state.tail.ypos][this.state.tail.xpos] = 0;
        const newtail = {ypos: this.state.tail.ypos, xpos: this.state.tail.xpos + 1};
        this.setState({ grid, tail: newtail });
    }

    moveHeadToRight() {
        const grid = this.state.grid;
        grid[this.state.head.ypos][this.state.head.xpos + 1] = 1;
        const newhead = {ypos: this.state.head.ypos, xpos: this.state.head.xpos + 1};
        this.setState({ grid, head: newhead });
    }

    moveHeadToUp() {
        const grid = this.state.grid;
        grid[this.state.head.ypos -1 ][this.state.head.xpos] = 1;
        const newhead = {ypos: this.state.head.ypos -1, xpos: this.state.head.xpos};
        this.setState({ grid, head: newhead });
    }

    moveTowardsRight() {
        if (this.state.head.xpos === GRID_SIZE-1) {
            console.log('game over');
            return;
        }
        this.moveHeadToRight();
        this.moveTailToRight();
    }

    moveTowardsUp() {
        if (this.state.head.ypos === 0) {
            console.log('game over');
            return;
        }
        this.moveHeadToUp();
        const { deltaLeftOnDirectionChange } = this.state;
        if(deltaLeftOnDirectionChange > 0) {
            this.moveTailToRight();
            this.setState({ deltaLeftOnDirectionChange : deltaLeftOnDirectionChange -1 });
            return;
        }
        this.moveTailUpwards();
    }

    moveSnake() {
        if(!this.state.movingDirection) {
            // Direction is not yet set
            return;
        }
        if(this.state.movingDirection === 'right') {
            this.moveTowardsRight();
        }
        if(this.state.movingDirection === 'up') {
            this.moveTowardsUp();
        }
    }

    setInitialPostionForSnake() {
        const grid = this.state.grid;
        for(let idx = 0; idx < INITIAL_SNAKE_LENGTH; idx++) {
            const xpos = SNAKE_X_INITIAL_POSITION + idx;
            grid[SNAKE_Y_INITIAL_POSITION][xpos] = 1;
        }
        const xpos = SNAKE_X_INITIAL_POSITION + INITIAL_SNAKE_LENGTH -1;
        const ypos = SNAKE_Y_INITIAL_POSITION;
        const head = { ypos, xpos };
        const tail = { ypos, xpos: SNAKE_X_INITIAL_POSITION };
        this.setState({ grid, head, tail });
    }

    renderPixel(value, colIndex, rowIndex) {
        let finalClass;
        if (value === 0) {
            finalClass = Object.assign({}, pixelStyle, lightGreenBackground)
            const sum = colIndex + rowIndex;
            if (sum%2 === 0) {
                finalClass = Object.assign({}, pixelStyle, darkGreenBackground)
            }
        }
        else if (value === 1) {
            finalClass = Object.assign({}, pixelStyle, blueBackground)
        }

        return <div style={finalClass}></div>;
    }

    renderRows(rowArray, colIndex) {
        const that = this;
        return rowArray.map(function(value, rowIndex) {
            const key = "row_" + rowIndex;
            return <div key={key} id={key}>
                {that.renderPixel(value, colIndex, rowIndex)}
            </div>;
        });
    }

    renderColumns() {
        const that = this;
        return this.state.grid.map(function(rowArray, colIndex){
            const key = "col_" + colIndex;
            return <div key={key} id={key} style={columnStyle}>
                {that.renderRows(rowArray, colIndex)}
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
          <div className="App">
            <h1>Snake @ Hiver</h1>
            <div style={topMostParent}>
                {this.renderGrid()}
            </div>
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

export default App;
