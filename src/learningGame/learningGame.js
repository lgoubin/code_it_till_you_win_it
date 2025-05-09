import { LearningLevel } from "../learningLevel/learningLevel";
import { GameFactory } from "../gameFactory";

export class LearningGame {
    constructor(config) {
        this.title = config.title;
        this.introduction = config.introduction;
        this.gameType = config.gameType;
        this.levels = config.levels.map(lvl => new LearningLevel(lvl, this.gameType));
        this.currentLevelIndex = 0;

        this.initLevel();
    }

    setDebugStartLevel(level) {
        this.currentLevelIndex = level;
        this.initLevel();
    }
    
    initLevel() {
        const learningLevel = this.currentLevel;
        this.game = GameFactory.create(learningLevel.gameType, learningLevel.gameConfig);
    }

    get currentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            this.initLevel();
        }
    }

    isFinished() {
        return this.currentLevelIndex >= this.levels.length - 1;
    }
}
