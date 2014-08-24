/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var cursors;
var facing = 'right';
var moveSpeed = 300;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.ARCADE);
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    cursors = this.game.input.keyboard.createCursorKeys();

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.loadLevel();

    // this.player = this.game.add.sprite(Game.w/2,Game.h/2,'player');
    this.player = this.game.add.sprite(64,584,'player'); //Bottom Left Corner of first map
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('right',[3,5,3,7],10,true);
    this.player.animations.add('left',[4,6,4,8],10,true);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.arcade.TILE_BIAS = 32;
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    // this.game.camera.follow(this.player);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
 
  },

  update: function() {

    this.game.physics.arcade.collide(this.player, this.layer);

    this.player.body.velocity.x = 0;
    if(cursors.left.isDown || aKey.isDown) {
      this.player.body.velocity.x = -moveSpeed;
      if (facing !== 'left') {
        this.player.animations.play('left');
        facing = 'left';
      }
    }else if (cursors.right.isDown || dKey.isDown) {
      this.player.body.velocity.x = moveSpeed;
      if (facing !== 'right') {
        this.player.animations.play('right');
        facing = 'right';
      }
    }
    else {
      if (facing !== 'idle')
      {
        this.player.animations.stop();
        if (facing === 'left') {
          this.player.frame = 2;
        }else{
          this.player.frame = 1;
        }
        facing = 'idle';
      }
    }
    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  loadLevel: function() {
    
		this.game.stage.backgroundColor = '#5792F7';
    this.map = this.game.add.tilemap('house');
    this.map.addTilesetImage('tiles','world_blue');
    this.map.setCollision(1);
    this.map.setCollision(3);
    this.map.setCollision(8);
    this.layer = this.map.createLayer('layer');
    this.layer.resizeWorld();

  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
