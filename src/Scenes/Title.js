class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }
    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/2 - 50, "rocketSquare", "Plane Gallery Shooter\n Game", 50).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "rocketSquare", "Press E to start", 32).setOrigin(0.5);
        this.start = this.input.keyboard.addKey("E");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            this.scene.start("level1");
        }
    }
}