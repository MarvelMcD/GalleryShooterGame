
// Art assets from Kenny Assets:
// https://kenney.nl/assets/

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60 },   // ensure consistent timing across machines
    width: 800,
    height: 600,
    backgroundColor: '#30c4ff',
    scene: [Title, Level1]
    // scene: [SingleBullet, ArrayBullet, FixedArrayBullet, GroupBullet, ClassBullet, ArrayBoom]
}


const game = new Phaser.Game(config);