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
var spaceKey;
var cursors;
var facing = 'right';
var deaths = 0;
var moveSpeed = 300;
var jumpVelocity = -300;

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
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.world = 'hall';
    // this.world = 'blue';

    this.crystals = this.game.add.group();
    this.crystals.enableBody = true;
    this.crystals.immovable = true;

    this.spikes = this.game.add.group();
    this.spikes.enableBody = true;

    this.loadWorld();

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
    this.game.physics.arcade.overlap(this.player, this.crystals, this.nextWorld, null, this);

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

    if (spaceKey.isDown && this.player.body.blocked.down) {
      this.player.body.velocity.y = jumpVelocity;
    }
    
    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  loadWorld: function() {
    this.crystals.callAll('kill'); 
    this.spikes.callAll('kill'); 
    if (this.layer) {
      this.layer.destroy();
    } 

    if (this.world === 'hall') {
      this.game.stage.backgroundColor = '#756D5A';
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_normal');
      this.map.addTilesetImage('crystals');
      this.map.setCollision(1);
      this.map.setCollision(3);
      this.map.setCollision(8);
      this.layer = this.map.createLayer('layer');

      // this.map.createFromObjects('objects',26, 'crystal_white', 0, true, false, this.crystals);
      this.map.createFromObjects('objects',30, 'crystal_white', 0, true, false, this.crystals);
      this.layer.resizeWorld();
    }else if (this.world === 'blue') {
		  this.game.stage.backgroundColor = '#5792F7'; //blue world
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_blue');
      this.map.addTilesetImage('crystals');
      this.map.setCollision(1);
      this.map.setCollision(3);
      this.map.setCollision(8);

      this.map.setTileIndexCallback([2,5,6,7], this.playerDead, this);
      this.layer = this.map.createLayer('layer');

      //You move faster and jump higher in the blue world
      jumpVelocity = -500;
      moveSpeed = 400;

      // this.map.createFromObjects('objects',26, 'crystal_white', 0, true, false, this.crystals);
      this.map.createFromObjects('objects', 28, 'crystal_red', 0, true, false, this.crystals);
      this.layer.resizeWorld();
      this.player.startx = 4750;
      this.player.starty = 480; 
      this.positionPlayer();
      // this.positionPlayer(4750,480);
    }else if (this.world === 'red') {
		  // this.game.stage.backgroundColor = '#BC0020'; //red world
		  // this.game.stage.backgroundColor = '#AE0010'; //red world
		  this.game.stage.backgroundColor = '#EF392B'; //red world
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_red');
      this.map.addTilesetImage('crystals');
      
      // this.map.setCollision(1);
      // this.map.setCollision(3);
      // this.map.setCollision(8);
      // this.map.setTileIndexCallback([2,5,6,7], this.playerDead, this);


      this.map.setCollision(2);
      this.map.setCollision(3);
      this.map.setCollision(5);
      this.map.setCollision(6);
      this.map.setCollision(7);
      this.map.setTileIndexCallback([1], this.playerDead, this);

      this.layer = this.map.createLayer('layer');

      //You move faster and jump higher in the blue world
      jumpVelocity = -500;
      moveSpeed = 400;

      // this.map.createFromObjects('objects',26, 'crystal_white', 0, true, false, this.crystals);
      this.map.createFromObjects('objects',29, 'crystal_yellow', 0, true, false, this.crystals);
      this.layer.resizeWorld();
      this.player.startx = 64;
      this.player.starty = 218; 
      this.positionPlayer();
      // this.positionPlayer(4750,480);

    }

    this.loadObjects();

  },
  positionPlayer: function() {
    this.player.reset(this.player.startx, this.player.starty);
    this.game.add.tween(this.player.scale).to({x:1, y:1}, 200).start();
    this.game.add.tween(this.player).to({angle:0},1).start();
  },
  playerDead: function() {
    deaths += 1;
    this.player.kill();
    this.positionPlayer();
  },
  loadObjects:  function() {
    this.crystals.forEach(function(c) {
      c.anchor.setTo(0.5,0.5);
      c.y += c.height/2;
      var t = this.game.add.tween(c).to({y: '-5'}, 400).to({y:'+5'}, 400);
      t.loop(true).start(); 
    },this);
  },
  nextWorld: function(player, crystal) {
    this.world = crystal.destination;

    console.log(this.world);

    var t = this.game.add.tween(this.player.scale).to({x:0, y:0}, 200).start();
    t.onComplete.add(this.loadWorld, this);
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
  render: function() {
    game.debug.text('Deaths: ' + deaths, 32, 32);
  }

};
