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
var teleportCD = 0;
var mobSpeed = 100;

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

    // this.spikes = this.game.add.group();
    // this.spikes.enableBody = true;

    this.mobs = this.game.add.group();
    this.mobs.enableBody = true;

    this.labels = this.game.add.group(); 

    this.loadWorld();

    // this.player = this.game.add.sprite(Game.w/2,Game.h/2,'player');
    this.player = this.game.add.sprite(64,584,'player'); //Bottom Left Corner of first map
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('right',[1,2,1,3],10,true);
    this.player.animations.add('left',[5,6,5,7],10,true);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.arcade.TILE_BIAS = 32;
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
 
  },

  update: function() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.overlap(this.player, this.crystals, this.nextWorld, null, this);
    this.game.physics.arcade.overlap(this.mobs, this.layer, this.mobBounce, null, this);
    this.game.physics.arcade.overlap(this.mobs, this.player, this.playerDead, null, this);

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
          this.player.frame = 4;
        }else{
          this.player.frame = 0;
        }
        facing = 'idle';
      }
    }

    if (this.world === 'yellow') {
      if ((this.game.input.activePointer.isDown) && (this.game.time.now - teleportCD > 0)) {
        this.player.x = this.game.input.activePointer.worldX;
        this.player.y = this.game.input.activePointer.worldY;
        this.game.camera.y = this.player.y-500;
        teleportCD = this.game.time.now + 700;
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
    this.mobs.callAll('kill');
    // this.spikes.callAll('kill'); 
    if (this.labels) {
      this.labels.forEach(function(l){
        l.message.destroy();
        l.destroy();
      }, this);
    }

    // this.positionPlayer();
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
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);
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
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);
      this.layer.resizeWorld();
      this.player.startx = 4750;
      this.player.starty = 480; 
      this.positionPlayer();
    }else if (this.world === 'red') {
      //Everything Safe is Dangerous Everything Dangerous is Safe!
		  this.game.stage.backgroundColor = '#EF392B'; //red world
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_red');
      this.map.addTilesetImage('crystals');

      //Switch Collision and Callback Tiles...mwahahaha
      this.map.setCollision(2);
      this.map.setCollision(3);
      this.map.setCollision(5);
      this.map.setCollision(6);
      this.map.setCollision(7);
      this.map.setTileIndexCallback([1], this.playerDead, this);

      this.map.createFromObjects('objects',29, 'crystal_yellow', 0, true, false, this.crystals);
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);

      this.layer = this.map.createLayer('layer');

      this.layer.resizeWorld();
      this.player.startx = 64;
      this.player.starty = 218; 
      this.positionPlayer();

    }else if (this.world == 'yellow') {
      //Teleportation
		  this.game.stage.backgroundColor = '#FFF499'; //yellow world
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_yellow');
      this.map.addTilesetImage('crystals');

      this.map.setCollision(1);
      this.map.setCollision(3);
      this.map.setCollision(8);

      this.map.setTileIndexCallback([2,5,6,7], this.playerDead, this);

      this.map.createFromObjects('objects',27, 'crystal_green', 0, true, false, this.crystals);
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);

      this.layer = this.map.createLayer('layer');

      this.layer.resizeWorld();
      this.player.startx = 128;
      this.player.starty = 3808; 
      this.positionPlayer();


    }else if (this.world == 'green') {
      //You move faster and jump higher in the blue world
      jumpVelocity = -500;
      moveSpeed = 400;
		  this.game.stage.backgroundColor = '#00EC9C'; //green world
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_green');
      this.map.addTilesetImage('crystals');

      this.map.setCollision(1);
      this.map.setCollision(3);
      this.map.setCollision(8);

      this.map.setTileIndexCallback([2,5,6,7], this.playerDead, this);

      this.map.createFromObjects('objects',30, 'crystal_white', 0, true, false, this.crystals);
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);
      this.map.createFromObjects('objects',33, 'green_star', 0, true, false, this.mobs);

      this.layer = this.map.createLayer('layer');

      this.layer.resizeWorld();
      this.player.startx = 550;
      this.player.starty = 500; 
      this.positionPlayer();
    }else if (this.world == 'the_end') {
      // this.player = this.game.add.sprite(64,584,'player'); //Bottom Left Corner of first map
      this.game.add.image(800,480,'avatar'); 
      this.game.stage.backgroundColor = '#756D5A';
      this.map = this.game.add.tilemap(this.world);
      this.map.addTilesetImage('world_normal');
      this.map.addTilesetImage('avatar');
      this.map.addTilesetImage('crystals');

      this.map.setCollision(1);
      this.map.setCollision(3);
      this.map.setCollision(8);

      this.map.setTileIndexCallback([2,5,6,7], this.playerDead, this);

      this.map.createFromObjects('objects',30, 'crystal_white', 0, true, false, this.crystals);
      this.map.createFromObjects('objects', 31, '', 0, true, false, this.labels);

      this.layer = this.map.createLayer('layer');

      this.layer.resizeWorld();
      this.player.startx = 64;
      this.player.starty = 560; 
      this.positionPlayer();
    
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

    this.labels.forEach(function(l){
      l.message = this.game.add.bitmapText(l.x, l.y, 'minecraftia', l.text, 21);
      l.message.x -= l.message.textWidth/2;
      l.message.y = l.y;
      l.message.alive = true;
    }, this);

    this.mobs.forEach(function(z){
      z.body.velocity.x = mobSpeed;
      z.direction = 1;
    }, this);

  },
  mobBounce: function(mob, layer) {
    if (mob.direction < 0) {
      mob.body.velocity.x = mobSpeed;
    }else {
      mob.body.velocity.x = -mobSpeed;
    }
    mob.direction = mob.direction * -1;
  },
  nextWorld: function(player, crystal) {
    this.world = crystal.destination;


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
    // game.debug.text('Pointerx: ' + this.game.input.activePointer.x, 64, 32);
    // game.debug.text('Pointery: ' + this.game.input.activePointer.y, 96, 32);
  }

};
