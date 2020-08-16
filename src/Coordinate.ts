/**
 * Simple coordinate type used in the game.
 * 
 * @note Can be converted into a Phaser.Math.Vector2 object 
 */
export class Coordinate {
    /**
     * x value of the coordinate
     */
    public x: number;
    /**
     * y value of the coordinate
     */
    public y: number;

    /**
     * 
     * @param x x coorindate
     * @param y y coordinate
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toPoint(): Phaser.Geom.Point{
        return new Phaser.Geom.Point(this.x, this.y);
    }

    public toVector2(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this);
    }
}