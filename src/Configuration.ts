import { BoundSpecification } from './BoundSpecification';
import { Obstacle } from './Obstacle';
import { Coordinate } from './Coordinate';
import * as Phaser from 'phaser';

/**
 * Class containing the configuration for the marble evolution game.
 * @todo Read in from external file.
 * @todo Add more configuration options.
 */
export class ConfigurationHandler {
     /**
     * Specifies the diameter of a marble.
     */
    static readonly MARBLE_DIAMETER = 5;

    /**
     * Specifies the default start point of a marble.
     */
    static readonly START_POSITION = new Phaser.Geom.Point(500 / 2, 500 - 2 * ConfigurationHandler.MARBLE_DIAMETER);

    /**
     * Specifies the diameter of the goal.
     */
    static readonly GOAL_DIAMETER = 20;

    /**
     * Specifies the default point of the goal.
     */
    static readonly GOAL_POSITION = new Phaser.Geom.Point(500 / 2, 2 * ConfigurationHandler.GOAL_DIAMETER);


    /** 
     * Specifies the amount of individuals.
     */
    static readonly INDIVIDUAL_COUNT = 100;

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
    static readonly ANGLE_MUTATION_RANGE = 0.5;

    /** 
     * Specifies the probability that during reproduction the
     * propery from the father will be choosen.
     */
    static readonly FATHER_GENES_PROBABILITY = 0.5;

    /** 
     * Specifies whether a human or the genetic algorithm (the _AI_)
     * plays the game.
     */
    static readonly HUMAN_MODE = false;
   
   
    private config: Configuration;

    constructor(config?: Configuration) {
        this.config = config;
    }

    public updateConfig(config: Configuration) {
        this.config = config;
    }

    public getProperty(key: string): any {
        return this.config[key];
    }





    
    


    
}

/**
 * Actual configuration interface defining
 * all configuartion options for the game.
 */
export interface Configuration {
    gameSettings: GameSettingsConfiguration,
    /**
     * Specifies the skins used in the game.
     * Each skin may be an image (**png or jpg**) which must be
     * **inside the assets folder**. 
     */
    skins: {
        /**
         * Path to the skin for the marble.
         */
        marble: string,
        /**
         * Path to the skin for the obstacle.
         */
        obstacle: string,
        /**
         * Path to the skin for the goal.
         */
        goal: string,
        /**
         * Path to the skin for the individual.
         */
        individual: string
    },
    /**
     * Specifies the settings for the genetic algorithm.
     * 
     * @note **Important** All **percentages** must be in the range **[0, 1]**.
     */
    geneticAlgorithm: {
        /**
         * With how many individuals should the simulation be performed.
         */
        individualCount: number,
        /** 
         * Specifies the probability that during reproduction the
         * propery from the father will be choosen.
         */
        fatherGenesProbability : {
            power: number,
            angle: number
        },
        /**
         * Specifies all mutation probabilites used in the algorithm.
         */
        mutationProbability: {
            /**
             * Specifies the probability that a child mutates.
             */
            general: number,
            /** 
             * Specifies the probability that the power property of the 
             * DNA mutates.
             * 
             * **Note:** This means, if the childs mutates, there is for example
             * a 50% chance that the power property will mutate.
             * That means, in total the power property has a mutation chance
             * of general * power = (for example) 0.18 * 0.5 = 0.09 = 9%
             */
            power: number,
            /** 
             * Specifies the probability that the angle property of the 
             * DNA mutates.
             * 
             * **Note:** This means, if the childs mutates, there is for example
             * a 50% chance that the angle property will mutate.
             * That means, in total the angle property has a mutation chance
             * of general * angle = (for example) 0.18 * 0.5 = 0.09 = 9%
             */
            angle: number
        },
        /**
         * Specifies all mutation ranges.
         * A range of lowerBound = -3, upperBound = 3
         * means that the new propery is in the range
         * `[old propery - 3, old propery + 3]`
         */
        mutationRange: {
            /**
             * Range for the power property of the dna.
             */
            power: BoundSpecification,
            /**
             * Range for the angle property of the dna.
             */
            angle: BoundSpecification
        }
    },
    
    levels: LevelConfiguration[]
}


/**
 * Specifies the current settings of the game.
 */
export interface GameSettingsConfiguration {
    /**
     * Specifies whether the human mode is active (_true_) or
     * the genetic algorithm operates the marbles (_false_)
     */
    humanMode: boolean,
    /**
     * Specifies if the debug mode is active.
     * If active, debug output will be generated.
     */
    debugMode: boolean
}

/**
 * Specifies a level present in the game.
 */
export interface LevelConfiguration {
    /**
     * Level numbers.
     * Levels get sorted in ascending order 
     * based on this number.
     */
    number: number,
    /**
     * Displayname of the level
     */
    name: string,
    /**
     * Specifies the configuration of a marble
     * in the current level.
     */
    marble: {
        /**
         * Specifies the diameter of a marble.
         * 
         * @note Should be an **even number**.
         */
        diameter: number,
        /**
         * Specifies the start point of a marble.
         */
        position: Coordinate
    },
    /**
     * Specification of the goal.
     */
    goal: {
        /**
         * Specifies the diameter of the goal.
         * 
         * @note Should be an **even number**.
         */
        diameter: number,
        /**
         * Specifies the position of the goal.
         */
        position: Coordinate
    },
    obstacles: ObstacleConfiguration[]
}

/**
 * Specifies a obstacle present in the game.
 */
export interface ObstacleConfiguration {
    /**
     * Position of the obstacle.
     */
    position: Coordinate,
    /**
     * Size of the obstacle in pixels.
     */
    size: {
        width: number,
        height: number
    }
}