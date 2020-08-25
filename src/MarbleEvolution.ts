import * as Phaser from 'phaser';

/**
 * Class representing the game.
 */
export class MarbleEvolution extends Phaser.Game {
  readonly demoMode: boolean;
  constructor(config: Phaser.Types.Core.GameConfig, demoMode=false) {
    super(config);
    this.demoMode = demoMode;
  }
}