import { Marble } from './Marble';
import { Configuration } from './Configuration';
import * as Phaser from 'phaser';



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
     * Specifies wheter the initialization mode is active or not.
     */
    private initializationMode = false;

    /**
     * Reference to the marble.
     * 
     * @note Only for testing!!!
     */
    private marble: Marble;

    
    constructor() {
        super('main');
    }

    /**
     * Loads the needed assets, currently only image files,
     * **before** the game loads to ensure the assets are ready once
     * the game launces.
     */
    public preload(): void {
        this.load.image("marble", "assets/dot.png");
    }

    /**
     * Method called once the scene gets created.
     * Initizies the required properties in order to start a new game.
     */
    public create(): void {     
        
        // specifiy the world borders.
        // **Note** A 'thickness' of 70 is needed to ensure the 
        // marble does not fly through a border wall.
        this.matter.world.setBounds(0,0, 500, 500, 70, true, true, true, true);
        

        this.graphics = this.add.graphics();
        this.text = this.add.text(400, 470, "Power: xx.xx", {fontFamily: "'Lato', sans-serif", color: "#000", fontSize: "1rem"});
        this.text.visible = false;
        
    
        this.marble = new Marble(this.matter.world, this, Configuration.START_POSITION, "marble", Configuration.MARBLE_DIAMETER);
    
        this.input.on('pointerdown', this.handlePointerDown, this);
        
    }

    /**
     * Method for updating the screen.
     * Gets called FPS-times per second.
     */
    public update(): void {

        
        this.graphics.clear();
        if (this.initializationMode) {

            // Compute length between start point and mouse position and display
            // resulting power value.
            // **Note**: capped at 300
            // TODO: Make configurable
            const x1 = Configuration.START_POSITION.x;
            const x2 = this.game.input.activePointer.x;

            const y1 = Configuration.START_POSITION.y
            const y2 = this.game.input.activePointer.y;

            const length = Math.min(this.vectorToPointer().length(), 300);
            this.text.text = "Power: " + (length / 10).toFixed(2);

            // Draw the colored line displaying the start dirction of the marble
            // Color will be interpolated between green (0 power) and red (max power)
            const colorInter = Phaser.Display.Color.Interpolate.RGBWithRGB(0, 255, 0, 255, 0, 0, 300, length);
            const color = (colorInter.r << 16) + (colorInter.g << 8) + (colorInter.b);
            this.graphics.lineStyle(1, color);
            this.graphics.lineBetween(x1, y1, x2, y2);
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
     * The handler toggles the [[initializationMode]]. Depending on
     * the mode, either the [[marble]] gets reseted or the game
     * starts.
     */
    private handlePointerDown(): void {
        this.initializationMode = !this.initializationMode;

        if (this.initializationMode) {
            this.text.visible = true;
            this.marble.reset();
        } else {
            this.text.visible = false;
            this.startGame();
        }
    }

    /**
     * Sets up a vector pointing from a given startpoint to the current pointerposition (mostly the mouse).
     * 
     * @param startPoint Startpoint of the vector.
     * @returns The vector will be returned.
     */
    private vectorToPointer(startPoint: Phaser.Geom.Point = Configuration.START_POSITION): Phaser.Math.Vector2 {
        const mouseX = this.game.input.activePointer.x;
        const mouseY = this.game.input.activePointer.y;
        return new Phaser.Math.Vector2(mouseX - startPoint.x, mouseY - startPoint.y);
    }


    
}