import { Game } from './../src/rpg.js';

describe('Game', function() {

  it('should output the players strength' , function() {
    var game = new Game();
    game.environment = "dark";
     var str = game.player.stats.strength;
     console.log(str);
     expect(game.abilities.punch.damage(game.player)).toEqual(str);
    // expect(arr.length).toEqual(9);
    // // expect(romanIn(1)).not.toEqual("X");
  });

  it('should output the players intelligence' , function() {
    var game = new Game();
    var str = game.player.stats.intelligence;
    console.log(str);
    expect(game.abilities.insult.damage(game.player)).toEqual(str);
    // expect(arr.length).toEqual(9);
    // // expect(romanIn(1)).not.toEqual("X");
  });

  it('should create an enemy', function() {
    var game = new Game();
    game.GenerateEnemy(4);
    console.log(game);
    expect(game.enemies.length).toEqual(1);

  });

  it('should lower some health', function() {
    var game = new Game();
    game.GenerateEnemy(4);
    game.CombatRound("punch")
    console.log(game);
    expect(game.player.current_health).not.toEqual(game.player.max_health);

  });
    it('should kill the enemy' , function(){
      var game = new Game();
      game.GenerateEnemy(4);
      game.player.stats.strength = 1000;
      game.CombatRound("punch")
      console.log(game);
      expect(game.player.current_health).toEqual(game.player.max_health);
    });

    it('should level up' , function(){
      var game = new Game();
      game.GenerateEnemy(4);
      game.player.stats.strength = 1000;
      game.player.experience = 1000;
      game.CombatRound("punch")
      console.log(game);
      expect(game.player.level).toEqual(2);
    });
    it('should kill the player' , function(){
      var game = new Game();
      game.GenerateEnemy(4);
      game.player.stats.luck = 1;
      game.enemies[0].stats.strength = 50000;
      game.CombatRound("compliment")
      console.log(game);
      expect(game.gameOver).toEqual(true);
    });
    it('should drop item after killing enemy' , function(){
      var game = new Game();
      game.CreateMod("intelligence","People",-1,'s');
      game.CreateMod("intelligence","Collector's",-1,'p');
      game.CreateMod("intelligence","Academic's",3,'p');
      game.CreateMod("strength","Crusty",5,'p');
      game.CreateMod("strength","Time",1,'s');
      game.CreateMod("strength","Karate",5,'s');
      game.CreateMod("strength","Gamer",-5,'s');
      game.CreateMod("intelligence","Fox News",-5,'s');
      console.log(game.CreateDrop());
      console.log(game);
      expect(game.player.inventory.length).toEqual(1);
    });
    it('damage enemy with magazine throw' , function(){
      var game = new Game();
      game.CreateMod("intelligence","People",-1,'s');
      game.CreateMod("intelligence","Collector's",-1,'p');
      game.CreateMod("intelligence","Academic's",3,'p');
      game.CreateMod("strength","Crusty",5,'p');
      game.CreateMod("strength","Time",1,'s');
      game.CreateMod("strength","Karate",5,'s');
      game.CreateMod("strength","Gamer",-5,'s');
      game.CreateMod("intelligence","Fox News",-5,'s');
      console.log(game.CreateDrop());
      game.GenerateEnemy(4);
      console.log(game);
      expect(game.abilities.throw.damage(game.player)).not.toEqual(0);
    });

    it('should not damage enemy with magazine throw' , function(){
      var game = new Game();
      game.CreateMod("intelligence","People",-1,'s');
      game.CreateMod("intelligence","Collector's",-1,'p');
      game.CreateMod("intelligence","Academic's",3,'p');
      game.CreateMod("strength","Crusty",5,'p');
      game.CreateMod("strength","Time",1,'s');
      game.CreateMod("strength","Karate",5,'s');
      game.CreateMod("strength","Gamer",-5,'s');
      game.CreateMod("intelligence","Fox News",-5,'s');
      game.GenerateEnemy(4);

      console.log(game);
      expect(game.abilities.throw.damage(game.player)).toEqual(0);
    });
    it('should create a boss enemy with "tweet" ' , function(){
      var game = new Game();
      game.CreateMod("intelligence","People",-1,'s');
      game.CreateMod("intelligence","Collector's",-1,'p');
      game.CreateMod("intelligence","Academic's",3,'p');
      game.CreateMod("strength","Crusty",5,'p');
      game.CreateMod("strength","Time",1,'s');
      game.CreateMod("strength","Karate",5,'s');
      game.CreateMod("strength","Gamer",-5,'s');
      game.CreateMod("intelligence","Fox News",-5,'s');
      game.CreateBoss(1,"45");
      var hp = game.bosses[0].health;
      game.combatBoss("punch");

      console.log(game);
      expect(game.bosses[0].health).not.toEqual(hp);
    });
});
