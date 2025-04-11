import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

export const terminalConfig = {
    theme: {
        background: '#3b3b3b',
        foreground: '#dad3e2',
    },
    fontSize: 14,
    cursorBlink: true,
    cursorStyle: 'block',
};

export function resizeTerminal(terminal, container) {
    const cols = Math.floor(container.offsetWidth / 9);
    const rows = Math.floor(container.offsetHeight / 18);
    terminal.resize(cols, rows);
}

export function updateLevelDisplay(context) {
    context.ui.levelTitle.textContent = context.learningGame.currentLevel.name;
    context.ui.levelDescription.textContent = context.learningGame.currentLevel.description;
    context.ui.nextLevelButton.disabled = !context.learningGame.currentLevel.isComplete(context.game);
    if (context.learningGame.currentLevel.isComplete(context.game)) {
        context.ui.feedback.textContent = "Niveau terminé !";
    }
}

export function resetGameContainer(context) {
    game.reset();
    updateLevelDisplay(context);
    context.editor.setState(EditorState.create({
        doc: context.learningGame.currentLevel.presetCode,
        extensions: [basicSetup, python(), keymap.of([indentWithTab])],
        parent: context.ui.editorContainer
    }));
    context.ui.feedback.textContent = "";
    updateTerminal(context.terminal, context.game);
}

export function updateTerminal(terminal, game) {
    terminal.clear();
    terminal.write(game.render());
    terminal.write("\r\n> ");
    terminal.write("Score : " + game.score + "\r\n");
}

export async function initializePyodide() {
    try {
        const pyodide = await loadPyodide();
        return pyodide;
    } catch (error) {
        console.error("Erreur lors du chargement de Pyodide :", error);
    }
}

export async function executePythonCode(pyodide, code, terminal) {
    try {
            await pyodide.runPythonAsync(code);
            return await pyodide.runPython('nextMove()');
        } catch (error) {
            terminal.write(`Erreur : ${error.message}\r\n`);
    }
}