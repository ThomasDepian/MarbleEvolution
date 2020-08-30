// cSpell:ignore CHECKBOX
/**
 * @packageDocumentation
 * File providing several utilities needed in several parts of the game, but mostly in [[Main]].
 */
import { Coordinate } from './Coordinate';
import { ConfigurationHandler, Configuration } from './Configuration';
import * as YAML from 'yaml'

// General settings
const PRECISION = 4;

// HTML Elements -------------------------------------------------------------
const HTML_CHECKBOX_HUMAN_MODE           = <HTMLInputElement>document.getElementById('human-mode'); 
const HTML_CHECKBOX_VERBOSE_MODE         = <HTMLInputElement>document.getElementById('verbose-mode'); 
const HTML_INPUT_INDIVIDUAL_COUNT        = <HTMLInputElement>document.getElementById('individual-count')
const HTML_INPUT_MUTATION_GENERAL        = <HTMLInputElement>document.getElementById('general-mutation-probability')
const HTML_INPUT_MUTATION_POWER          = <HTMLInputElement>document.getElementById('power-mutation-probability')
const HTML_INPUT_MUTATION_ANGLE          = <HTMLInputElement>document.getElementById('angle-mutation-probability')
const HTML_INPUT_FATHER_POWER            = <HTMLInputElement>document.getElementById('father-genes-power')
const HTML_INPUT_FATHER_ANGLE            = <HTMLInputElement>document.getElementById('father-genes-angle')
const HTML_INPUT_POWER_RANGE_LOWER       = <HTMLInputElement>document.getElementById('power-mutation-range-lower');
const HTML_INPUT_POWER_RANGE_UPPER       = <HTMLInputElement>document.getElementById('power-mutation-range-upper');
const HTML_INPUT_ANGLE_RANGE_LOWER       = <HTMLInputElement>document.getElementById('angle-mutation-range-lower');
const HTML_INPUT_ANGLE_RANGE_UPPER       = <HTMLInputElement>document.getElementById('angle-mutation-range-upper');
const HTML_TEXT_LEVEL_NAME               = document.getElementById('levelName');
const HTML_VERBOSE_CONSOLE               = document.getElementById('verbose-console');
const HTML_VERBOSE_CONSOLE_WRAPPER       = document.getElementById('verbose-console-wrapper');
const HTML_BUTTON_START                  = document.getElementById('start-button');
const HTML_TEXT_HUMAN_TRY_COUNT          = document.getElementById('try-number');
const HTML_TEXT_AI_ITERATION_COUNT       = document.getElementById('iteration-number');
const HTML_TEXT_HUMAN_DISTANCE           = document.getElementById('human-distance');
const HTML_TEXT_HUMAN_CURRENT_BEST       = document.getElementById('human-current-best');
const HTML_TEXT_AI_AVERAGE_DISTANCE      = document.getElementById('distance-avg-last-iteration');
const HTML_TEXT_AI_BEST_DISTANCE_LAST    = document.getElementById('distance-best-last-iteration');
const HTML_TEXT_AI_BEST_DISTANCE_OVERALL = document.getElementById('distance-best-overall');
const HTML_TAG_HUMAN_MODE                = document.getElementById('human-mode-tag');
const HTML_TAG_VERBOSE_CONSOLE_DISABLED  = document.getElementById('verbose-console-disabled-tag');


// HTML selectors -----------------------------------------------------------
const HTML_SELECTOR_CLASS_AI_CONFIGURATION = '.configuration.ai'
const HTML_SELECTOR_CLASS_CONFIGURATION    = '.configuration'
const HTML_SELECTOR_ID_CONSOLE_WRAPPER     = 'verbose-console-wrapper';
const HTML_SELECTOR_ID_STATS_HUMAN         = 'stats-human-mode';
const HTML_SELECTOR_ID_STATS_AI            = 'stats-ai-mode';
const HTML_SELECTOR_TAG_NUMBER_INPUT       = 'input[type=number]';

// CSS Styles
const CSS_STYLE_HIDDEN  = 'none';
const CSS_STYLE_VISIBLE = ''; 

// Other variables -----------------------------------------------------------
/**
 * Holds the number of tries/iterations performed.
 * 
 * If the human mode is enabled, the number corresponds to the tries made
 * by the human player, if the human mode is disabled, the number
 * corresponds to the population-iteration of the genetic algorithm.
 */
let iterationCounter: number;

