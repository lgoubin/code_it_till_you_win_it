import { Snake } from './snake';

export class SnakeGame {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.snake = new Snake(gridSize);
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

    // Déplacer le serpent et vérifier si il mange une pomme
    moveSnake(direction) {
        const head = {
            x: this.snake.body[0].x + Snake.DIRECTIONS[direction].x,
            y: this.snake.body[0].y + Snake.DIRECTIONS[direction].y
        };
        
        const willEatApple = (head.x === this.apple.x && head.y === this.apple.y);
        
        if (!this.snake.move(Snake.DIRECTIONS[direction], willEatApple)) {
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
        let grid = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill('·'));

        // Affichage du serpent
        this.snake.body.forEach((segment, index) => {
            const char = index === 0 ? this.snake.headCharacter : index === this.snake.body.length - 1 ? this.snake.tailCharacter : this.snake.bodyCharacter;
            grid[segment.y][segment.x] = char;
        });

        // Affichage de la pomme
        grid[this.apple.y][this.apple.x] = '@';

        // Affichage de la grille avec bordures *
        let output = '';
        output += '*'.repeat(this.gridSize.width+2) + '\r\n';
        for (let row = 0; row < this.gridSize.height; row++) {
                output += '*' + grid[row].join('') + '*' + '\r\n';
        }
        output += '*'.repeat(this.gridSize.width+2) + '\r\n';

        return(output);
    }

    reset() {
        this.snake = new Snake(this.gridSize);
        this.apple = this.generateApple();
        this.score = 0;
    }
}

