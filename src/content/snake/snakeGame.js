import { Snake } from './snake';
import { CHARACTERS } from '../../constants.js';
import { DIRECTIONS } from '../../constants.js';

export class SnakeGame {
    constructor(config) {
        this.gridSize = config.gridSize;
        this.initialSnake = config.initialSnake;
        this.snake = new Snake(this.initialSnake);
        this.apple = this.generateApple();
        this.score = 0;
    }
    
    // Générer une pomme à une position aléatoire sur la grille
    generateApple() {
        return {
            x: Math.floor(Math.random() * this.gridSize.width),
            y: Math.floor(Math.random() * this.gridSize.height)
        };
    }
    
    reset() {
        this.snake = new Snake(this.initialSnake);
        this.apple = this.generateApple();
        this.score = 0;
    }
    
    async getNextDirection() {
        return await this.pyodide.runPythonAsync("nextMove()");
    }
    
    // Déplacer le serpent et vérifier si il mange une pomme
    moveSnake(direction) {
        const head = {
            x: this.snake.body[0].x + DIRECTIONS[direction].x,
            y: this.snake.body[0].y + DIRECTIONS[direction].y
        };
        
        const willEatApple = (head.x === this.apple.x && head.y === this.apple.y);
        
        if (!this.snake.move(DIRECTIONS[direction], willEatApple)) {
            return false;
        }
        
        if (willEatApple) {
            this.score++;
            this.apple = this.generateApple();
        }
        
        return true;        
    }
    
    // Afficher le jeu dans le terminal
    render() {
        let grid = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill(CHARACTERS.EMPTY));
        
        // Affichage du serpent
        this.snake.body.forEach((segment, index) => {
            const char = index === 0 ? CHARACTERS.HEAD : index === this.snake.body.length - 1 ? CHARACTERS.TAIL : CHARACTERS.BODY;
            grid[segment.y][segment.x] = char;
        });
        
        // Affichage de la pomme
        grid[this.apple.y][this.apple.x] = CHARACTERS.APPLE;
        
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
            snake: this.snake.positions,
            apple: this.apple,
        };
    }
    
    shouldStop(stopCondition) {
        switch (stopCondition) {
            case "hasMoved":
                return this.snake.body[0].x !== this.initialSnake.x || this.snake.body[0].y !== this.initialSnake.y;

            case "ateApple":
                return this.snakeHead.x === this.apple.x && this.snakeHead.y === this.apple.y;
            
            case "maxSteps":
                return this.steps >= this.maxSteps;
            
            case "collision":
                return this.hasCollided();
            
            default:
                return false;
        }
    }
    
}

