import * as Phaser from 'phaser';

/**
 * Class representing the goal in the game.
 * Other objects (especially [[Marble | marbles]]) usually do not collide with the goal and
 * therefore a goal does not have a Matter.js-body.
 * 
 * @see [[Configuration]]: Please refer to the configuration class (especially to the [[Configuration.levels | levels]])
 *                         for any limitations/settings which may apply.
 */
export class Goal extends Phaser.GameObjects.Sprite {

    /**
     * 
     * @param scene       The scene to which the goal belongs.
     * @param position    The position of the goal.
     * @param textureName The name of the texture. **Note**: Corresponding texture must be loaded _before_ the call.
     * @param diameter    Diameter of the goal. **Note**: Must be chosen such that the goal will not flow outside the game-screen.
     */
    constructor (
        scene:       Phaser.Scene,
        position:    Phaser.Geom.Point,
        textureName: string,
        diameter:    number
    ){ 
        super(scene, position.x, position.y, textureName)
        this.setDisplaySize(diameter, diameter);
        scene.add.existing(this);
    }


}