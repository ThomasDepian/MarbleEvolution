/**
 * Simple interface describing the properties of a coorindate
 * used in the game.
 * @note Can directly be passed to the constructor of [[Phaser.Math.Vector2]]
 */
export interface CoordinateConfiguartion {
    /**
     * x value of the coordinate
     */
    x: number;
    /**
     * y value of the coordinate
     */
    y: number;
}

/**
 * Simple coordinate type used in the game.
 * 
 * @note Can be converted into an instance of [[Phaser.Math.Vector2]] or [[Phaser.Geom.Point]].
 */
export class Coordinate implements CoordinateConfiguartion {

    public x: number;
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

    /**
     * Creates a new coordinate based on the a configuration-
     * @param coordinate The configuration absed on which the coordinate gets generated.
     * @returns Returns the generated coorindate.
     */
    public static of(coordinate: CoordinateConfiguartion): Coordinate {
        return new Coordinate(coordinate.x, coordinate.y);
    }

    public toPoint(): Phaser.Geom.Point{
        return new Phaser.Geom.Point(this.x, this.y);
    }

    public toVector2(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this);
    }
}