import { resizeTerminal, updateGameDisplay, resetGameContainer, displayFeedback, updateTerminal, switchElementVisibility } from './utils.js';

describe('Utility Functions', () => {
    describe('resizeTerminal', () => {
        it('should resize the terminal based on container dimensions', () => {
            const terminal = { resize: jest.fn() };
            const container = { offsetWidth: 500, offsetHeight: 300 };
            
            resizeTerminal(terminal, container);
            
            expect(terminal.resize).toHaveBeenCalledWith(
                Math.floor((500 - 20) / 9), // cols
                Math.floor((300 - 20) / 24) // rows
            );
        });
    });
    describe('updateGameDisplay', () => {
        it('should update the UI with the current level details', () => {
            const context = {
                ui: {
                    levelTitle: { textContent: '' },
                    levelObjective: { textContent: '' },
                    levelInstructions: { textContent: '' },
                },
                learningGame: {
                    currentLevel: {
                        title: 'Level 1',
                        sousTitre: 'Objective of the level',
                        instructions: 'Do this task',
                    },
                },
            };

            updateGameDisplay(context);

            expect(context.ui.levelTitle.textContent).toBe('Level 1');
            expect(context.ui.levelObjective.textContent).toBe('Objective of the level');
            expect(context.ui.levelInstructions.textContent).toBe('Do this task');
        });
    });
    describe('resetGameContainer', () => {
        it('should reset the game and update the UI', () => {
            const context = {
                game: { reset: jest.fn(), render: jest.fn() },
                learningGame: {
                    currentLevel: { starterCode: 'print("Hello")', title: 'Level 1', instructions: 'Do this task' },
                },
                ui: { editorContainer: {}, levelTitle: {}, levelObjective: {}, levelInstructions: {} },
                editor: { setState: jest.fn() },
                terminal: {clear: jest.fn(), write: jest.fn() }
            };
    
            resetGameContainer(context);
    
            expect(context.game.reset).toHaveBeenCalled();
            expect(context.editor.setState).toHaveBeenCalled();
        });
    });
    describe('updateTerminal', () => {
        it('should clear the terminal and write the game render output', () => {
            const terminal = { clear: jest.fn(), write: jest.fn() };
            const game = { render: jest.fn().mockReturnValue('Game Rendered') };
    
            updateTerminal(terminal, game);
    
            expect(terminal.clear).toHaveBeenCalled();
            expect(terminal.write).toHaveBeenCalledWith('Game Rendered');
        });
    });
    describe('switchElementVisibility', () => {
        it('should switch visibility between two elements', () => {
            const previousElement = { classList: { remove: jest.fn(), add: jest.fn() } };
            const nextElement = { classList: { remove: jest.fn(), add: jest.fn() } };

            switchElementVisibility(previousElement, nextElement);

            expect(previousElement.classList.remove).toHaveBeenCalledWith('shown');
            expect(previousElement.classList.add).toHaveBeenCalledWith('hidden');
            expect(nextElement.classList.remove).toHaveBeenCalledWith('hidden');
            expect(nextElement.classList.add).toHaveBeenCalledWith('shown');
        });
    });
    describe('displayFeedback', () => {
        it('should display success feedback when result is successful', () => {
            const ui = {
                feedbackPopup: {
                    querySelector: jest.fn().mockImplementation((selector) => {
                        return { textContent: '' };
                    }),
                    style: { display: '' }
                },
            };
            const level = { messagePopup: 'Great job!', markAsSucceeded: jest.fn() };
            const result = { success: true };
    
            displayFeedback(ui, level, result);
    
            expect(ui.feedbackPopup.querySelector).toHaveBeenCalledWith('h2');
            expect(ui.feedbackPopup.querySelector).toHaveBeenCalledWith('p');
            expect(ui.feedbackPopup.style.display).toBe('flex');
            expect(level.markAsSucceeded).toHaveBeenCalled();
        });
    
        it('should display failure feedback when result is not successful', () => {
            const ui = {
                feedbackPopup: {
                    querySelector: jest.fn().mockImplementation((selector) => {
                        return { textContent: '' };
                    }),
                    style: { display: '' }
                },
            };
            const level = {};
            const result = { success: false, failures: 'Try again!' };
    
            displayFeedback(ui, level, result);
    
            expect(ui.feedbackPopup.querySelector).toHaveBeenCalledWith('h2');
            expect(ui.feedbackPopup.querySelector).toHaveBeenCalledWith('p');
            expect(ui.feedbackPopup.style.display).toBe('flex');
        });
    });
        jest.mock('./pyodideRunner.js', () => ({
        executePythonMoveLoop: jest.fn(),
    }));
});