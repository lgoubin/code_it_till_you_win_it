import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from '@codemirror/theme-one-dark';
import { executePythonMoveLoop } from "./pyodideRunner.js";

export const terminalConfig = {
    theme: {
        background: '#2C2934',
        foreground: '#DFDFDF',
    },
    fontSize: 16,
    cursorBlink: true,
    cursorStyle: 'block',
};

export function runLevel(context, pyodideInstance) {      
    const userCode = context.editor.state.doc.toString();
    
    const gameState = context.game.getGameState();
    
    executePythonMoveLoop(pyodideInstance, context.game, context.learningGame.currentLevel, userCode, gameState, (direction) => {
        context.game.moveSnake(direction);
        updateTerminal(context.terminal, context.game);
    }).then((result) => {
        displayFeedback(context.ui, result);
    });
}  

export function resizeTerminal(terminal, container) {
    const margin = 20;
    const cols = Math.floor((container.offsetWidth - margin) / 9);
    const rows = Math.floor((container.offsetHeight - margin) / 22);
    terminal.resize(cols, rows);
}


export function updateGameDisplay(context) {
    context.ui.levelTitle.textContent = context.learningGame.currentLevel.title;
    context.ui.levelDescription.textContent = context.learningGame.currentLevel.instructions;
    // context.ui.nextLevelButton.disabled = !context.learningGame.currentLevel.isComplete(context.game);
    // if (context.learningGame.currentLevel.isComplete(context.game)) {
    //     context.ui.feedback.textContent = "Niveau terminé !";
    // }
}

export function resetGameContainer(context) {
    context.game.reset();
    updateGameDisplay(context);
    context.editor.setState(EditorState.create({
        doc: context.learningGame.currentLevel.starterCode,
        extensions: [basicSetup, python(), keymap.of([indentWithTab]), oneDark],
        parent: context.ui.editorContainer,
    }));
    context.ui.feedback.textContent = "";
    updateTerminal(context.terminal, context.game);
}

export function updateTerminal(terminal, game) {
    terminal.clear();
    terminal.write(game.render());
}

function displayFeedback(ui, result) {
    if (result.success) {
        ui.feedback.hidden = false;
    } else {
        console.error("Test échoué :", result.failures);
    }
}