/**
 * Holds the best distance to the goal in the human mode.
 * 
 * @note The lower the distance is, the better.
 */
let humanBestDistance: number;

/**
 * Holds the best distance to the goal in the ai mode.
 * (i.e. not in human mode - performed by the genetic algorithm).
 * 
 * @note The lower the distance is, the better.
 */
let aiBestDistance: number;

/**
 * The scenes to which the utils belongs.
 * 
 * @note From the official documentation of Phaser.Scenes.ScenePlugin:
 *       <blockquote style="border-left: 4px solid #CCC; padding-left: 8px; ">
 *          A reference to the Scene Manager Plugin. This property will only be available if defined in the Scene Injection Map.
 *       </blockquote>
 */
let scenes: Phaser.Scenes.ScenePlugin


/**
 * Sets the scenes. 
 * 
 * @note **Must be called before referencing to the scenes.**
 * 
 * @param newScenes The new scenes.
 * 
 * @category General utils
 */
export function setScenes(newScenes: Phaser.Scenes.ScenePlugin): void {
    scenes = newScenes;
}

/**
 * Writes the given text to the verbose console.
 * 
 * @note **Erases any previous text**.
 * 
 * @param text Text which should be written to the console.
 * 
 * @category General utils
 */
export function writeToVerboseConsole(text: string): void {
    HTML_VERBOSE_CONSOLE.textContent = text;
}

/**
 * Appends the given text to the verbose console.
 * 
 * @param text Text which should be appended to the console.
 * 
 * @category General utils
 */
export function appendToVerboseConsole(text: string): void {
    HTML_VERBOSE_CONSOLE.textContent += text;
}

/**
 * Appends the given text in a new line to the verbose console.
 * 
 * @param text Text which should be appended to the console.
 * 
 * @category General utils
 */
export function appendLineToVerboseConsole(text: string): void {
    appendToVerboseConsole('\n' + text);
}

/**
 * Performs any work needed for initializing the [[ConfigurationHandler]].
 * 
 * @param configText The content of the configuration.
 * 
 * @note **Must only be called once**.
 * 
 * @category General utils
 */
export function initializeConfiguration(configText: string): void {
    const yamlJSON = YAML.parse(configText);
    ConfigurationHandler.updateConfig(<Configuration>yamlJSON);
}

/**
 * Fills the HTML-elements with the configuration values.
 * 
 * @category General utils
 */
export function fillHTMLWithConfiguration() {
    // Settings/Configuration
    HTML_CHECKBOX_HUMAN_MODE.checked   =  ConfigurationHandler.isHumanMode();
    HTML_CHECKBOX_VERBOSE_MODE.checked =  ConfigurationHandler.isVerboseMode();
    HTML_INPUT_INDIVIDUAL_COUNT.value  =  ConfigurationHandler.getGeneticAlgorithm().individualCount.toString();
    HTML_INPUT_MUTATION_GENERAL.value  = (ConfigurationHandler.getGeneticAlgorithm().mutationProbability.general * 100).toFixed(PRECISION);
    HTML_INPUT_MUTATION_POWER.value    = (ConfigurationHandler.getGeneticAlgorithm().mutationProbability.power * 100).toFixed(PRECISION);
    HTML_INPUT_MUTATION_ANGLE.value    = (ConfigurationHandler.getGeneticAlgorithm().mutationProbability.angle * 100).toFixed(PRECISION);
    HTML_INPUT_FATHER_POWER.value      = (ConfigurationHandler.getGeneticAlgorithm().fatherGenesProbability.power * 100).toFixed(PRECISION);
    HTML_INPUT_FATHER_ANGLE.value      = (ConfigurationHandler.getGeneticAlgorithm().fatherGenesProbability.angle * 100).toFixed(PRECISION);
    HTML_INPUT_POWER_RANGE_LOWER.value =  ConfigurationHandler.getGeneticAlgorithm().mutationRange.power.lowerBound.toString();  
    HTML_INPUT_POWER_RANGE_UPPER.value =  ConfigurationHandler.getGeneticAlgorithm().mutationRange.power.upperBound.toString();
    HTML_INPUT_ANGLE_RANGE_LOWER.value =  ConfigurationHandler.getGeneticAlgorithm().mutationRange.angle.lowerBound.toString();
    HTML_INPUT_ANGLE_RANGE_UPPER.value =  ConfigurationHandler.getGeneticAlgorithm().mutationRange.angle.upperBound.toString();
  
    // Level name
    HTML_TEXT_LEVEL_NAME.textContent = ConfigurationHandler.getLevel().name;

    // Show/Hide AI configuration based on settings
    document.querySelectorAll(HTML_SELECTOR_CLASS_AI_CONFIGURATION).forEach(e => {
        (<HTMLElement>e).style.display = ConfigurationHandler.isHumanMode() ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;
    });

    // Show/Hide human mode tag based on settings
    HTML_TAG_HUMAN_MODE.style.display = ConfigurationHandler.isHumanMode() ? CSS_STYLE_VISIBLE : CSS_STYLE_HIDDEN;

    // Show/Hide console based on settings
    document.getElementById(HTML_SELECTOR_ID_CONSOLE_WRAPPER).style.display = ConfigurationHandler.isVerboseMode() ? CSS_STYLE_VISIBLE : CSS_STYLE_HIDDEN;
    HTML_TAG_VERBOSE_CONSOLE_DISABLED.style.display = ConfigurationHandler.isVerboseMode() ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;

    // Show/Hide stats based on mode
    document.getElementById(HTML_SELECTOR_ID_STATS_HUMAN).style.display = ConfigurationHandler.isHumanMode() ? CSS_STYLE_VISIBLE : CSS_STYLE_HIDDEN;
    document.getElementById(HTML_SELECTOR_ID_STATS_AI).style.display    = ConfigurationHandler.isHumanMode() ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;

    if (ConfigurationHandler.isVerboseMode()) {
        appendLineToVerboseConsole(`[Utils]: HTML inputs filled`);
    }
}

