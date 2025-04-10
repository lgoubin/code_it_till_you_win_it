import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { Terminal } from "xterm";

document.addEventListener('DOMContentLoaded', () => {

    const editorContainer = document.getElementById('editor-container');
    const terminalContainer = document.getElementById('terminal-container');

    if (!editorContainer || !terminalContainer) {
        console.error("Les conteneurs nécessaires sont introuvables !");
        return;
    }

  const editor = new EditorView({
    doc: '# Écrivez votre code ici...\nprint("Hello, world!")',
    extensions: [basicSetup, python()],
        parent: editorContainer
  });

    const terminal = new Terminal({
        theme: {
            background: '#3b3b3b',
            foreground: '#dad3e2',
        }
    });
    terminal.open(terminalContainer);
    terminal.write('********************\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '*..................*\r\n' +
                   '********************\r\n');


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
            terminal.write(`Résultat : ${result}\r\n`);
        } catch (error) {
            terminal.write(`Erreur : ${error.message}\r\n`);
    }
    }

    document.getElementById("run-button").addEventListener("click", async () => {
        const userCode = editor.state.doc.toString(); 
        terminal.write(`Exécution du code :\r\n${userCode}\r\n`);

        if (pyodideInstance) {
            await executePythonCode(pyodideInstance, userCode, terminal);
        } else {
            terminal.write("Pyodide n'est pas encore prêt. Veuillez patienter...\r\n");
        }
    });

    function resizeTerminal(terminal, container) {
        const cols = Math.floor(container.offsetWidth / 9);
        const rows = Math.floor(container.offsetHeight / 18);
        terminal.resize(cols, rows);
    }
});
