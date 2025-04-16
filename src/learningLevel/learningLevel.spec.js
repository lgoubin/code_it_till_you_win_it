import { LearningLevel } from "./learningLevel";

describe("LearningLevel", () => {
    let level;
    const config = {
        "id": 1,
        "title": "Test level",
        "instructions": "Test instructions",
        "starterCode": "Test starter code",
        "gameConfig": {
            "gridSize": { "width": 20, "height": 10 },
            "initialSnake": [{ "x": 5, "y": 5 }],
            "maxSteps": 1
        },
        "stopCondition": 'Test stop condition',
        "popup": "Message pop up"
    };
    const gameType = 'snake';
    
    beforeEach(() => {
        level = new LearningLevel(config, gameType);
    });

    describe('constructor', () => {
        it('should initialize the learningLevel with correct properties', () => {
            expect(level.id).toBe(1);
            expect(level.title).toBe("Test level");
            expect(level.instructions).toBe("Test instructions");
            expect(level.starterCode).toBe("Test starter code");
            expect(level.gameConfig).toEqual({
                gridSize: { width: 20, height: 10 },
                initialSnake: [{ x: 5, y: 5 }],
                maxSteps: 1
            });
            expect(level.stopCondition).toBe('Test stop condition');
            expect(level.messagePopup).toBe("Message pop up");
            expect(level.gameType).toBe(gameType);
            expect(level.succeded).toBe(false);
        });
    });
    describe('markAsSucceeded', () => {
        it('should mark the level as succeeded', () => {
            level.markAsSucceeded();
            expect(level.succeded).toBe(true);
        });
    });
    describe('isSucceeded', () => {
        it('should return the correct succeeded status', () => {
            expect(level.isSucceeded()).toBe(false);
            level.markAsSucceeded();
            expect(level.isSucceeded()).toBe(true);
        });
    });
});