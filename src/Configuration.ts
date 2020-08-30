// cSpell:ignoreRegExp /import '.*'/;
import { BoundSpecification } from './BoundSpecification';
import { CoordinateConfiguration } from './Coordinate';


// Re-export ConfigurationHandler as it is tightly coupled to this
// interfaces
export { ConfigurationHandler } from './ConfigurationHandler';

/**
 * Actual configuration interface defining
 * all configuration options for the game.
 */
export interface Configuration {
    gameSettings:     GameSettingsConfiguration,   
    geneticAlgorithm: GeneticAlgorithmConfiguration,
    levels:           LevelConfiguration[]
}


/**
 * Specifies the current settings of the game.
 */
export interface GameSettingsConfiguration {
    /**
     * Specifies whether the human mode is active (`true`) or
     * the genetic algorithm operates the marbles (`false`).
     */
    humanMode: boolean,
    /**
     * Specifies if the verbose mode is active.
     * If active, verbose output will be generated.
     */
    verboseMode: boolean
}

/**
 * Specifies a level present in the game.
 */
export interface LevelConfiguration {
    /**
     * Display name of the level.
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
        position: CoordinateConfiguration
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
        position: CoordinateConfiguration
    },
    /**
     * Specification of the obstacles.
     */
    obstacles: ObstacleConfiguration[]
}

/**
 * Specifies a obstacle present in the game/level.
 */
export interface ObstacleConfiguration {
    /**
     * Position of the obstacle.
     */
    position: CoordinateConfiguration,
    /**
     * Size of the obstacle in pixels.
     */
    size: {
        width: number,
        height: number
    }
}


/**
 * Specifies the settings for the genetic algorithm.
 * 
 * @note **Important**: All **percentages/probabilities** must be in the range **[0, 1]**.
 */
export interface GeneticAlgorithmConfiguration {
    /**
     * With how many individuals should the simulation be performed.
     */
    individualCount: number,
    /** 
     * Specifies the probability that during reproduction the
     * property from the father will be chosen.
     */
    fatherGenesProbability : {
        power: number,
        angle: number
    },
    /**
     * Specifies all mutation probabilities used in the algorithm.
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
         * @note This means, if the children mutates, there is for example
         * a 50% chance that the power property will mutate.
         * That means, in total the power property has a mutation chance
         * of general * power = (for example) 0.18 * 0.5 = 0.09 = 9%.
         */
        power: number,
        /** 
         * Specifies the probability that the angle property of the 
         * DNA mutates.
         * 
         * @note This means, if the children mutates, there is for example
         * a 50% chance that the angle property will mutate.
         * That means, in total the angle property has a mutation chance
         * of general * angle = (for example) 0.18 * 0.5 = 0.09 = 9%.
         */
        angle: number
    },
    /**
     * Specifies all mutation ranges.
     * A range of lowerBound = -3, upperBound = 3
     * means that the new property is in the range
     * `[old property - 3, old property + 3]`
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
}