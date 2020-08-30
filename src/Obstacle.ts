import * as Phaser from 'phaser';

/**
 * Class representing an obstacle in the game.
 * 
 * Other objects (especially [[Marble | marbles]]) usually bounce off an obstacle.
 * 
 * @see [[Configuration]]: Please refer to the configuration (especially to the [[Configuration.levels | levels]])
 *                         for any limitations/settings which may apply.
 */
export class Obstacle extends Phaser.Physics.Matter.Sprite {

    /**
     * 
     * @param world       The world to which the obstacle belongs.
     * @param scene       The scene to which the obstacle belongs.
     * @param startPoint  Start point of the obstacle.
     * @param textureName The name of the texture. **Note**: Corresponding texture be loaded _before_ the call.
     * @param width       Width of the obstacle. **Note**: Must be chose such that the obstacle does not flow outside the game-screen.
     * @param height      Height of the obstacle. **Note**: Must be chose such that the obstacle does not flow outside the game-screen.
     */
    constructor (
        world:       Phaser.Physics.Matter.World,
        scene:       Phaser.Scene,
        startPoint:  Phaser.Geom.Point,
        textureName: string,
        width:       number,
        height:      number
    ){
        super(world, startPoint.x, startPoint.y, textureName); 
        this.setDisplaySize(width, height);

        // Change the hit box of the underlying matter object.
        this.setRectangle(width, height);
        // Prevents object from being pushed back by other objects
        this.setStatic(true);
        scene.add.existing(this);
    }
}