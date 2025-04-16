import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from '@codemirror/theme-one-dark';

export const terminalConfig = {
    theme: {
        background: '#2C2934',
        foreground: '#DFDFDF',
    },
    fontSize: 16,
    cursorBlink: true,
    cursorStyle: 'block',
};

export function resizeTerminal(terminal, container) {
    const margin = 20;
    const cols = Math.floor((container.offsetWidth - margin) / 9);
    const rows = Math.floor((container.offsetHeight - margin) / 24);
    terminal.resize(cols, rows);
}


export function updateGameDisplay(context) {
    context.ui.levelTitle.textContent = context.learningGame.currentLevel.title;
    context.ui.levelDescription.textContent = context.learningGame.currentLevel.instructions;
}

export function resetGameContainer(context) {
    context.game.reset();
    updateGameDisplay(context);
    context.editor.setState(EditorState.create({
        doc: context.learningGame.currentLevel.starterCode,
        extensions: [basicSetup, python(), keymap.of([indentWithTab]), oneDark],
        parent: context.ui.editorContainer,
    }));
    updateTerminal(context.terminal, context.game);
}

export function updateTerminal(terminal, game) {
    terminal.clear();
    terminal.write(game.render());
}

export function switchElementVisibility(previousElement, nextElement) {
    previousElement.classList.remove('shown');
    previousElement.classList.add('hidden');
    nextElement.classList.remove('hidden');
    nextElement.classList.add('shown');
}

export function displayFeedback(ui, level, result) {
    if (result.success) {
        ui.feedbackPopup.querySelector('h2').textContent = "Bravo !";
        ui.feedbackPopup.querySelector('p').textContent = level.messagePopup;
        ui.feedbackPopup.style.display = 'flex';
        level.markAsSucceeded();
    } else {
        ui.feedbackPopup.querySelector('h2').textContent = "Oups !";
        ui.feedbackPopup.querySelector('p').textContent =  result.failures
        ui.feedbackPopup.style.display = 'flex';
    }
}