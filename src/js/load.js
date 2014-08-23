var Game = {
  w: 800,
  h: 600
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
    
    this.game.load.atlasXML('player','assets/images/player_sheet.png','assets/atlas/player_sheet.xml');
    this.game.load.tilemap('house','assets/levels/house.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('world_blue','assets/images/world_blue.png'); 

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
