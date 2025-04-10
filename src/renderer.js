import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { Terminal } from "xterm";
import { SnakeGame } from './snakeGame.js';
import { LearningGame } from './learningGame.js';
import { Level } from './level.js';

const game = new SnakeGame({ width: 20, height: 10 }); // Taille de la grille du jeu

const levels = [
    new Level({
        id: 1,
        name: "Premiers pas",
        description: "Fais avancer le serpent d’une case.",
        presetCode: 'def nextMove(): \n    direction = "N" \n    return direction',
        validator: (game) => game.snake.body[0].x !== 5 || game.snake.body[0].y !== 5
    }),
    new Level({
        id: 2,
        name: "Évite la mort",
        description: "Fais en sorte que le serpent ne meure pas.",
        presetCode: 'def nextMove(): \n    direction = "E" \n    return direction',
        validator: (game) => false
    }),
];

const learningGame = new LearningGame(levels);



document.addEventListener('DOMContentLoaded', () => {

    const editorContainer = document.getElementById('editor-container');
    const terminalContainer = document.getElementById('terminal-container');
    const levelTitle = document.getElementById('level-title');
    const levelDescription = document.getElementById('level-description');
    const feedback = document.getElementById('feedback');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');
    const nextLevelButton = document.getElementById('next-button');

    updateLevelDisplay(learningGame.currentLevel);

    if (!editorContainer || !terminalContainer) {
        console.error("Les conteneurs nécessaires sont introuvables !");
        return;
    }

    const editor = new EditorView({
        doc: learningGame.currentLevel.presetCode,
        extensions: [basicSetup, python(), keymap.of([indentWithTab])],
        parent: editorContainer
    });

    const terminal = new Terminal({
        theme: {
            background: '#3b3b3b',
            foreground: '#dad3e2',
        }
    });
    terminal.open(terminalContainer);
    terminal.write(game.render());
    terminal.write("\r\n> ");
    terminal.write("Score : " + game.score + "\r\n");


    resizeTerminal(terminal, terminalContainer);

    window.addEventListener('resize', () => {
        resizeTerminal(terminal, terminalContainer);
    });

    let pyodideInstance = null;
    async function initializePyodide() {
        console.log("Début du chargement de Pyodide...");
        try {
  const pyodide = await loadPyodide();
            console.log("Pyodide chargé avec succès !");
            return pyodide;
        } catch (error) {
            console.error("Erreur lors du chargement de Pyodide :", error);
        }
    }

    initializePyodide().then((pyodide) => {
        pyodideInstance = pyodide;
    });

    async function executePythonCode(pyodide, code, terminal) {
    try {
      const result = await pyodide.runPythonAsync(code);
            return pyodide.runPython('nextMove()');
        } catch (error) {
            terminal.write(`Erreur : ${error.message}\r\n`);
    }
    }

    runButton.addEventListener("click", async () => {
        const userCode = editor.state.doc.toString(); 
        if (pyodideInstance) {
            const direction = await executePythonCode(pyodideInstance, userCode, terminal);
            terminal.clear();
            game.moveSnake(direction);
            terminal.write(game.render());
            terminal.write("\r\n> ");
            terminal.write("Score : " + game.score + "\r\n");
        } else {
            terminal.write("Pyodide n'est pas encore prêt. Veuillez patienter...\r\n");
        }
        updateLevelDisplay(learningGame.currentLevel);
    });

    resetButton.addEventListener("click", () => {
        game.reset();
        updateLevelDisplay(learningGame.currentLevel);
        editor.setState(EditorState.create({
            doc: learningGame.currentLevel.presetCode,
            extensions: [basicSetup, python(), keymap.of([indentWithTab])],
            parent: editorContainer
        }));
        terminal.clear();
        terminal.write(game.render());
        terminal.write("\r\n> ");
        terminal.write("Score : " + game.score + "\r\n");
        feedback.textContent = "";
    });

    nextLevelButton.addEventListener("click", () => {
        if (learningGame.currentLevel.isComplete(game)) {
            learningGame.currentLevel.markAsCompleted();
            learningGame.nextLevel();
            game.reset();
            updateLevelDisplay(learningGame.currentLevel);
            editor.setState(EditorState.create({
                doc: learningGame.currentLevel.presetCode,
                extensions: [basicSetup, python(), keymap.of([indentWithTab])],
                parent: editorContainer
            }));
            terminal.clear();
            terminal.write(game.render());
            terminal.write("\r\n> ");
            terminal.write("Score : " + game.score + "\r\n");
            feedback.textContent = "";
        }
    });



    function resizeTerminal(terminal, container) {
        const cols = Math.floor(container.offsetWidth / 9);
        const rows = Math.floor(container.offsetHeight / 18);
        terminal.resize(cols, rows);
    }

    function updateLevelDisplay(level) {
        levelTitle.textContent = level.name;
        levelDescription.textContent = level.description;
        nextLevelButton.disabled = !level.isComplete(game);
        if (level.isComplete(game)) {
            feedback.textContent = "Niveau terminé !";
        }
    }
});
