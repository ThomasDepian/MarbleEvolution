// cSpell:ignore uuidv
import { ConfigurationHandler } from './Configuration';
import { Goal } from './Goal';
import { Marble } from './Marble';
import * as Phaser from 'phaser';
import * as Utils from './Utils';
import { v4 as uuidv4 } from 'uuid';


/**
 * Class representing marble controlled by the genetic algorithm.
 * 
 * The 'DNA' of an individual consists of values for a
 * [[power]] and an [[angle]] property and is described using the interface
 * [[MarbleDNA]].
 * 
 * This class relies heavily on the implementations of the Marble class.
 * See the [[Marble]] class for further information.
 * 
 * The genetic algorithm is described using several methods tagged with 'Genetic Algorithm'.
 * Please refer to [[initializeAlgorithm]] as a starting point.
 * 
 * @see [[Configuration]]: Please refer to the configuration class for any limitations/settings which may apply.
 */
export class MarbleIndividual extends Marble {

    /**
     * Unique identifier to identify the individuals.
     * 
     * This is a uuidv4 128-bit number. See
     * [this article](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random))
     * for more information.
     * 
     * @readonly
     */
    private readonly id: string;


    /**
     * The DNA of the marble individual.
     * 
     * @readonly
     */
    private readonly dna: MarbleDNA;

    /**
     * The goal to which the individual should
     * try to find a way to.
     * 
     * @readonly
     */
    private readonly goal: Goal;

    /**
     * The name of the texture of the individual.
     * 
     * @note This property is only relevant for reproduction.
     * 
     * @readonly
     */
    private readonly textureName: string;

    /**
     * The diameter of the individual.
     * 
     * @note This property is only relevant for reproduction.
     * 
     * @readonly
     */
    private readonly diameter: number;


    
    /**
     * 
     * @param world       The world to which the individual belongs.
     * @param scene       The scene to which the individual belongs.
     * @param startPoint  Start point of the individual.
     * @param textureName The name of the texture. **Note**: Corresponding texture must be loaded _before_ the call.
     * @param diameter    Diameter of the individual. **Note**: Must be chosen such that the individual will not flow outside the game-screen.
     * @param goal        The goal to which the individual should try to find a way to.
     * @param dna         The DNA of the individual. If not present, a random DNA will be generated.
     */
    constructor (
        world:       Phaser.Physics.Matter.World,
        scene:       Phaser.Scene,
        startPoint:  Phaser.Geom.Point,
        textureName: string,
        diameter:    number,
        goal:        Goal,
        dna?:        MarbleDNA
    ){
        super(world, scene, startPoint, textureName, diameter);
        this.goal        = goal;
        this.textureName = textureName;
        this.diameter    = diameter;

        if (dna === undefined) {
            const power = Math.random() * 25;
            const angle = Math.random() * Math.PI;

            this.dna = {
                'power': power,
                'angle': angle
            }
        }else {
            this.dna  = dna;
        }

        // Disable collisions within the same group (i.e. under individuals)
        this.setCollisionGroup(-1);
        this.id = uuidv4();
        if (ConfigurationHandler.isVerboseMode()) {
            Utils.appendLineToVerboseConsole(`[${this.id}]: Individual created: ${JSON.stringify(this.dna)}`);
        }
    }

    /**
     * Starts the individual by calling the the start method
     * of the parent class using the values of the DNA as parameters.
     * 
     * @see [[Marble.start]] for further details.
     */
    public startIndividual(): void {
        this.start(this.dna.power, this.dna.angle);
    }

    /**
     * Computes the distance to the goal.
     * 
     * @see [[Marble.distanceTo]] for further details.
     * 
     * @returns Returns the distance to the goal.
     */
    public distanceToGoal(): number {
        return this.distanceTo(this.goal);
    }

    /**
     * Computes the fitness function of the individual.
     * 
     * The fitness function is currently computed using the reciprocal value of the distance to the
     * goal squared and is a real value in the closed range [0, 1].
     * 
     * @returns The fitness value of the individual.
     */
    public fitness(): number {
        const distance = super.distanceTo(this.goal);

        return 1 / Math.pow(distance, 2);
    }

