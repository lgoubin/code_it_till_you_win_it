export async function initializePyodide() {
    try {
        const pyodide = await loadPyodide();
        return pyodide;
    } catch (error) {
        console.error("Erreur lors du chargement de Pyodide :", error);
    } 
}

async function validateUserCode(pyodide, userCode) {
    const validatorCode = await loadValidator("snake.py");
    
    const fullValidatorCode = `
${validatorCode}
${userCode}                        
result = run_tests()`.replace(/\t/g, '    ');
    try {
        await pyodide.runPythonAsync(fullValidatorCode);
        return pyodide.globals.get("result").toJs();
    } catch (error) {
        return { success: false, failures: [`Erreur : ${error.message}`] };
    }
}

async function loadValidator(filename) {
    const response = await fetch(`/validators/${filename}`);
    if (!response.ok) {
        throw new Error(`Erreur de chargement du validateur : ${response.statusText}`);
    }
    return await response.text();
}


export async function executePythonMoveLoop(pyodide, game, level, userCode, gameState, onStep) {
    const fullCode = `${userCode}`.replace(/\t/g, '    ');

    try {
        await pyodide.runPythonAsync(fullCode);
        const stopCondition = level.stopCondition;
        while (true) {
          pyodide.globals.set("head", gameState.snakeHead);
          pyodide.globals.set("apple", gameState.apple);
          pyodide.globals.set("grid_size", gameState.gridSize);
          pyodide.globals.set("direction", gameState.direction);
        
          const direction = await pyodide.runPythonAsync("nextMove()");
          onStep(direction);
        
          if (game.shouldStop(stopCondition)) {
            break;
          }
        
          await new Promise(r => setTimeout(r, 250));
        }

        const result = await validateUserCode(pyodide, userCode);
        return Object.fromEntries(result);

    } catch (error) {
        return { success: false, failures: [`Erreur Python : ${error.message}`] };
    }
}