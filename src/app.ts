// cSpell:ignoreRegExp /import '.*'/;
import { Main } from './Main';
import { MarbleEvolution } from './MarbleEvolution';
import * as Phaser from 'phaser';
import 'bulma/css/bulma.min.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import './../assets/styles.css';


/**
 * Actual phaser game object.
 */
export let game: MarbleEvolution = null;
export let demo: MarbleEvolution = null;

const columnWidth = document.getElementById('game-column').offsetWidth;
const gameSize     = 500;
let zoomFactor     = 1;

if (columnWidth < gameSize) {
    zoomFactor = (columnWidth * 1.0) / gameSize;
}


/**
 * Configuration for the game.
 */
const config: Phaser.Types.Core.GameConfig = {
    title: "Marble Evolution",
    type: Phaser.AUTO,
    scale: {
        width: gameSize,
        height: gameSize,
        zoom: zoomFactor
    },
    scene: [Main],
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
                x: 0
            },
            debug: false // shows the hit boxes, object boundaries
        }
    },
    parent: "game",
    backgroundColor: "#eee"
}

/**
 * Initializes the game once window is loaded.
 */
window.onload = () => {    
    game = new MarbleEvolution(config);
};