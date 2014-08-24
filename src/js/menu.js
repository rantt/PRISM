/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

        this.title = this.game.add.sprite(Game.w/2-75,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);

        // Start Message
        this.game.add.bitmapText(Game.w/2-175, Game.h/2+50, 'minecraftia', 'Click to Start', 21);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
