import { LearningGame } from "./learningGame";
import { GameFactory } from '../gameFactory';
import { LearningLevel } from '../learningLevel/learningLevel';

jest.mock('../gameFactory');

describe("LearningGame", () => {
    let learningGame;

    const testData = {
        title: "Test Game",
        introduction: "Test introduction",
        gameType: "test",
        levels: [
            {
                id: 1,
                title: "Test Level 1",
                instructions: "Test instructions",
                starterCode: "Test starter code",
                gameConfig: {
                    gridSize: { width: 20, height: 10 },
                    initialSnake: [{ x: 5, y: 5 }],
                    maxSteps: 1
                },
                stopCondition: 'Test stop condition',
                popup: "Message pop up"
            },
            {
                id: 2,
                title: "Test Level 2",
                instructions: "Test instructions",
                starterCode: "Test starter code",
                gameConfig: {
                    gridSize: { width: 20, height: 10 },
                    initialSnake: [{ x: 5, y: 5 }],
                    maxSteps: 1
                },
                stopCondition: 'Test stop condition',
                popup: "Message pop up"
            }
        ]
    };
    beforeEach(() => {
        learningGame = new LearningGame(testData);
        GameFactory.create.mockImplementation(() => {
            return {};
        });
    });
    describe('constructor', () => {
        it('should initialize the learningGame with correct properties', () => {
            expect(learningGame.title).toBe("Test Game");
            expect(learningGame.introduction).toBe("Test introduction");
            expect(learningGame.gameType).toBe("test");
            expect(learningGame.levels.length).toBe(2);
            expect(learningGame.currentLevelIndex).toBe(0);
            
        });
        it('should call initLevel when initializing the learningGame', () => {  
            const initLevelSpy = jest.spyOn(LearningGame.prototype, 'initLevel');
            const learningGame = new LearningGame(testData);
            expect(initLevelSpy).toHaveBeenCalled();
        });    
    });
    describe('initLevel', () => {
        it('should initialize the current level', () => {
            const learningLevel = learningGame.currentLevel;
            expect(GameFactory.create).toHaveBeenCalledWith(
                learningLevel.gameType,
                learningLevel.gameConfig
            );
            expect(learningGame.game).toBeDefined();
        });
    });
    describe('nextLevel', () => {
        it('should increment the current level index and initialize the next level', () => {
            const initLevelSpy = jest.spyOn(learningGame, 'initLevel'); 
            learningGame.nextLevel();
            expect(learningGame.currentLevelIndex).toBe(1);
            expect(initLevelSpy).toHaveBeenCalled();
        });

        it('should not increment the current level index if already at the last level', () => {
            learningGame.currentLevelIndex = 1;
            learningGame.nextLevel();
            expect(learningGame.currentLevelIndex).toBe(1);
        });
    });
    describe('isFinished', () => {
        it('should return true if the game is finished', () => {
            learningGame.currentLevelIndex = 1;
            expect(learningGame.isFinished()).toBe(true);
        });

        it('should return false if the game is not finished', () => {
            learningGame.currentLevelIndex = 0;
            expect(learningGame.isFinished()).toBe(false);
        });
    });
});