/**
 * Updates the configuration handler with the new values from the HTML input elements.
 * 
 * @category General utils
 */
export function updateConfigurationFromHTML(): void {
    ConfigurationHandler.setProperty('gameSettings.humanMode',                          HTML_CHECKBOX_HUMAN_MODE.checked);
    ConfigurationHandler.setProperty('gameSettings.verboseMode',                        HTML_CHECKBOX_VERBOSE_MODE.checked);
    ConfigurationHandler.setProperty('geneticAlgorithm.individualCount',                HTML_INPUT_INDIVIDUAL_COUNT.valueAsNumber);
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationProbability.general',    convertToPercentage(HTML_INPUT_MUTATION_GENERAL.valueAsNumber));
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationProbability.power',      convertToPercentage(HTML_INPUT_MUTATION_POWER.valueAsNumber));
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationProbability.angle',      convertToPercentage(HTML_INPUT_MUTATION_ANGLE.valueAsNumber));
    ConfigurationHandler.setProperty('geneticAlgorithm.fatherGenesProbability.power',   convertToPercentage(HTML_INPUT_FATHER_POWER.valueAsNumber));
    ConfigurationHandler.setProperty('geneticAlgorithm.fatherGenesProbability.angle',   convertToPercentage(HTML_INPUT_FATHER_ANGLE.valueAsNumber));
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationRange.power.lowerBound', HTML_INPUT_POWER_RANGE_LOWER.valueAsNumber);
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationRange.power.upperBound', HTML_INPUT_POWER_RANGE_UPPER.valueAsNumber);
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationRange.angle.lowerBound', HTML_INPUT_ANGLE_RANGE_LOWER.valueAsNumber);
    ConfigurationHandler.setProperty('geneticAlgorithm.mutationRange.angle.upperBound', HTML_INPUT_ANGLE_RANGE_UPPER.valueAsNumber);
}

/**
 * Initializes all event listeners.
 * 
 * @note **Must only be called once** otherwise the game breaks.
 * 
 * @category General utils
 */
