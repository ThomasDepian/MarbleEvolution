import { HumanModeState, AIModeState } from './States';
import { Coordinate } from './Coordinate';
import { MarbleIndividual, MarbleDNA } from './MarbleIndividual';
import { Obstacle } from './Obstacle';
import { Goal } from './Goal';
import { Marble } from './Marble';
import { ConfigurationHandler, Configuration } from './Configuration';
import * as Phaser from 'phaser';
import * as Utils from './Utils'
import * as GeneticAlgorithm from './GeneticAlgorithm'


/**
 * Main scene of the game.
 */
export class Main extends Phaser.Scene {

    /**
     * Reference to the added graphics object for drawing the 
     * line between the starting point of the marble and the
     * mouse poition during the _initialization_ phase of the marble.
     */
    private graphics: Phaser.GameObjects.Graphics;
    /**
     * Reference to the added text object for displaying the current
     * power during the _initialization_ phase of the marble.
     */
    private text: Phaser.GameObjects.Text;

    /**
     * Reference to the goal.
     * 
     * @note Only referenced if human mode is enabled.
     */
    private goal: Goal;

    /**
     * Reference to the marble.
     * 
     * @note Only referenced if human mode is enabled.
     */
    private marble: Marble;

    /**
     * Specifies whether the configuration should be initialized
     * (i. e. read from the disk) or not.
     */
    private initializeConfig: boolean;

    /**
     * Holds the current levelnumber.
     */
    private levelNumber: number;

    /**
     * Holds the current state of the game, if the human mode is enabled.
     * 
     * @note Only relevenat if human mode is enabled.
     */
    private humanModeState: HumanModeState;

    /**
     * Holds the current state of the game, if the human mode is disabled.
     * That means if the genetic algorithm controls the game.
     * 
     * @note Only relevenat if human mode is disabled.
     */
    private aiModeState: AIModeState;



    constructor() {
        super('main');
        Utils.initializeEventListeners();        
    }


    /**
     * Loads the needed assets, currently only image files,
     * **before** the game loads to ensure the assets are ready once
     * the game launces.
     * 
     * @note The `preload()` method gets called **before** the `init()` method.
     * 
     * @category Phaser
     */
    public preload(): void {
        const marbleSkinPath     = 'assets/dot.png';
        const goalSkinPath       = 'assets/goal.png';
        const obstacleSkinPath   = 'assets/obstacle.png';
        const individualSkinPath = 'assets/dot.png';
        const configPath         = 'config/config.yaml';

        this.load.image("marble",       marbleSkinPath);
        this.load.image("goal",         goalSkinPath);
        this.load.image("obstacle",     obstacleSkinPath);
        this.load.image("individual",   individualSkinPath);
        this.load.text("configuration", configPath);
    }


    /**
     * Init method for initializing the scene.
     * 
     * @note The `init()` method gets called **after** `preload()` but **before** `create()`.
     * 
     * @param param0 Parameter describing the current/changed configuration of the scene
     *               since the last restart.
     * 
     * @category Phaser
     */
    public init({initializeConfig = true, levelNumber = 0}: {initializeConfig: boolean, levelNumber: number}): void {
        this.initializeConfig = initializeConfig;
        this.levelNumber = levelNumber;
    }


    /**
     * Method called once the scene gets created.
     * Initizies the required properties in order to start a new game.
     * 
     * @note The `create()` method gets called **after** `create()`.
     * 
     * @category Phaser
     */
    public create(): void {   
        
        Utils.setScenes(this.scene);

        if (this.initializeConfig) {
            Utils.initializeConfiguration(this.cache.text.get('configuration'));
        }

        if (ConfigurationHandler.isVerboseMode()) {
            Utils.writeToVerboseConsole('Verbose mode enabled...');
        } else {
            Utils.writeToVerboseConsole('Verbose mode disabled...');
            Utils.appendLineToVerboseConsole('Please restart the game in verbose mode to see the output...');
        }

        // specifiy the world borders.
        // **Note** A 'thickness' of 70 is needed to ensure the 
        // marble does not fly through a border wall.
        this.matter.world.setBounds(0,0, +this.game.config.width, +this.game.config.height, 70, true, true, true, true);

        Utils.fillHTMLWithConfiguration();
        this.initializeHandlers();
        this.initializeText();
        Utils.resetForNewGame();
        this.humanModeState = HumanModeState.Inactive;
        this.aiModeState    = AIModeState.Inactive;
        
        this.createLevel(this.levelNumber);
    }

