import { BoundSpecification } from './BoundSpecification';
import { CoordinateConfiguartion } from './Coordinate';
import * as Phaser from 'phaser';

/**
 * Class containing the configuration for the marble evolution game.
 * @todo Add more configuration options.
 */
export class ConfigurationHandler {

    /**
     * Current configuration.
     */
    public static config: Configuration;

    /**
     * Updated configuration.
     */
    private static updatedConfig: Configuration;

    /**
     * Updated the entire configuration.
     * **Note** Erases any changes made to the current configuration.
     * @param config The new configuration.
     */
    public static updateConfig(config: Configuration): void {
        ConfigurationHandler.config = config;
        ConfigurationHandler.updatedConfig = config;
    }

    /**
     * Applies the changes made to the [[updatedConfig]]
     * to the _real_ configuration.
     */
    public static applyChanges(): void {
        ConfigurationHandler.config = ConfigurationHandler.updatedConfig;
        ConfigurationHandler.updatedConfig = ConfigurationHandler.config;
    }

    /**
     * Gets the current value of a property of the configuration.
     * 
     * @param key The key of the property which should be returned. Must be given as _path_
     *            starting the root of the configuration. Each level must be seperated by a dot `.`
     *            _Example_: `gameSettings.verboseMode` would return the current value of the property `verboseMode`
     *            inside the property `gameSettings`.
     * 
     * @returns Returns the value property.
     */
    public static getProperty<T>(key: string): T {
        if (key === undefined) {
            return;
        }
        return <T>key.split('.').reduce(function(o, k) {
            return o[k];
        }, ConfigurationHandler.config);
    }

    /**
     * Fetches the configuration of a specific level.
     * This is a shorthand for `getProperty<LevelConfiguration>('levels.levelNumber')`;
     * 
     * @param levelNumber The number of the level. Must be valid.
     * 
     * @returns The configuration for the specified level.
     */
    public static getLevel(levelNumber: number = 0): LevelConfiguration {
        return this.config.levels[levelNumber];
    }

    /**
     * Fetches the configuration of the genetic algorithm.
     * This is a shorthand for `getProperty<GeneticAlgorithmConfiguration>('geneticAlgorithm')`;
     * 
     * @param levelNumber The number of the level. Must be valid.
     * 
     * @returns The configuration for the specified level.
     */
    public static getGeneticAlgorithm(): GeneticAlgorithmConfiguration {
        return this.config.geneticAlgorithm;
    }

    /**
     * Checks whether human mode is enabled or not.
     * This is a shorthand for `getProperty<boolean>('gameSettings.humanMode')`;
     * 
     * @returns Returns `true` if the human mode is enabled, else `false`.
     */
    public static isHumanMode(): boolean {
        return this.config.gameSettings.humanMode;
    }

    /**
     * Checks whether verbose mode is enabled or not.
     * This is a shorthand for `getProperty<boolean>('gameSettings.verboseMode')`;
     * 
     * @returns Returns `true` if the verbose mode is enabled, else `false`.
     */
    public static isVerboseMode(): boolean {
        return this.config.gameSettings.verboseMode;
    }

    /**
     * Updates/Sets the value of a property in the configuration.
     * **Note** The user must ensure that the new value is of the right type.
     * @see [[Configuration]] for the actual types of the values.
     * 
     * @param key The key of the property which should be updated/set. Must be given as _path_
     *            starting the root of the configuration. Each level must be seperated by a dot `.`
     *            _Example_: `gameSettings.verboseMode` would set the value of the property `verboseMode`
     *            inside the property `gameSettings` to a given value.
     * @param value The new value of the property. **Must be of the correct type**.
     */

     // TODO: MAKE GENERIC AND CHECK ON TYPE
    public static setProperty(key: string, value: any): void  {
        ConfigurationHandler.updatedConfig = ConfigurationHandler.setPropertyRec(ConfigurationHandler.updatedConfig, key, value);
    }

    /**
     * Helper function realizing the [[setProperty]] method.
     * This method recursivly travers the current configuration and updates every occurence in the
     * path with its new value. If last layer of the given key is reached, the config will be updated
     * with the new value and the updated object will be returned.
     * For any other layer the object at the current layer will be updated with the result of this method
     * when called for the underlaying layer.
     * 
     * @param config The config at the current layer.
     * @param key The key of the property which should be updated/set. Must be given as _path_
     *            starting the root of the configuration.  
     * @param value The new value of the property.
     * 
     * @returns Returns the updated config.
     */
    private static setPropertyRec(config: any, key: string, value: any): any {
        const keys = key.split('.');
        if (keys.length === 1) {
            config[keys[0]] = value;
            return config;
        }
        config[keys[0]] = ConfigurationHandler.setPropertyRec(config[keys[0]], keys.slice(1).join('.'), value);
        return config;
    }   
}

/**
 * Actual configuration interface defining
 * all configuartion options for the game.
 */
export interface Configuration {
    gameSettings: GameSettingsConfiguration,   
    geneticAlgorithm: GeneticAlgorithmConfiguration,
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
        position: CoordinateConfiguartion
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
        position: CoordinateConfiguartion
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
    position: CoordinateConfiguartion,
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
 * @note **Important** All **percentages** must be in the range **[0, 1]**.
 */
export interface GeneticAlgorithmConfiguration {
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
}