export function initializeEventListeners(): void {    
    // Start button
    document.getElementById('configuration-form').addEventListener('submit', _ => {
        updateConfigurationFromHTML();
        ConfigurationHandler.applyChanges();
        scenes.restart({initializeConfig: false});
    });

    // Inputs
    document.querySelectorAll(HTML_SELECTOR_TAG_NUMBER_INPUT).forEach((e) => {
        const element = <HTMLInputElement>e;
        const label = element.parentNode.parentNode.lastElementChild
        
        element.addEventListener('blur', _ => {
            if (element.checkValidity()) {
                label.classList.remove('has-text-danger');
            } else {
                label.classList.add('has-text-danger');
            }
        });
    });

    HTML_CHECKBOX_HUMAN_MODE.addEventListener('click', _ => {
        document.querySelectorAll(HTML_SELECTOR_CLASS_CONFIGURATION).forEach(e => {
            const element = <HTMLElement>e;
            element.style.display = element.style.display === CSS_STYLE_VISIBLE ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;
        });
    });
    HTML_CHECKBOX_VERBOSE_MODE.addEventListener('click', _ => {
        HTML_VERBOSE_CONSOLE_WRAPPER.style.display = HTML_VERBOSE_CONSOLE_WRAPPER.style.display === CSS_STYLE_VISIBLE ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;
        HTML_TAG_VERBOSE_CONSOLE_DISABLED.style.display = HTML_TAG_VERBOSE_CONSOLE_DISABLED.style.display === CSS_STYLE_VISIBLE ? CSS_STYLE_HIDDEN : CSS_STYLE_VISIBLE;
    });  
}

/**
 * Sets up a vector pointing from a given start point to the current pointer position (mostly the mouse).
 * 
 * @param pointer    The pointer which is currently active.
 * @param startPoint Start point of the vector.
 * 
 * @returns Returns the created vector.
 * 
 * @category General utils
 */
export function vectorToPointer(pointer: Phaser.Input.Pointer, startPoint: Phaser.Geom.Point = Coordinate.of(ConfigurationHandler.getLevel().marble.position).toPoint()): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(pointer.x - startPoint.x, pointer.y - startPoint.y);
}

/**
 * Updates the [[iterationCounter]] and all relevant HTMLElements to the updated iteration count.
 * 
 * @param iterationDelta The delta by which the iteration count should increase/decrease.
 * 
 * @category General utils
 */
export function updateIterationCount(iterationDelta: number = 1): void {
    iterationCounter += iterationDelta
    if (ConfigurationHandler.isHumanMode()) {
        HTML_TEXT_HUMAN_TRY_COUNT.textContent    = iterationCounter.toString();
    } else {
        HTML_TEXT_AI_ITERATION_COUNT.textContent = iterationCounter.toString();
    }
}

/**
 * Performs any actions needed to restart a new game (i.e. resets all variables).
 * 
 * @category General utils
 */
export function resetForNewGame(): void {
    iterationCounter  = 0;
    humanBestDistance = Infinity;
    aiBestDistance    = Infinity;
}


/**
 * Updates the necessary HTMLElements with the new distance.
 * 
 * @param newDistance New distance in pixels.
 * @param final If `true` the [[humanBestDistance]] will also be updated, if necessary, else not.
 *              Should only be `true` if the marble has stopped.
 * 
 * @category General utils
 */
export function updateHumanDistance(newDistance: number, final: boolean = false): void {
    HTML_TEXT_HUMAN_DISTANCE.textContent = newDistance.toFixed(PRECISION);

    if (final && newDistance < humanBestDistance) {
        humanBestDistance = newDistance;
        HTML_TEXT_HUMAN_CURRENT_BEST.textContent = newDistance.toFixed(PRECISION);
    }   
}

/**
 * Updates the necessary HTMLElements with the new distance.
 * **Note**: Must only be called once the current iteration has come to a complete stop.
 * 
 * @param averageDistance Number holding the average distance to the goal
 *                        of the population of the last iteration.
 * @param bestDistance    Number holding the best distance to the goal
 *                        of the population of the last iteration.
 * 
 * @category General utils
 */
export function updateAIDistance(averageDistance: number, bestDistance: number): void {
    HTML_TEXT_AI_AVERAGE_DISTANCE.textContent   = averageDistance.toFixed(PRECISION);

    HTML_TEXT_AI_BEST_DISTANCE_LAST.textContent = bestDistance.toFixed(PRECISION);

    if (bestDistance < aiBestDistance) {
        aiBestDistance = bestDistance;
        HTML_TEXT_AI_BEST_DISTANCE_OVERALL.textContent = bestDistance.toFixed(PRECISION);
    }   
}


/**
 * Converts a given value in the range from 0 to 100 to a percentage value
 * used in the configuration (range 0 to 1) with a given precision.
 * 
 * @param value The value which should be converted to a percentage value. **Must be between 0 and 100.** 
 * @param precision The precision of the percentage (i.e. how many places after the decimal point).
 * 
 * @category General utils
 */
function convertToPercentage(value: number, precision=4): number {
    const percentageValue = value / 100;
    const percentageRounded = percentageValue.toFixed(precision);
    return +percentageRounded
}
