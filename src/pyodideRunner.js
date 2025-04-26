export async function initializePyodide() {
    try {
        const pyodide = await loadPyodide();
        return pyodide;
    } catch (error) {
        console.error("Erreur lors du chargement de Pyodide :", error);
    } 
}

/**
 * Valide le code utilisateur en exécutant le validateur Python.
 * Le validateur doit définir une fonction `run_tests()` qui renvoie un dictionnaire
 * avec les résultats des tests.
 * Le code utilisateur est passé en argument à la fonction `run_tests()`.
 */
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

/**
 * Charge le validateur Python depuis le serveur.
 */
async function loadValidator(filename) {
    const response = await fetch(`/validators/${filename}`);
    if (!response.ok) {
        throw new Error(`Erreur de chargement du validateur : ${response.statusText}`);
    }
    return await response.text();
}

/**
 * Exécute la boucle principale de jeu côté utilisateur, en appelant nextMove() à chaque tour.
 * Cette fonction gère :
 * - l'initialisation du code utilisateur
 * - les échanges de données JS <-> Python
 * - l'arrêt propre en cas de collision, boucle infinie ou limite atteinte
 * - la validation du code utilisateur en fin de partie
 */
export async function executePythonMoveLoop(pyodide, game, level, userCode, onStep) {
    const fullCode = `${level.hiddenCode}\n${userCode}`.replace(/\t/g, '    ');

    try {
        // Exécute le code utilisateur (doit définir la fonction nextMove)
        await pyodide.runPythonAsync(fullCode);

        while (!game.hasReachedMaxSteps() && !game.gameOver) {
            // Définition des globales dont l'utilisateur a besoin
            const globals = game.getGameState() ?? {};
            for (const [key, value] of Object.entries(globals)) {
                pyodide.globals.set(key, value);
            }

            let direction;
            direction = await pyodide.runPythonAsync("next_move()");

            onStep(direction);

            await new Promise(r => setTimeout(r, 400));
        }
        // En fin de partie, on valide le comportement de l’utilisateur via les tests du niveau
        const result = await validateUserCode(pyodide, userCode, game, level);
        return Object.fromEntries(result);

    } catch (error) {
        return { success: false, failures: [error.message, `${friendlyError(error.message)}`] };
    }
}

/**
 * Affiche un message d'erreur explicite pour l'utilisateur.
 * On essaie de détecter les erreurs les plus fréquentes et de les expliquer.
 */
function friendlyError(msg) {

    if (msg.includes("name 'nextMove' is not defined")) {
        return "Tu dois définir une fonction 'nextMove'. Tu peux utiliser le bouton Reset pour revenir au code fourni.";
    } else if (msg.includes("SyntaxError")) {
        return "Il y a une erreur de syntaxe dans ton code. Vérifie les parenthèses et les deux-points.";
    } else if (msg.includes("TypeError")) {
        return "Tu essaies peut-être d’utiliser une variable qui vaut `None` ou un mauvais type.";
    } else if (msg.includes("IndentationError")) {
        return "L’indentation de ton code semble incorrecte. Python est sensible aux espaces.";
    } else if (msg.includes("Cannot read properties of undefined")) {
        return "Il semble que tu essaies d'utiliser une variable sans l'avoir correctement définie ou utilisée.";
    } else if (msg.includes("ReferenceError")) {
        return "Une variable que tu essaies d'utiliser n'est pas définie. Vérifie l'orthographe et la portée des variables.";
    } else if (msg.includes("UnboundLocalError")) {
        return "Tu essaies d'utiliser une variable locale avant de l'initialiser. Vérifie la portée des variables.";
    } else if (msg.includes("AttributeError")) {
        return "Tu essaies d'utiliser une méthode ou un attribut qui n'existe pas sur cet objet.";
    } else if (msg.includes("IndexError")) {
        return "Tu essaies d'accéder à un index qui n'existe pas dans une liste ou un tableau.";
    } else if (msg.includes("KeyError")) {
        return "Tu essaies d'accéder à une clé qui n'existe pas dans un dictionnaire.";
    } else if (msg.includes("NameError")) {
        return "Une variable que tu essaies d'utiliser n'est pas définie. Vérifie l'orthographe et la portée des variables.";
    }

    // fallback
    return "Une erreur est survenue dans ton code :\n" + msg;
}