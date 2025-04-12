export class LearningLevel {
    constructor({ title, instructions, starterCode, validatorCode, gameConfig }, gameType) {
        this.title = title;
        this.instructions = instructions;
        this.starterCode = starterCode;
        this.validatorCode = validatorCode;
        this.gameType = gameType;
        this.gameConfig = gameConfig;
    }
}
