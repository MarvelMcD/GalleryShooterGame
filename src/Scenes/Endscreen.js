class Endscreen extends Phaser.Scene {
    constructor() {
        super("endscreen");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }
    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/2 - 50, "rocketSquare", "Game\n Over", 50).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "rocketSquare", "Press Q to start", 32).setOrigin(0.5);
        this.resetGame = this.input.keyboard.addKey("Q");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.resetGame)) {
            this.scene.start("level1");
        }
    }
}