import { SnakeGame } from './snakeGame';
import { CHARACTERS } from './constants.js';

describe('SnakeGame', () => {
    let game;
    const config = {
        gridSize: { width: 10, height: 10 },
        initialSnake: [{ x: 5, y: 5 }],
        maxSteps: 100,
    };

    beforeEach(() => {
        game = new SnakeGame(config);
    });

    describe('constructor', () => {
        it('should initialize the game with correct properties', () => {
            expect(game.name).toBe('snake');
            expect(game.gridSize).toEqual(config.gridSize);
            expect(game.initialSnake).toEqual(config.initialSnake);
            expect(game.snake).toBeDefined();
            expect(game.apple).toBeDefined();
            expect(game.score).toBe(0);
            expect(game.steps).toBe(0);
            expect(game.maxSteps).toBe(config.maxSteps);
            expect(game.hasCollided).toBe(false);
        });
    });

    describe('generateApple', () => {
        it('should generate an apple within the grid boundaries', () => {
            const apple = game.generateApple();
            expect(apple.x).toBeGreaterThanOrEqual(0);
            expect(apple.x).toBeLessThan(config.gridSize.width);
            expect(apple.y).toBeGreaterThanOrEqual(0);
            expect(apple.y).toBeLessThan(config.gridSize.height);
        });
    });

    describe('reset', () => {
        it('should reset the game state', () => {
            game.score = 10;
            game.steps = 50;
            game.reset();
            expect(game.score).toBe(0);
            expect(game.steps).toBe(0);
            expect(game.snake).toBeDefined();
            expect(game.apple).toBeDefined();
        });
    });

    describe('moveSnake', () => {
        it('should move the snake and increase steps', () => {
            const result = game.moveSnake('E');
            expect(result).toBe(true);
            expect(game.steps).toBe(1);
        });

        it('should increase score and generate a new apple when the snake eats an apple', () => {
            game.apple = { x: 6, y: 5 }; // Place apple in front of the snake
            game.snake.body = [{ x: 5, y: 5 }]; // Place snake in front of the apple
            const result = game.moveSnake('E');
            expect(result).toBe(true);
            expect(game.score).toBe(1);
            expect(game.apple).not.toEqual({ x: 6, y: 5 });
        });

        it('should set hasCollided to true if the snake collides with a wall', () => {
            game.snake.body = [{ x: 9, y: 5 }]; // Place snake at the edge
            const result = game.moveSnake('E');
            expect(result).toBe(false);
            expect(game.hasCollided).toBe(true);
        });

        it('should set hasCollided to true if the snake collides with itself', () => {
            game.snake.body = [
                { x: 5, y: 5 },
                { x: 5, y: 6 },
                { x: 6, y: 6 },
                { x: 6, y: 5 },
            ];
            const result = game.moveSnake('E');
            expect(result).toBe(false);
            expect(game.hasCollided).toBe(true);
        });
    });

    describe('render', () => {
        it('should render the game grid with the snake and apple', () => {
            const output = game.render();
            expect(output).toContain(CHARACTERS.HEAD);
            expect(output).toContain(CHARACTERS.APPLE);
            expect(output).toContain(CHARACTERS.WALL);
        });
    });

    describe('getGameState', () => {
        it('should return the current game state', () => {
            const state = game.getGameState();
            expect(state.gridSize).toEqual(config.gridSize);
            expect(state.apple).toBeDefined();
            expect(state.snakeBody).toBeDefined();
        });
    });

    describe('hasReachedMaxSteps', () => {
        it('should return true if steps exceed maxSteps', () => {
            game.steps = config.maxSteps;
            expect(game.hasReachedMaxSteps()).toBe(true);
        });

        it('should return false if steps are below maxSteps', () => {
            game.steps = config.maxSteps - 1;
            expect(game.hasReachedMaxSteps()).toBe(false);
        });
    });

    describe('shouldStop', () => {
        it('should stop if the max steps are reached', () => {
            game.steps = config.maxSteps;
            expect(game.shouldStop('hasReachedMaxSteps')).toBe(true);
        });

        it('should stop if the snake ate an apple', () => {
            game.snake.length = config.initialSnake.length + 1;
            expect(game.shouldStop('ateApple')).toBe(true);
        });

        it('should not stop for an unknown condition', () => {
            expect(game.shouldStop('unknownCondition')).toBe(false);
        });
    });
});