    /**
     * Method for updating the screen.
     * Gets called FPS-times per second.
     * 
     * @category Phaser
     */
    public update(): void {        
        if (ConfigurationHandler.isHumanMode()) {
            this.graphics.clear();

            if (this.humanModeState == HumanModeState.InitializationPhase) {
                const currentPower =  Math.min(Utils.vectorToPointer(this.input.activePointer).length(), 250);

                this.text.text = "Power: " + (currentPower / 10).toFixed(2);

                // Draw the colored line displaying the start dirction of the marble
                // Color will be interpolated between green (0 power) and red (max power)
                const colorInter = Phaser.Display.Color.Interpolate.RGBWithRGB(0, 255, 0, 255, 0, 0, 250, currentPower);
                const color = (colorInter.r << 16) + (colorInter.g << 8) + (colorInter.b);
                this.graphics.lineStyle(1, color);

                const x1 = ConfigurationHandler.getLevel().marble.position.x;
                const x2 = this.game.input.activePointer.x;

                const y1 = ConfigurationHandler.getLevel().marble.position.y
                const y2 = this.game.input.activePointer.y;

                this.graphics.lineBetween(x1, y1, x2, y2);
            } else if(this.humanModeState == HumanModeState.Launched) {
                const currentDistance = this.marble.distanceTo(this.goal);
                const marbleMoving    = this.marble.isMoving();
                
                Utils.updateHumanDistance(currentDistance, !marbleMoving);
        
                if(!marbleMoving) {
                    this.humanModeState = HumanModeState.Stopped;
                    this.marble.reset();
                }
            }
        } else {
            if (this.aiModeState == AIModeState.NewIterationReady) {
                GeneticAlgorithm.startIteration();
                Utils.updateIterationCount();
                this.aiModeState = AIModeState.Launched;
            } else if(this.aiModeState == AIModeState.Launched) {
                if (GeneticAlgorithm.allStoped()) {
                    Utils.updateAIDistance(GeneticAlgorithm.computeAvgDistance(), GeneticAlgorithm.getBestDistance());
                    GeneticAlgorithm.stopIteration();
                    this.aiModeState = AIModeState.NewIterationReady;
                }
            }
        }
    }


    /**
     * Creates the level.
     * 
     * @param levelNumber The number of the level. **The level must exist and be specified in the configuration**.
     * 
     * @category Scene utils
     */
    private createLevel(levelNumber: number = 0) {
        const level          = ConfigurationHandler.getLevel(levelNumber);
        
        // skins
        const marbleSkin     = "marble";
        const goalSkin       = "goal";
        const obstacleSkin   = "obstacle";
        const individualSkin = "individual";

        // obstacles
        const obstacles = level.obstacles;
        obstacles.forEach(o => {
            new Obstacle(this.matter.world, this, Coordinate.of(o.position).toPoint(), obstacleSkin, o.size.width, o.size.height);
        })

        // goal
        const goal = new Goal(this, Coordinate.of(level.goal.position).toPoint(), goalSkin, level.goal.diameter);

        // marbles
        if (ConfigurationHandler.isHumanMode()) {
            this.marble = new Marble(this.matter.world, this, Coordinate.of(level.marble.position).toPoint(), marbleSkin, level.marble.diameter);
            this.goal   = goal;
        } else {
            const individualCount= ConfigurationHandler.getGeneticAlgorithm().individualCount;
            const initialPopulation: MarbleIndividual[] = []
            for (let i = 0; i < individualCount; i++) {
                initialPopulation.push(new MarbleIndividual(this.matter.world, this, Coordinate.of(level.marble.position).toPoint(), individualSkin, level.marble.diameter, goal));
            }
            GeneticAlgorithm.initializeAlgorithm(initialPopulation);
        }

    }

    /**
     * Intitializes the texts and graphics. Only needed if `humanMode = true`.
     * 
     * @category Scene utils
     */
    private initializeText(): void {
        this.graphics = this.add.graphics();
        this.text = this.add.text(400, 470, "Power: xx.xx", {fontFamily: "'Lato', sans-serif", color: "#000", fontSize: "1rem"});
        this.text.visible = false;      
    }

    /**
     * Intitializes all handler functions
     * 
     * @category Scene utils
     */
    private initializeHandlers() {
        if (ConfigurationHandler.isHumanMode()) {
            this.input.on('pointerdown', function() {
                if (this.humanModeState == HumanModeState.Inactive || this.humanModeState == HumanModeState.Stopped) {
                    this.humanModeState = HumanModeState.InitializationPhase;
                    this.text.visible   = true;
                }
            }, this);
            
        } 
        
        this.input.on('pointerup', function() {
            if (ConfigurationHandler.isHumanMode()) {
                if(this.humanModeState == HumanModeState.InitializationPhase) {
                    this.text.visible   = false;
                    this.humanModeState = HumanModeState.Launched;
                    Utils.updateIterationCount();

                    const power           = Utils.vectorToPointer(this.input.activePointer).length() / 10;
                    const unitVectorX     = new Phaser.Math.Vector2(1, 0).normalize();
                    const unitVectorMouse = Utils.vectorToPointer(this.input.activePointer).normalize();
                    const angle           = Math.acos(unitVectorMouse.dot(unitVectorX));
                    this.marble.start(power, angle);
                }
            } else {                
                if (this.aiModeState == AIModeState.Inactive) {
                    this.aiModeState = AIModeState.NewIterationReady;
                }
            }
        }, this);
    }
  

    
}