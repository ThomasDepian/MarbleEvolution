
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

    /**
     * Specifies the diameter of the goal.
     */
    static readonly GOAL_DIAMETER = 20;

    /**
     * Specifies the default point of the goal.
     */
    static readonly GOAL_POSITION = new Phaser.Geom.Point(500 / 2, 2 * Configuration.GOAL_DIAMETER);


    /** 
     * Specifies the amount of individuals.
     */
    static readonly INDIVIDUAL_COUNT = 20;

    /** 
     * Specifies the probability that a child mutates.
     */
    static readonly MUTATION_PROBABILITY = 0.18;

    /** 
     * Specifies the probability that a power property of the 
     * DNA mutates.
     * 
     * **Note:** This means, if the childs mutates, there is a
     * 50% chance that the power property will mutate.
     * That means, in total the power property has a mutation chance
     * of 0.18 * 0.5 = 0.09 = 9%
     */
    static readonly POWER_MUTATION_PROBABILITY = 0.5;

    /** 
     * Specifies the probability that a angle property of the 
     * DNA mutates.
     * 
     * **Note:** This means, if the childs mutates, there is a
     * 50% chance that the angle property will mutate.
     * That means, in total the angle property has a mutation chance
     * of 0.18 * 0.5 = 0.09 = 9%
     */
    static readonly ANGLE_MUTATION_PROBABILITY = 0.5;

    /** 
     * Specifies the bounds for a power mutation.
     * That means if the power property mutates, the following 
     * will hold: |new_power - old_power| <= 3.
     */
    static readonly POWER_MUTATION_RANGE = 3;

    /** 
     * Specifies the bounds for a angle mutation.
     * That means if the angle property mutates, the following 
     * will hold: |new_angle - old_angle| <= 3.
     */
    static readonly ANGLE_MUTATION_RANGE = 0.5

    /** 
     * Specifies the probability that during reproduction the
     * propery from the father will be choosen.
     */
    static readonly FATHER_GENES_PROBABILITY = 0.5
}