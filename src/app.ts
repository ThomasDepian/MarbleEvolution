import { Main } from './Main';
import { MarbleEvolution } from './MarbleEvolution';
import * as Phaser from 'phaser';
/**
 * Actual phaser game object.
 */
export let game: MarbleEvolution = null;

/**
 * Configuration for the game.
 */
const config: Phaser.Types.Core.GameConfig = {
    title: "Marble Evolution",
    type: Phaser.AUTO,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 500,
        height: 500,
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


/**
 * Initializes the game once window is loaded.
 */
window.onload = () => {
    game = new MarbleEvolution(config);
};