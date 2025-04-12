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


export function runLevel(context, pyodideInstance) {      
    const userCode = context.editor.state.doc.toString();
    
    const gameState = context.game.getGameState();
    
    executePythonMoveLoop(pyodideInstance, userCode, gameState, (direction) => {
        context.game.moveSnake(direction);
        updateTerminal(context.terminal, context.game);
    }).then((result) => {
        displayFeedback(result);
    });
}  

export function resizeTerminal(terminal, container) {
    const cols = Math.floor(container.offsetWidth / 9);
    const rows = Math.floor(container.offsetHeight / 18);
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

export function displayFeedback(result) {
    if (result.success) {
        console.log("Test réussi !");
    } else {
        console.error("Test échoué :", result.failures);
    }
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

export async function validateUserCode(pyodide, userCode) {
    const validatorCode = await loadValidator("snake.py");
    
    const fullValidatorCode = `
                        ${validatorCode}
                        ${userCode}                        
                        result = run_tests()
                        `;
    try {
        await pyodide.runPythonAsync(fullValidatorCode);
        return pyodide.globals.get("result").toJs();
    } catch (error) {
        return { success: false, failures: [`Erreur : ${error.message}`] };
    }
}

export async function loadValidator(filename) {
    const response = await fetch(`/validators/${filename}`);
    if (!response.ok) {
        throw new Error(`Erreur de chargement du validateur : ${response.statusText}`);
    }
    return await response.text();
}


export async function executePythonMoveLoop(pyodide, userCode, gameState, onStep) {
    //const validatorCode = await loadValidator("snake.py");

    const fullCode = `${userCode}`;

    fullCode.replace(/\t/g, '    ');
    console.log(fullCode);
    try {
        await pyodide.runPythonAsync(fullCode);
        let i = 0;
        while (i<5) {
            pyodide.globals.set("head", gameState.snakeHead);
            pyodide.globals.set("apple", gameState.apple);
            pyodide.globals.set("grid_size", gameState.gridSize);
            pyodide.globals.set("direction", gameState.direction);

            const direction = await pyodide.runPythonAsync("nextMove()");
            onStep(direction);

            await new Promise(r => setTimeout(r, 250));

            i++;
        }

        // (Optionnel) Test final après exécution
        // const result = await validateUserCode(pyodide, userCode);
        // return result;
        return { success: true, failures: [] };

    } catch (error) {
        return { success: false, failures: [`Erreur Python : ${error.message}`] };
    }
}