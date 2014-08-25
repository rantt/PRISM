var tileSize = 32;
var dRows = 20;
var dCols = 30;
var Game = {
  w: tileSize*dCols,
  h: tileSize*dRows 
};

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
		this.game.stage.backgroundColor = '#000';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
    this.game.load.bitmapFont('minecraftia','assets/fonts/font.png','assets/fonts/font.xml');
		// this.game.load.image('instructions', 'assets/images/instructions.png');
  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);
    
    this.game.load.spritesheet('player','assets/images/LD48player_Gray.png',32,64,8); 

    this.game.load.tilemap('hall','assets/worlds/hall.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('the_end','assets/worlds/end.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('blue','assets/worlds/blue.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('red','assets/worlds/red.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('yellow','assets/worlds/yellow.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('green','assets/worlds/green.json', null, Phaser.Tilemap.TILED_JSON);


    this.game.load.image('world_normal','assets/images/LD48world.png',32,32); 
    this.game.load.image('world_blue','assets/images/LD48world_blue.png',32,32); 
    this.game.load.image('world_red','assets/images/LD48world_red.png',32,32); 
    this.game.load.image('world_yellow','assets/images/LD48world_yellow.png',32,32); 
    this.game.load.image('world_green','assets/images/LD48world_green.png',32,32); 

    this.game.load.image('crystals','assets/images/LD48crystals.png',16,32); 
    this.game.load.image('avatar','assets/images/LD48player_5.png',32,64); 
    this.game.load.image('crystal_white','assets/images/LD48crystals_white.png',32,64);
    this.game.load.image('crystal_red','assets/images/LD48crystals_red.png',32,64);
    this.game.load.image('crystal_green','assets/images/LD48crystals_green.png',32,64);
    this.game.load.image('crystal_yellow','assets/images/LD48crystals_yellow.png',32,64);
    this.game.load.image('green_star','assets/images/LD48greenstar.png',64,64);

    this.game.load.audio('jump','assets/audio/jump.wav');
    this.game.load.audio('hit','assets/audio/hit.wav');
    this.game.load.audio('warp','assets/audio/warp.wav');
    this.game.load.audio('teleport','assets/audio/teleport.wav');
    
    // Music Track
    this.game.load.audio('music','assets/audio/LD48.m4a');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
