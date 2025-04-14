export async function initializePyodide() {
    try {
        const pyodide = await loadPyodide();
        return pyodide;
    } catch (error) {
        console.error("Erreur lors du chargement de Pyodide :", error);
    } 
}

async function validateUserCode(pyodide, userCode, game, level) {
    const validatorCode = await loadValidator(game.name + '/level' + level.id + '.py');
    
    const fullValidatorCode = `${validatorCode}${userCode}\nresult = run_tests()`.replace(/\t/g, '    ');

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
        while (true) {
            pyodide.globals.set("head", gameState.snakeHead);
            pyodide.globals.set("apple", gameState.apple);
            pyodide.globals.set("grid_size", gameState.gridSize);
            pyodide.globals.set("direction", gameState.direction);
            
            const direction = await pyodide.runPythonAsync("nextMove()");
            onStep(direction);
            
            if (game.shouldStop("hasReachedMaxSteps") || game.hasCollided) {
                break;
            }
            
            await new Promise(r => setTimeout(r, 300));
        }
        
        const result = await validateUserCode(pyodide, userCode, game, level);
        return Object.fromEntries(result);
        
    } catch (error) {
        return { success: false, failures: [`Erreur Python : ${error.message}`] };
    }
}