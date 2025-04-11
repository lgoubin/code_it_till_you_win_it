import { Level } from "./level";
import { SnakeGame } from "./snakeGame";

export class LearningGame {
    constructor(data) {
        this.title = data.title;
        this.introduction = data.introduction;
        switch (data.gameClass) {
            case 'SnakeGame':
                this.game = new SnakeGame({ width: 20, height: 10 });
                break;
            default:
                break;
        }
        const levels = data.levels;
        this.levels = levels.map(level => new Level(level));
        this.currentLevelIndex = 0;
    }

    get currentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
        }
    }

    reset() {
        this.currentLevelIndex = 0;
    }

    isFinished() {
        return this.currentLevelIndex >= this.levels.length - 1;
    }
}
