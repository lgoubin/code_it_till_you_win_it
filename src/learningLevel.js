export class LearningLevel {
    constructor({ title, instructions, starterCode, validatorCode, stopCondition, gameConfig }, gameType) {
        this.title = title;
        this.instructions = instructions;
        this.starterCode = starterCode;
        this.validatorCode = validatorCode;
        this.stopCondition = stopCondition;
        this.gameType = gameType;
        this.gameConfig = gameConfig;
    }
}
