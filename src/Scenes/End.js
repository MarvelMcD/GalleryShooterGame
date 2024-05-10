class End extends Phaser.Scene {
    constructor() {
        super("end");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }
    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/2 - 50, "rocketSquare", "Game\n Over", 50).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "rocketSquare", "Press R to start", 32).setOrigin(0.5);
        this.reset = this.input.keyboard.addKey("R");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.reset)) {
            this.scene.start("level1");
        }
    }
}