    /**
     * Creates a new individual (child) based on the current individual (acting as father)
     * and an other individual (acting as mother).
     * 
     * The genes ('DNA') are mixed according to some probability.
     * @see [[Configuration]]: Please refer to the configuration class for limitations and probabilities that may apply.
     * 
     * @param mother The mother of the child.
     * 
     * @returns A new child.
     */
    public reproduceWith(mother: MarbleIndividual): MarbleIndividual {
        const fatherDNA = this.dna;
        const motherDNA = mother.dna;

        const childDNA = {
            'power': Math.random() < ConfigurationHandler.getGeneticAlgorithm().fatherGenesProbability.power ? fatherDNA.power : motherDNA.power,
            'angle': Math.random() < ConfigurationHandler.getGeneticAlgorithm().fatherGenesProbability.angle ? fatherDNA.angle : motherDNA.angle
        }

        const child = new MarbleIndividual(
            this.world,
            this.scene,
            this.startPosition,
            this.textureName,
            this.diameter,
            this.goal,
            childDNA,
        );

        if (ConfigurationHandler.isVerboseMode()) {
            Utils.appendLineToVerboseConsole(`[${this.id}]: Reproduced with ${mother.id} and created ${child.id}`);
        }

        return child;
    }


    /**
     * Mutates the individual.
     * 
     * A call of the mutation method **does not** guarantee
     * that a mutation will be performed.
     * 
     * Each property/characteristics of the 'DNA' will be mutated
     * with some probability and can alter in a given range.
     * 
     * @see [[Configuration]]: Please refer to the configuration class for the concrete probabilities and ranges.
     */
    public mutate(): void {
        /**
         * Helper function returning a random number in the range [lowerBound, upperBound], both included.
         */
        const randomNumber = function(lowerBound: number = 0, upperBound: number = 1): number {
            return Math.floor(Math.random() * (upperBound - lowerBound + 1) ) + lowerBound;
        }


        if (ConfigurationHandler.isVerboseMode()) {
            Utils.appendLineToVerboseConsole(`[${this.id}]: Mutates...`);
        }

        if (Math.random() < ConfigurationHandler.getGeneticAlgorithm().mutationProbability.power) {
            let power = this.dna.power;

            const powerRange = ConfigurationHandler.getGeneticAlgorithm().mutationRange.power;
            const change     = randomNumber(powerRange.lowerBound, powerRange.upperBound);
            power += change

            power = Math.max(0, power);
            power = Math.min(25, power);

            this.dna.power = power;

            if (ConfigurationHandler.isVerboseMode()) {
                Utils.appendToVerboseConsole(` ...power changes by ${change} from ${power - change} to ${power}`);
            }
        } 
        
        if (Math.random() < ConfigurationHandler.getGeneticAlgorithm().mutationProbability.angle) {
            let angle = this.dna.angle;

            const angleRange = ConfigurationHandler.getGeneticAlgorithm().mutationRange.angle;
            const change     = randomNumber(angleRange.lowerBound, angleRange.upperBound);
            angle += change;

            angle = Math.max(0, angle);
            angle = Math.min(Math.PI, angle);

            this.dna.angle = angle;

            if (ConfigurationHandler.isVerboseMode()) {
                Utils.appendToVerboseConsole(` ...angle changes by ${change} from ${angle - change} to ${angle}`);
            }
        } 
    }

    /**
     * Returns a string representation of an object.
     * 
     * @returns Returns the string representation.
     */
    public toString(): string {
        return `[${this.id}]: DNA: ${JSON.stringify(this.dna)}; Distance to goal: ${this.distanceToGoal()}`
    }
}



/**
 * Interface describing the DNA of an individual.
 */
export interface MarbleDNA {
    /**
     * The angle component of the DNA.
     */
    angle: number,

    /**
     * The power component of the DNA.
     */
    power: number
}