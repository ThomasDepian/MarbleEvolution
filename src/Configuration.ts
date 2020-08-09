
/**
 * Class containing the configuration for the marble evolution game.
 * @todo Read in from external file.
 * @todo Add more configuration options.
 */
export class Configuration {
    /**
     * Specifies the diameter of a marble.
     */
    static readonly MARBLE_DIAMETER = 5;

    /**
     * Specifies the default start point of a marble.
     */
    static readonly START_POSITION = new Phaser.Geom.Point(500 / 2, 500 - 2 * Configuration.MARBLE_DIAMETER);
}