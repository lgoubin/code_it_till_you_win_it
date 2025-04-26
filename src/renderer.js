import { resizeTerminal, updateGameDisplay, resetGameContainer, terminalConfig, updateTerminal, switchElementVisibility } from './utils.js';
import { initializePyodide } from './pyodideRunner.js';
import { runLevel } from './logic/runLevel.js';
import { EditorView, keymap } from "@codemirror/view";

import { Terminal } from "xterm";
import { LearningGame } from './learningGame/learningGame.js';
import snakeData from './content/snake/snakeConfig.json';

let learningGame;
let game;
let context;

document.addEventListener('DOMContentLoaded', () => {

    const ui = {
        levelTitle: document.getElementById('level-title'),
        levelObjective: document.getElementById('level-objective'),
        levelInstructions: document.getElementById('level-instructions'),
        feedbackPopup: document.getElementById('feedback-popup'),
        runButton: document.getElementById('run-button'),
        resetButton: document.getElementById('reset-button'),
        closeButton: document.getElementById('close-popup'),
        homeScreen: document.getElementById('home-screen'),
        gameScreen: document.getElementById('game-screen'),
        homeMenu: document.getElementById('home-menu'),
        gameIntro: document.getElementById('game-intro'),
        introText: document.getElementById('intro-text'),
        startButton: document.getElementById('start-game-btn'),
        editorContainer: document.getElementById('editor-container'),
        terminalContainer: document.getElementById('terminal-container'),
        snakeStartButton: document.getElementById('start-snake-btn'),
    };

    const editor = new EditorView({
        parent: ui.editorContainer,
        doc: ''
    });

    const terminal = new Terminal(terminalConfig);
    terminal.open(ui.terminalContainer);

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
        terminal
    };

    // DEBUG MODE
    if (import.meta.env.__GAME__ && import.meta.env.__LEVEL__) {
        const levelId = import.meta.env.__LEVEL__;
        learningGame = new LearningGame(snakeData);
        learningGame.setDebugStartLevel(levelId);
        game = learningGame.game;
        context.learningGame = learningGame;
        context.game = game;
        ui.introText.textContent = learningGame.introduction;
        switchElementVisibility(ui.homeScreen, ui.gameScreen);
        resetGameContainer(context);
        resizeTerminal(terminal, ui.terminalContainer);
    }


    // Buttons event listeners
    ui.snakeStartButton.addEventListener('click', () => {
        learningGame = new LearningGame(snakeData);
        game = learningGame.game;
        context.learningGame = learningGame;
        context.game = game;
        ui.introText.textContent = learningGame.introduction;
        switchElementVisibility(ui.homeMenu, ui.gameIntro);
    });

    ui.startButton.addEventListener('click', () => {
        switchElementVisibility(ui.homeScreen, ui.gameScreen);
        resetGameContainer(context);
        resizeTerminal(terminal, ui.terminalContainer);
    });

    ui.runButton.addEventListener("click", async () => {
        if (pyodideInstance) {
            runLevel(context, pyodideInstance)
        } else {
            terminal.write("Pyodide n'est pas encore prêt. Veuillez patienter...\r\n");
        }
        updateGameDisplay(context);
    });

    ui.resetButton.addEventListener("click", () => {
        resetGameContainer(context);
    });

    ui.closeButton.addEventListener("click", () => {
        if (context.learningGame.currentLevel.isSucceeded()) {
            ui.feedbackPopup.style.display = 'none';
            learningGame.nextLevel();
            resetGameContainer(context);
        } else {
            ui.feedbackPopup.style.display = 'none';
            game.reset();
            updateTerminal(terminal, game);
        }
    });
});
