import { Configuration, LevelConfiguration, GeneticAlgorithmConfiguration } from './Configuration';
/**
 * Class containing the configuration for the MarbleEvolution game.
 * @todo Add more configuration options.
 */
export class ConfigurationHandler {

    /**
     * Current configuration.
     */
    public static config: Configuration;

    /**
     * Updated configuration.
     * Will be applied when [[applyChanges]] gets called.
     */
    private static updatedConfig: Configuration;

    /**
     * Updated the entire configuration.
     * **Note** Erases any changes made to the current configuration.
     * 
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
        ConfigurationHandler.config        = ConfigurationHandler.updatedConfig;
        ConfigurationHandler.updatedConfig = ConfigurationHandler.config;
    }

    /**
     * Gets the current value of a property of the configuration.
     * 
     * @param key The key of the property which should be returned. Must be given as _path_
     *            starting the root of the configuration. Each level must be seperated by a dot `.`.  
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
     * **Note** The update takes effect _after_ the call of the [[applyChanges]] method.
     * **Note** The user must ensure that the new value is of the right type in order
     * to perform the update.
     * 
     * @see [[Configuration]] See the configuration interface for the actual types of the values.
     * 
     * @param key The key of the property which should be updated/set. Must be given as _path_
     *            starting the root of the configuration. Each level must be seperated by a dot `.`.  
     *            _Example_: `gameSettings.verboseMode` would set the value of the property `verboseMode`
     *            inside the property `gameSettings` to a given value.
     * @param value The new value of the property. **Must be of the correct type**.
     */

     // TODO: MAKE GENERIC AND CHECK ON TYPE
    public static setProperty<T>(key: string, value: T): void  {
        ConfigurationHandler.updatedConfig = ConfigurationHandler.setPropertyRec<T>(ConfigurationHandler.updatedConfig, key, value);
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
    private static setPropertyRec<T>(config: any, key: string, value: T): any {
        const keys = key.split('.');
        if (keys.length === 1) {
            config[keys[0]] = value;
            return config;
        }
        config[keys[0]] = ConfigurationHandler.setPropertyRec(config[keys[0]], keys.slice(1).join('.'), value);
        return config;
    }   
}