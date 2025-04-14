export class LearningLevel {
    constructor({ id, title, instructions, starterCode, validatorCode, stopCondition, gameConfig, popup }, gameType) {
        this.id = id;
        this.title = title;
        this.instructions = instructions;
        this.starterCode = starterCode;
        this.validatorCode = validatorCode;
        this.stopCondition = stopCondition;
        this.gameType = gameType;
        this.gameConfig = gameConfig;
        this.messagePopup = popup;
        this.succeded = false;
    }

    markAsSucceeded() {
        this.succeded = true;
    }

    isSucceeded() {
        return this.succeded;
    }
}
