import { resizeTerminal, updateLevelDisplay as updateGameDisplay, resetGameContainer,
         updateTerminal, initializePyodide, executePythonCode, terminalConfig } from './utils.js';
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { Terminal } from "xterm";
import { LearningGame } from './learningGame.js';
import snakeData from './content/snake.json';

const learningGame = new LearningGame(snakeData);
const game = learningGame.game;
let context;

document.addEventListener('DOMContentLoaded', () => {

    const ui = {
        levelTitle: document.getElementById('level-title'),
        levelDescription: document.getElementById('level-description'),
        feedback: document.getElementById('feedback'),
        runButton: document.getElementById('run-button'),
        resetButton: document.getElementById('reset-button'),
        nextLevelButton: document.getElementById('next-button'),
        editorContainer: document.getElementById('editor-container'),
        terminalContainer: document.getElementById('terminal-container'),
    };    

    const editor = new EditorView({
        doc: learningGame.currentLevel.presetCode,
        extensions: [basicSetup, python(), keymap.of([indentWithTab])],
        parent: ui.editorContainer
    });

    const terminal = new Terminal(terminalConfig);
    terminal.open(ui.terminalContainer);
    updateTerminal(terminal, game);

    resizeTerminal(terminal, ui.terminalContainer);

    window.addEventListener('resize', () => {
        resizeTerminal(terminal, ui.terminalContainer);
    });

    let pyodideInstance = null;

    initializePyodide().then((pyodide) => {
        pyodideInstance = pyodide;
    });
    
    context = {
        learningGame,
        game,
        ui,
        editor,
        terminal,
        pyodideInstance
    };

    updateGameDisplay(context);

    ui.runButton.addEventListener("click", async () => {
        const userCode = editor.state.doc.toString(); 
        if (pyodideInstance) {
            const direction = await executePythonCode(pyodideInstance, userCode, terminal);
            game.moveSnake(direction);
            updateTerminal(terminal, game);
        } else {
            terminal.write("Pyodide n'est pas encore prêt. Veuillez patienter...\r\n");
        }
        updateGameDisplay(context);
    });

    ui.resetButton.addEventListener("click", () => {
        resetGameContainer(context);
    });

    ui.nextLevelButton.addEventListener("click", () => {
        if (learningGame.currentLevel.isComplete(game)) {
            learningGame.currentLevel.markAsCompleted();
            learningGame.nextLevel();
            resetGameContainer(context);
        }
    });
});
