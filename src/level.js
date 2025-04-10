export class Level {
    constructor({ id, name, description, presetCode, validator }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.presetCode = presetCode;
        this.validator = validator; // fonction qui dit si le niveau est réussi
        this.completed = false;
    }



    isComplete(game) {
        return this.validator(game);
    }

    markAsCompleted() {
        this.completed = true;
    }
}
