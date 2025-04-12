import { SnakeGame } from './content/snake/snakeGame.js';

export class GameFactory {
    constructor() {}
    static create(gameType, config) {
        switch (gameType) {
            case 'SnakeGame':
                return new SnakeGame(config);
            default:
                throw new Error(`Unknown game type: ${gameType}`);
        }
    }
}