import { Snake } from './snake';
import { CHARACTERS } from './constants.js';
import { DIRECTIONS } from './constants.js';

export class SnakeGame {
    constructor(config) {
        this.name = "snake";
        this.gridSize = config.gridSize;
        this.initialSnake = config.initialSnake;
        this.snake = new Snake(this.gridSize, this.initialSnake);
        this.enableApple = config.enableApple;
        if (this.enableApple) {
            this.apple = this.generateApple();
        } else {
            this.apple = null;
        }
        this.score = 0;
        this.steps = 0;
        this.maxSteps = config.maxSteps;
        this.gameOver = false;
    }
    
    // Générer une pomme à une position aléatoire sur la grille et pas sur le serpent
    generateApple() {
        let apple;
        do {
            apple = {
                x: Math.floor(Math.random() * this.gridSize.width),
                y: Math.floor(Math.random() * this.gridSize.height)
            };
        } while (this.snake.body.some(segment => segment.x === apple.x && segment.y === apple.y));
        return apple;
    }
    
    reset() {
        this.snake = new Snake(this.gridSize, this.initialSnake);
        if (this.enableApple) 
            this.apple = this.generateApple();
        else 
            this.apple = null;
        this.score = 0;
        this.steps = 0;
    }
    
    async getNextDirection() {
        return await this.pyodide.runPythonAsync("nextMove()");
    }
    
    // Déplacer le serpent et vérifier si il mange une pomme
    moveSnake(direction) {
        const newHead = {
            x: this.snake.body[0].x + DIRECTIONS[direction].x,
            y: this.snake.body[0].y + DIRECTIONS[direction].y
        };
        
        const willEatApple = (newHead.x === this.apple?.x && newHead.y === this.apple?.y);

        if (!this.snake.move(DIRECTIONS[direction], willEatApple)) {
            this.gameOver = true;
            return false;
        }
        
        if(this.enableApple && willEatApple) {
            this.score++;
            this.apple = this.generateApple();
        }
        
        this.steps++;    
        return true;        
    }
    
    // Afficher le jeu dans le terminal
    render() {
        let grid = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill(CHARACTERS.EMPTY));
        
        // Affichage du serpent
        this.snake.body.forEach((segment, index) => {
            grid[segment.y][segment.x] = this.snake.getCharacterForSegment(index);
        });
        
        if (this.enableApple) {
            grid[this.apple.y][this.apple.x] = CHARACTERS.APPLE;
        }
        
        // Affichage de la grille avec bordures *
        let output = '\r\n\r\n';
        output += '    ' + CHARACTERS.WALL.repeat(this.gridSize.width+2) + '\r\n';
        for (let row = 0; row < this.gridSize.height; row++) {
            output += '    ' + CHARACTERS.WALL + grid[row].join('') + CHARACTERS.WALL + '\r\n';
        }
        output += '    ' + CHARACTERS.WALL.repeat(this.gridSize.width+2) + '\r\n';
        output += '\r\n';
        output += '    > Score : ' + this.score + '\r\n';
        
        return output;
    }
    
    getGameState() {
        return {
            gridSize: this.gridSize,
            snakeBody: this.snake.body,
            apple: this.apple,
        };
    }

    hasReachedMaxSteps() {
        return this.steps >= this.maxSteps;
    }

    
    shouldStop(stopCondition) {
        switch (stopCondition) {
            case "hasReachedMaxSteps":
                return this.hasReachedMaxSteps();

            case "ateApple":
                return this.snake.length > this.initialSnake.length;
            
            default:
                return false;
        }
    }
    
}

