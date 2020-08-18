import { Coordinate } from './Coordinate';
import { MarbleIndividual, MarbleDNA } from './MarbleIndividual';
import { Obstacle } from './Obstacle';
import { Goal } from './Goal';
import { Marble } from './Marble';
import { ConfigurationHandler, Configuration } from './Configuration';
import * as Phaser from 'phaser';
import { initializeGeneticAlgorithm, iterationCount, startIteration, allStoped, stopIteration, killAll } from './GeneticAlgorithm';
import * as YAML from 'yaml'


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
     * @note Only referenced if human mode is enabled
     */
    private goal: Goal;

    /**
     * Reference to the marble.
     * 
     * @note Only referenced if human mode is enabled
     */
    private marble: Marble;



    private initializeConfig: boolean;
    private levelNumber: number;
    private verboseConsole: HTMLElement;














    // TODO: REFACTOR

    /**
     * Specifies wheter the initialization mode is active or not.
     */
    private initializationMode = false;

    /**
     * Specifies whether the AI has started acting.
     * 
     * @note Only for testing!!!
     */
    private AIStarted = false;
    
    
    /**
     * Specifies whether a new iteration should be started.
     * 
     * @note Only for testing!!!
     */
    private newIteration = false;
    
    /**
     * Specifies whether the AI has launched or not.
     * 
     * @note Only for testing!!!
     */
    private launched = false;





    
    constructor() {
        super('main');
        this.initializeEventListeners();

    }

    /**
     * Loads the needed assets, currently only image files,
     * **before** the game loads to ensure the assets are ready once
     * the game launces.
     */
    public preload(): void {
        const marbleSkinPath     = 'assets/dot.png';
        const goalSkinPath       = 'assets/goal.png';
        const obstacleSkinPath   = 'assets/obstacle.png';
        const individualSkinPath = 'assets/dot.png';
        const configPath         = 'config/default.yaml';

        this.load.image("marble",       marbleSkinPath);
        this.load.image("goal",         goalSkinPath);
        this.load.image("obstacle",     obstacleSkinPath);
        this.load.image("individual",   individualSkinPath);
        this.load.text("configuration", configPath);
        
    }

    public init({initializeConfig = true, levelNumber = 0}: {initializeConfig: boolean, levelNumber: number}) {
        this.initializeConfig = initializeConfig;
        this.levelNumber = levelNumber;
    }

    /**
     * Performs any work needed for initializing the [[ConfigurationHandler]].
     * 
     * **Must only be called once**
     */
    private initializeConfiguration() {
        console.log('initializeConfiguration');
        
        const yamlText = this.cache.text.get('configuration');
        const yamlJSON = YAML.parse(yamlText);
        ConfigurationHandler.updateConfig(<Configuration>yamlJSON);
    }

    /**
     * Performs any operation needed to initialize the physics engine.
     */
    private initializePhysics() {
        // specifiy the world borders.
        // **Note** A 'thickness' of 70 is needed to ensure the 
        // marble does not fly through a border wall.
        this.matter.world.setBounds(0,0, +this.game.config.width, +this.game.config.height, 70, true, true, true, true);
    }

    /**
     * Creates the level.
     * 
     * @param levelNumber The number of the level. **Must be specified in the configuration.**
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
            initializeGeneticAlgorithm(initialPopulation);
        }

    }

    /**
     * Intitializes the texts and graphics. Only needed if `humanMode = true`
     */
    private initializeText() {
        this.graphics = this.add.graphics();
        this.text = this.add.text(400, 470, "Power: xx.xx", {fontFamily: "'Lato', sans-serif", color: "#000", fontSize: "1rem"});
        this.text.visible = false;      
    }

    /**
     * Intitializes all handler functions
     */
    // TODO: Anonymus function
    private initializeHandlers() {
        if (ConfigurationHandler.isHumanMode()) {
            this.input.on('pointerdown', this.handlePointerDown, this);
            this.input.on('pointerup', this.handlePointerUp, this);
        } else {
            this.input.on('pointerup', this.startAI, this);
        }
    }

    private fillHTMLWithConfiguration() {
        (<HTMLInputElement>document.getElementById('human-mode')).checked = ConfigurationHandler.isHumanMode();
        (<HTMLInputElement>document.getElementById('verbose-mode')).checked = ConfigurationHandler.isVerboseMode();

        const visible = 'block';
        const hidden  = 'none';
        document.querySelectorAll('.configuration.ai').forEach(e => {
            (<HTMLElement>e).style.display = ConfigurationHandler.isHumanMode() ? hidden : visible;
        });

        document.getElementById('verbose-console-wrapper').style.display = ConfigurationHandler.isVerboseMode() ? visible : hidden;
    }

    private updateConfiguartionFromHTML() {
        ConfigurationHandler.setProperty('gameSettings.humanMode', (<HTMLInputElement>document.getElementById('human-mode')).checked);
        ConfigurationHandler.setProperty('gameSettings.verboseMode', (<HTMLInputElement>document.getElementById('verbose-mode')).checked);
    }

    private initializeEventListeners(): void {
        // Start button
        document.getElementById('start-button').addEventListener('click', (e: Event) => this.handleStart());

        document.getElementById('human-mode').addEventListener('click', (e: Event) => this.toggleConfiguration());

        document.getElementById('verbose-mode').addEventListener('click', (e: Event) => {
            const visible = 'block';
            const hidden  = 'none';
            const element = document.getElementById('verbose-console-wrapper');

            element.style.display = element.style.display === visible ? hidden : visible;
        });
        
    }

    /**
     * Method called once the scene gets created.
     * Initizies the required properties in order to start a new game.
     */
    public create(): void {     
        
        // ON LEVEL CHANGE
        // this.scene.restart()
        // THIS CALLS a init() method
        
        if (this.initializeConfig) {
            this.initializeConfiguration();
        }

        this.verboseConsole = document.getElementById('verbose-console');

        if (ConfigurationHandler.isVerboseMode()) {
            this.verboseConsole.textContent = 'Verbose mode enabled...\n';
        } else {
            this.verboseConsole.textContent = 'Verbose mode disabled...\nPlease restart the game in verbose mode to see the output..\n';
        }
        

        
        this.initializePhysics();

        this.fillHTMLWithConfiguration();
        this.initializeHandlers();

        if (ConfigurationHandler.isHumanMode()) {
            this.initializeText();
        }
        
        this.createLevel();
    }

    /**
     * Method for updating the screen.
     * Gets called FPS-times per second.
     */
    public update(): void {
        
        if (ConfigurationHandler.isHumanMode()) {
            
            
            this.graphics.clear();
            if (this.initializationMode) {

                // Compute length between start point and mouse position and display
                // resulting power value.
                // **Note**: capped at 300
                // TODO: Make configurable
                const x1 = ConfigurationHandler.getLevel().marble.position.x;
                const x2 = this.game.input.activePointer.x;

                const y1 = ConfigurationHandler.getLevel().marble.position.y
                const y2 = this.game.input.activePointer.y;

                const length = Math.min(this.vectorToPointer().length(), 250);
                this.text.text = "Power: " + (length / 10).toFixed(2);

                // Draw the colored line displaying the start dirction of the marble
                // Color will be interpolated between green (0 power) and red (max power)
                const colorInter = Phaser.Display.Color.Interpolate.RGBWithRGB(0, 255, 0, 255, 0, 0, 250, length);
                const color = (colorInter.r << 16) + (colorInter.g << 8) + (colorInter.b);
                this.graphics.lineStyle(1, color);
                this.graphics.lineBetween(x1, y1, x2, y2);

                
            }

            // Set texts
            // document.getElementById('moving').textContent     = (this.marble.isMoving() ? 'moving' : 'standing');
            // document.getElementById('touching').textContent   = (this.marble.isTouching(this.goal) ? 'touches' : 'touches not');
            // document.getElementById('difference').textContent = this.marble.distanceTo(this.goal).toFixed(2);
        } else {
            if (this.newIteration) {
                this.newIteration = false;
                console.log('Iteration ' + iterationCount);
                // this.verboseConsole.textContent += "hallo"
                startIteration();
                this.AIStarted = true;
            } else if(this.AIStarted) {
                if (allStoped()) {
                    this.AIStarted = false;
                    stopIteration();
                    this.newIteration = true;
                }
            }
        }
    }

    /**
     * Starts the game.
     * 
     * @note Currently launches only the [[marble]].
     * @note Will change in future versions.
     */
    private startGame(): void {
        const power = this.vectorToPointer().length() / 10;
        const unitVectorX = new Phaser.Math.Vector2(1, 0).normalize();
        const unitVectorMouse = this.vectorToPointer().normalize();
        const angle = Math.acos(unitVectorMouse.dot(unitVectorX));
        
        this.marble.start(power, angle);
    }


    /**
     * Handles the pointer (mostly mouse) down event for the main scene.
     * The handler activates the [[initializationMode]].
     */
    private handlePointerDown(): void {
        this.initializationMode = true;
        
        this.text.visible = true;
        this.marble.reset();
    }

    /**
     * Handles the pointer (mostly mouse) up event for the main scene.
     * The handler deactivates the [[initializationMode]] and starts the
     * game.
     */
    private handlePointerUp(): void {
        this.initializationMode = false;
        this.text.visible = false;
        this.startGame();
    }

    /**
     * Sets up a vector pointing from a given startpoint to the current pointerposition (mostly the mouse).
     * 
     * @param startPoint Startpoint of the vector.
     * @returns The vector will be returned.
     */
    private vectorToPointer(startPoint: Phaser.Geom.Point = Coordinate.of(ConfigurationHandler.getLevel().marble.position).toPoint()): Phaser.Math.Vector2 {
        const mouseX = this.game.input.activePointer.x;
        const mouseY = this.game.input.activePointer.y;
        return new Phaser.Math.Vector2(mouseX - startPoint.x, mouseY - startPoint.y);
    }

     /**
     * Handles the pointer (mostly mouse) up event for the main scene - in AI mode.
     */
    private startAI(): void {
        if (this.launched) {
            this.newIteration = false;
            this.AIStarted = false;
            this.launched = false;
            killAll();
        } else {
            this.newIteration = true;
            this.launched = true;
        }
       
    }


    private handleStart() {
        this.updateConfiguartionFromHTML();
        ConfigurationHandler.applyChanges();
        this.scene.restart({initializeConfig: false});
    }

    private toggleConfiguration() {
        const toggleVisibility = function(domElement: any) {            
            const visible = 'block';
            const hidden  = 'none';

            domElement.style.display = domElement.style.display === visible ? hidden : visible;
        }

        document.querySelectorAll('.configuration').forEach(e => toggleVisibility(<HTMLElement>e));



    }
}