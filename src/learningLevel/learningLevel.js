export class LearningLevel {
    constructor({ id, title, sousTitre, instructions, starterCode, hiddenCode,stopCondition, gameConfig, popup }, gameType) {
        this.id = id;
        this.title = title;
        this.sousTitre = sousTitre;
        this.instructions = instructions;
        this.starterCode = starterCode;
        this.hiddenCode = hiddenCode;
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
