import { CHARACTERS } from '../../constants.js';

export class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.body = [{ x: 5, y: 5 }];
        this.direction = { x: 0, y: 1 };
        this.length = 1;
        this.headCharacter = CHARACTERS.HEAD;
        this.bodyCharacter = CHARACTERS.BODY;
        this.tailCharacter = CHARACTERS.TAIL;
    }
    
    move(direction, grow = false) {
        this.direction = direction;
        const newHead = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
    
        if (this.checkCollision(newHead)) {
            return false;
        }
    
        this.body.unshift(newHead);
        if (!grow && this.body.length > this.length) {
            this.body.pop();
        }
    
        if (grow) {
            this.length++;
        }
    
        return true;
    }

    checkCollision(newHead) {
        if (newHead.x < 0 || newHead.x >= this.gridSize.width || newHead.y < 0 || newHead.y >= this.gridSize.height) {
            return true;
        }
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === newHead.x && this.body[i].y === newHead.y) {
                return true;
            }
        }
        return false;
    }

    getCharacterForSegment(index) {
        if (index === 0) {
            return Snake.CHARACTERS.HEAD; // La tête
        } else if (index === this.body.length - 1) {
            return Snake.CHARACTERS.TAIL; // La queue
        } else {
            return Snake.CHARACTERS.BODY; // Le corps
        }
    }
}
