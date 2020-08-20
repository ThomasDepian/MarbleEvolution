import * as Phaser from 'phaser';

/**
 * Class representing a marble in the game.
 * 
 * A marble bounces off an [[Obstacle | obstacle]] or the world border with a restitution of _0.9_.
 * This means _approximately_ 90% of the kinetic energy will be preserved.
 * The 'bouncing algorithm' is handled by the Matter.js-Physics-Library and follows more or less following rule:
 * 'Entry angle equals exit angle'
 * The speed of the marble decreases over time.
 * 
 * @see [[Configuration]]: Please refer to the configuration class for any limitations/settings which may apply.
 */
export class Marble extends Phaser.Physics.Matter.Sprite {
    /**
     * The start point of the marble.
     */
    protected startPosition: Phaser.Geom.Point;
    
    /**
     * 
     * @param world       The world to which the marble belongs.
     * @param scene       The scene to which the marble belongs.
     * @param startPoint  Start point of the marble.
     * @param textureName The name of the texture. **Note**: Must be loaded _before_ the call.
     * @param diameter    Diameter of the marble. **Note**: Must be chosen such that the marble will not flow outside the screen.
     */
    constructor (
        world:       Phaser.Physics.Matter.World,
        scene:       Phaser.Scene,
        startPoint:  Phaser.Geom.Point,
        textureName: string,
        diameter:    number
    ){ 
        super(world, startPoint.x, startPoint.y, textureName); 
        this.setDisplaySize(diameter, diameter);

        // Change the hit box of the underlying matter object.
        this.setCircle(diameter / 2);
        this.setBounce(0.9);
        scene.add.existing(this);
        this.startPosition = startPoint;
    }
    
    /**
     * Starts a marble by initializing the velocity of the underlying
     * Matter.js-body.
     * 
     * The velocity is computed using the cosine and the sinus
     * of the given angle to define the x and the y direction/component/value respectively.
     * The result is a normalized vector which points in 'the right direction'.
     * It will then multiplied with the given power value to ensure the correct length.
     * 
     * @see [[Configuration]] Any limititations which may apply are specified in the configuration.
     * 
     * @param power A number describing the 'power' of the marble.
     *              The higher the power, the faster is the initial speed of the marble.
     *              The power can be a any real value, which does not violate the configuration.
     * @param angle A number describing the 'direction' in which the
     *              marble initially moves. The value must be an angle
     *              in radiant in the valid range.
     */
    public start(power: number, angle: number): void {        
        const speedX = Math.cos(angle) * power
        const speedY = -Math.sin(angle) * power;
        

        this.setVelocity(speedX, speedY);
    }

    /**
     * Stops the marble.
     * 
     * A marble gets stopped by setting its velocity to zero.
     */
    public stop(): void {
        this.setVelocity(0, 0);
    }

    /**
     * Resets a marble.
     * 
     * A marble gets reseted by setting its velocity to zero and
     * positioning it at the start point.
     */
    public reset(): void {
        this.stop();
        this.setPosition(this.startPosition.x, this.startPosition.y);
    }

     /**
     * Computes the distance of a marble to a given object.
     * 
     * @param obj The object to which the distance should be computed.
     * 
     * @returns The distance to the object.
     */
    public distanceTo(obj: Phaser.GameObjects.Components.Transform): number {
        return new Phaser.Math.Vector2(this.x - obj.x, this.y - obj.y).length();
    }

    /**
     * Checks whether the marble is moving or not.
     * 
     * A marble is moving if it has a significant velocity.
     * 
     * @returns Return `true` if the marble is moving, `false`
     *          otherwise.
     */
    public isMoving(): boolean{
        return new Phaser.Math.Vector2(this.body.velocity).length() > 0.075;
        
    }

    /**
     * Checks whether the marble is touching the specified object or not.
     * 
     * @returns Return `true` if the marble touches the object,
     *          `false` otherwise.
     */
    public isTouching(obj: Phaser.GameObjects.Components.GetBounds): boolean{
        const thisBounds = this.getBounds();
        const objBounds = obj.getBounds();
        
        // bounds are always rectangles
        return Phaser.Geom.Intersects.RectangleToRectangle(thisBounds, objBounds);
    }
}
