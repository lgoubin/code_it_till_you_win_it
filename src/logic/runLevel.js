// src/logic/runLevel.js
import { executePythonMoveLoop } from '../pyodideRunner.js';
import { updateTerminal, displayFeedback } from '../utils.js';

export function runLevel(context, pyodideInstance) {
    const userCode = context.editor.state.doc.toString();

    executePythonMoveLoop(
        pyodideInstance,
        context.game,
        context.learningGame.currentLevel,
        userCode,
        (direction) => {
            context.game.moveSnake(direction);
            updateTerminal(context.terminal, context.game);
        }
    ).then((result) => {
        displayFeedback(context.ui, context.learningGame.currentLevel, result);
    });
}
