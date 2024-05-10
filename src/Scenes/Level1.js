class Level1 extends Phaser.Scene {
    curve;
    path;

    constructor() {
        super("level1");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 8;           // Don't create more than this many bullets
        
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerP", "playerP.png");
        this.load.image("bullet", "bullet.png");
        this.load.image("enemyD", "enemyD.png");

        // For animation
        this.load.image("ex0", "ex0.png");
        this.load.image("ex1", "ex1.png");
        this.load.image("ex2", "ex2.png");
        this.load.image("ex3", "ex3.png");
        this.load.image("ex4", "ex4.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("boom", "boom.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.playerP = this.add.sprite(game.config.width/2, game.config.height - 40, "playerP");
        my.sprite.playerP.setScale(2);

        my.sprite.enemyD = this.add.sprite(game.config.width/2, 80, "enemyD");
        my.sprite.enemyD.setScale(3);
        my.sprite.enemyD.scorePoints = 5;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create explosion animation
        
        this.anims.create({
            key: "ex",
            frames: [
                //{ key: "ex0" },
                { key: "ex1" },
                { key: "ex2" },
                { key: "ex3" },
                // { key: "ex4" },
            ],
            frameRate: 10,    // Note: case sensitive (thank you Ivy!)
            repeat: 0,
            hideOnComplete: true
        });
        // points to follow
        this.points1 = [
            60, 50,
            740, 50,
            60, 100,
            740, 100,
            60, 150,
            740, 150,
            60, 200,
            740, 200,
            60, 250,
            740, 250,
            60, 300,
            740, 300,
            60, 350,
            740, 350,
            60, 400,
            740, 400,
            60, 450,
            740, 450,
            60, 500,
            740, 500,
        ];
        this.curve1 = new Phaser.Curves.Spline(this.points1);

        // my.sprite.enemyD = this.add.follower(this.curve, 10, 10, "enemyD");

        my.sprite.e1 = this.add.follower(this.curve1, 60, 50, "enemyD");
        my.sprite.e1.setScale(3);
        my.sprite.e1.scorePoints = 5;
        my.sprite.e1.startFollow({
            duration: 20000, // Duration of movement in milliseconds
            yoyo: true, // Move back and forth along the path
            repeat: 0, // Repeat indefinitely
            // ease: 'Sine.easeInOut',
            rotateToPath: true, // Rotate the sprite to match the path direction
            // rotationOffset: -90 // Adjust rotation offset if needed
            rotationOffset: 90
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.menu = this.input.keyboard.addKey("M");
        this.restart = this.input.keyboard.addKey("R");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 8;
        this.bulletSpeed = 6;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level 1</h2><br>A: left // D: right // Space: fire'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        // Put title on screen
        this.add.text(10, 5, "Score over 100 for next level", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.playerP.x > (my.sprite.playerP.displayWidth/2)) {
                my.sprite.playerP.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.playerP.x < (game.config.width - (my.sprite.playerP.displayWidth/2))) {
                my.sprite.playerP.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.playerP.x, my.sprite.playerP.y-(my.sprite.playerP.displayHeight/2), "bullet")
                );
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Check for collision with the hippo
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.enemyD, bullet)) {
                // start animation
                this.ex = this.add.sprite(my.sprite.enemyD.x, my.sprite.enemyD.y, "ex1").setScale(4).play("ex");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemyD.visible = false;
                my.sprite.enemyD.x = -100;
                // Update score
                this.myScore += my.sprite.enemyD.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("boom", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new Enemy Drone appear after end of animation
                this.ex.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemyD.visible = true;
                    this.my.sprite.enemyD.x = Math.random()*config.width;
                }, this);
            }
            if (this.collides(my.sprite.e1, bullet)) {
                // start animation
                this.ex = this.add.sprite(my.sprite.e1.x, my.sprite.e1.y, "ex1").setScale(4).play("ex");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.e1.visible = false;
                my.sprite.e1.x = -100;
                // Update score
                this.myScore += my.sprite.e1.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("boom", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new Enemy Drone appear after end of animation
                this.ex.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.e1.visible = true;
                    this.my.sprite.e1.x = Math.random()*config.width;
                }, this);
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
        //     this.scene.start("fixedArrayBullet");
        // }
        if (Phaser.Input.Keyboard.JustDown(this.menu)) {
            this.scene.start("title");
        }
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            // this.myScore = 0;
            this.scene.restart("level1");
            this.myScore = 0;
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

}
         