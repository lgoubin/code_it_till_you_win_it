export class LearningGame {
    constructor(levels = []) {
        this.levels = levels;
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
