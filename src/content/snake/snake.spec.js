import { Snake } from './snake';

describe('Snake', () => {
    let snake;

    beforeEach(() => {
        const gridSize = { width: 10, height: 10 };
        const initialSnake = [
            { x: 5, y: 5 }
        ];
        snake = new Snake(gridSize, initialSnake);
    });

    describe('constructor', () => {
        it('should initialize the snake with correct properties', () => {
            expect(snake.gridSize).toEqual({ width: 10, height: 10 });
            expect(snake.body).toEqual([{ x: 5, y: 5 }]);
            expect(snake.direction).toEqual({ x: 0, y: 1 });
            expect(snake.length).toBe(1);
        });
    });

    describe('move', () => {
        it('should move the snake in the given direction', () => {
            const direction = { x: 1, y: 0 };
            const result = snake.move(direction);
            expect(result).toBe(true);
            expect(snake.body[0]).toEqual({ x: 6, y: 5 });
        });

        it('should grow the snake when grow is true', () => {
            const direction = { x: 1, y: 0 };
            snake.move(direction, true);
            expect(snake.body.length).toBe(2);
            expect(snake.length).toBe(2);
        });

        it('should not grow the snake when grow is false', () => {
            const direction = { x: 1, y: 0 };
            snake.move(direction);
            expect(snake.body.length).toBe(1);
        });

        it('should return false if the snake collides with a wall', () => {
            snake.body = [{ x: 9, y: 5 }];
            const direction = { x: 1, y: 0 };
            const result = snake.move(direction);
            expect(result).toBe(false);
        });

        it('should return false if the snake collides with itself', () => {
            snake.body = [
                { x: 5, y: 5 },
                { x: 5, y: 6 },
                { x: 6, y: 6 },
                { x: 6, y: 5 }
            ];
            snake.direction = { x: 1, y: 0 };
            const result = snake.move({ x: 1, y: 0 });
            expect(result).toBe(false);
        });
    });

    describe('checkCollision', () => {
        it('should detect collision with walls', () => {
            const newHead = { x: -1, y: 5 };
            expect(snake.checkCollision(newHead)).toBe(true);
        });

        it('should detect collision with itself', () => {
            snake.body = [
                { x: 5, y: 5 },
                { x: 5, y: 6 },
                { x: 6, y: 6 },
                { x: 6, y: 5 }
            ];
            const newHead = { x: 5, y: 6 };
            expect(snake.checkCollision(newHead)).toBe(true);
        });

        it('should not detect collision when there is none', () => {
            const newHead = { x: 6, y: 5 };
            expect(snake.checkCollision(newHead)).toBe(false);
        });
    });

    describe('getCharacterForSegment', () => {
        it('should return the head character for the first segment', () => {
            expect(snake.getCharacterForSegment(0)).toBe(snake.headCharacter);
        });

        it('should return the tail character for the last segment', () => {
            snake.body = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
            expect(snake.getCharacterForSegment(1)).toBe(snake.tailCharacter);
        });

        it('should return the body character for middle segments', () => {
            snake.body = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }];
            expect(snake.getCharacterForSegment(1)).toBe(snake.bodyCharacter);
        });
    });
});