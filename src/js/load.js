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
		this.game.stage.backgroundColor = '#FFF';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
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
    
    this.game.load.spritesheet('player','assets/images/LD48player_Gray.png',64,64,9); 
    this.game.load.tilemap('hall','assets/worlds/hall.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('blue','assets/worlds/blue.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('red','assets/worlds/red.json', null, Phaser.Tilemap.TILED_JSON);
    // this.game.load.tilemap('yellow','assets/worlds/yellow.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('world_normal','assets/images/LD48world.png',32,32); 
    this.game.load.image('crystals','assets/images/LD48crystals.png',16,32); 
    this.game.load.image('world_blue','assets/images/LD48world_blue.png',32,32); 
    this.game.load.image('world_red','assets/images/LD48world_red.png',32,32); 
    this.game.load.image('crystal_white','assets/images/LD48crystals_white.png',32,64);
    this.game.load.image('crystal_red','assets/images/LD48crystals_red.png',32,64);
    this.game.load.image('crystal_green','assets/images/LD48crystals_green.png',32,64);
    this.game.load.image('crystal_yellow','assets/images/LD48crystals_yellow.png',32,64);
    
    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
