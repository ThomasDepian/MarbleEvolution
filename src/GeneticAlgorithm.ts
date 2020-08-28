/**
 * @packageDocumentation
 * File providing helper utilities for the genetic algorithm.
 */

import { ConfigurationHandler } from './Configuration';
import { MarbleIndividual } from './MarbleIndividual';
import * as Utils from './Utils';

/**
 * List containing the individuals of the current iteration.
 */
let population: MarbleIndividual[];


/**
 * Initializes the algorithm.
 * 
 * @note Erases any previous population.
 * 
 * @category Genetic Algorithm
 * 
 * @param initialPopulation The intial population.
 */
export function initializeAlgorithm(initialPopulation: MarbleIndividual[] = []): void {
    population = initialPopulation;
    if (ConfigurationHandler.isVerboseMode()) {
        Utils.appendLineToVerboseConsole(`[GeneticAlgorithm]: Algorithm initialized; Population length: ${population.length}`);
    }
}

/**
 * Starts a new iteration.
 * @category Genetic Algorithm
 */
export function startIteration(): void {
    population.forEach(individual => individual.startIndividual());
    if (ConfigurationHandler.isVerboseMode()) {
        Utils.appendLineToVerboseConsole(`[GeneticAlgorithm]: New iteration started`);
    }
}

/**
 * Stops the current iteration and creates a new population.
 * 
 * @category Genetic Algorithm
 */
export function stopIteration(): void {
    population.forEach(individual => {
        individual.stop();
    });

    if (ConfigurationHandler.isVerboseMode()) {
        Utils.appendLineToVerboseConsole(`[GeneticAlgorithm]: Current iteration stopped`);
        population.forEach(individual => {
            Utils.appendLineToVerboseConsole(individual.toString());
        });
    }

    iterationFinished();
    
}

/**
 * Checks whether all individuals are stopped or not.
 * 
 * @category Genetic Algorithm
 * 
 * @returns Returns `true` if all individuals have stopped, else `false`.
 */
export function allStoped(): boolean {
    const stopped = population.map(inidividual => !inidividual.isMoving());
    return stopped.every(Boolean)
}

/**
 * Kills the entire population and removes it from the scene.
 *
 * **Use with care**.
 * 
 * @category Genetic Algorithm
 */
export function killAll(): void {
    population.forEach(individual => individual.destroy());
    population = [];
    if (ConfigurationHandler.isVerboseMode()) {
        Utils.appendLineToVerboseConsole(`[GeneticAlgorithm]: Entire population killed`);
    }
}

/**
 * Computes the average distance to the goal of the current population.
 * 
 * @category Genetic Algorithm
 * 
 * @returns Returns the average distance to the goal.
 */
export function computeAvgDistance(): number {
    const sum = population.map(i => i.distanceToGoal()).reduce((p, c) => p + c);
    return sum / population.length;
}

/**
 * Fetches the best (i.e. lowest) distance to the goal of the current population.
 * 
 * @category Genetic Algorithm
 * 
 * @returns Returnsthe best (i.e. lowest) to the goal.
 */
export function getBestDistance(): number {
    // destruct array into single values    
    return Math.min(...population.map(i => i.distanceToGoal()));
}


/**
 * Performs action needed to conclude an iteration.
 * 
 * Calls the fitness function for each individual and generates
 * based on the fitness values a new generation.
 * 
 * @see [[ConfigurationHandler]]: Please refer to the configuration class for limitations and probabilities that may
 * apply.
 * 
 * @category Genetic Algorithm
 */
function iterationFinished(): void {
    const fitnesValues = population.map(i => i.fitness());
    const populationCount = population.length;

    const newPopulation: MarbleIndividual[] = [];
    for (let i = 0; i < populationCount; i++) {
        const father = randomSelect(fitnesValues);
        const mother = randomSelect(fitnesValues);

        const child = father.reproduceWith(mother);

        if (Math.random() < ConfigurationHandler.getGeneticAlgorithm().mutationProbability.general) {
            child.mutate();
        }

        newPopulation.push(child);
    }

    killAll();

    population = newPopulation;
}

/**
 * Performs the random select of an individual for the reproduction.
 * 
 * The random select uses the fitness function of each individual to
 * select among the population one of the _fittest_ individuals.
 * 
 * The individual gets chosen according to the _Fitness proportionate selection_
 * also known as _roulette wheel selection_ algorithm (See the 
 * [Wikipedia article](https://en.wikipedia.org/wiki/Fitness_proportionate_selection)
 * for further details).
 * 
 * That means, that the individual with the highest fitness has the highest probability
 * that it will be chosen. Nevertheless, also a 'non-fit-individual' has a, of course small,
 * chance that it will be selected for reproduction.
 * 
 * @param fitnesValues List containing the fitness values of all individuals of the population.
 *                     The first value of the fitness list is the fitness value of the first
 *                     individual in the population, the second from the second and so forth.
 * 
 * @returns The individual which is chosen for reproduction.
 * 
 * @category Genetic Algorithm
 */
function randomSelect(fitnesValues: number[]): MarbleIndividual {
    const population_size = population.length;

    const sumFitnesValues = fitnesValues.reduce((previous, current, i, a) => {
        return previous + current
    });
    
    const cutOffs = fitnesValues.map(_ => 0.0);
    let previous_probability = 0.0;

    // compute the cutoff values
    // the cutoff values are ascending real values in the range between [0, 1)
    // the difference (i.e. range) between two cutoff values
    // cutoff[j+1] - cutoff[j] for j in [0, population_size-2] or
    // 1 - cutoff[j] for j = population_size-1 is proportional
    // to the fitness value of the individual j.
    for (let i = 0; i < population_size; i++) {
        cutOffs[i] = previous_probability + (fitnesValues[i] / sumFitnesValues);
        previous_probability = cutOffs[i];
    }
    
    const selection = Math.random();

    // choose individual based on selection
    for (let i = 0; i < population_size; i++) {
        if (selection < cutOffs[i]) {
            return population[i];
        }
    }
}