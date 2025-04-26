import { runLevel } from './runLevel.js';
import { executePythonMoveLoop } from '../pyodideRunner.js';
import { updateTerminal, displayFeedback } from '../utils.js';

jest.mock('../pyodideRunner.js', () => ({
    executePythonMoveLoop: jest.fn(),
}));

jest.mock('../utils.js', () => ({
    updateTerminal: jest.fn(),
    displayFeedback: jest.fn(),
}));

describe('runLevel', () => {
    it('should execute the Python move loop and update the terminal', async () => {
        const context = {
            editor: { state: { doc: { toString: jest.fn().mockReturnValue('print("Hello")') } } },
            game: { 
                getGameState: jest.fn().mockReturnValue({}), 
                moveSnake: jest.fn() 
            },
            learningGame: { currentLevel: {} },
            terminal: {},
            ui: {},
        };
        const pyodideInstance = {};

        executePythonMoveLoop.mockImplementation(
            (pyodide, game, level, code, onDirection) => {
                onDirection('S'); // simulate movement
                return Promise.resolve({ success: true });
            }
        );

        await runLevel(context, pyodideInstance);

        expect(executePythonMoveLoop).toHaveBeenCalled();
        expect(context.game.moveSnake).toHaveBeenCalledWith('S');
        expect(updateTerminal).toHaveBeenCalled();
        expect(displayFeedback).toHaveBeenCalled();
    });
});
