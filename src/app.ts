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


const gameSize = Math.min(document.body.clientWidth, 500);

/**
 * Configuration for the game.
 */
const config: Phaser.Types.Core.GameConfig = {
    title: "Marble Evolution",
    type: Phaser.AUTO,
    scale: {
        width: gameSize,
        height: gameSize,
    },
    scene: [Main],
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
                x: 0
            },
            debug: true // shows the hit boxes, object boundaries
        }
    },
    parent: "game",
    backgroundColor: "#eee"
}

const demoConfig = {...config};
demoConfig['title'] = 'Marble Evolution - Demo';
demoConfig['scale'] = {
    width: document.body.clientWidth,
    height: window.innerHeight
};
demoConfig['parent'] = 'demo';
demoConfig['transparent'] = true;
demoConfig['physics']['matter']['debug'] = false;


/**
 * Initializes the game once window is loaded.
 */
window.onload = () => {    
    game = new MarbleEvolution(config, false);
    demo = new MarbleEvolution(demoConfig, true);
};