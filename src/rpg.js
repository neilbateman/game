export function Game(){
  this.gameOver = false;
  this.prefix = [];
  this.suffix = [];
  this.environment = "light";
  this.player = {};
  this.enemies = [];
  this.bosses = [];
  this.player.inventory = [];
  this.player.location = [];
  this.player.level = 1;
  this.player.experience = 0;
  this.player.stats = {strength : Math.floor((Math.random()*10)+1), intelligence : Math.floor((Math.random()*10)+1), luck : Math.floor((Math.random()*10)+1)}
  this.player.max_health = (this.player.stats.strength * 8) + 50;
  this.player.current_health = this.player.max_health;
  this.abilities = {punch : {
    name : "punch", type : "damage",
    damage : function(player){
      return player.stats.strength;
    }},

                  compliment : {
                  name : "compliment", type: "effect", effect : function(player){
                    let luck = Math.floor(Math.random()*10000) % (1000 - player.stats.luck);
                    console.log(luck);
                    let luckNeeded = 5;
                    if(this.environment == "light"){
                      luckNeeded = 10;
                    }
                    if(luck < luckNeeded){
                      return true;
                    }else{
                      return false;
                    }
                  }},
                   insult : {
                    name : "insult", type : "damage", damage : function(player) {
                      return player.stats.intelligence;
                    }
                  },
                  throw : {
                    name: "throw", type: "damage", damage : function(player){
                      if(player.inventory.length === 0){
                        return 0;

                      }else{
                        let magAttack = player.stats.strength;
                        console.log(player.inventory)
                        if(player.inventory[0].name.includes("Fox")){
                          magAttack *= 5;
                         }
                         player.inventory.pop();
                         return magAttack;
                      }
                  }
                },
                  tweet : {
                    name : "tweet", type : "effect", effect : function(player){
                      player.health += 45;
                      console.log("Fake news!");
                    }
                  }
    }
  }

  Game.prototype.GenerateEnemy = function(level){
    this.enemies.push({
      stats : {strength : Math.floor((Math.random()*(6*level))+11), intelligence : Math.floor((Math.random()*(6*level))+11) },
      abilities : ["punch"],
      health : Math.floor((Math.random()*(4*level))+30)
    });
  }

  Game.prototype.CombatRound = function(action){
    if(this.abilities[action].type == "damage"){
      this.enemies[0].health -= this.abilities.punch.damage(this.player);
    }
    else{
      if(action =="compliment") {
        if(this.abilities.compliment.effect(this.player) == true){
          this.enemies[0].health = 0;
        }
      }
    }
    if(this.enemies[0].health > 0){
      this.player.current_health -= this.abilities.punch.damage(this.enemies[0]);
    }else{
      this.player.experience += this.enemies[0].stats.intelligence;
      if(this.player.experience > (this.player.level * 10) * (this.player.level * 10)){
        this.player.level = this.player.level+=1;
        this.player.stats.strength += Math.floor((Math.random()*3)+4);
        this.player.stats.intelligence += Math.floor((Math.random()*3)+4);
        this.player.stats.luck += Math.floor((Math.random()*3)+4);
        this.player.max_health += (this.player.stats.strength * 8);
        this.player.current_health = this.player.max_health;
        this.player.experience = 0;
      }
      this.CreateDrop();
      this.enemies.pop();
    }

    if(this.player.current_health <= 0){
      this.gameOver = true;
    }
  }

  Game.prototype.combatBoss = function(action){
    if(this.abilities[action].type == "damage"){
      this.bosses[0].health -= this.abilities.punch.damage(this.player);
    }
    else{
      if(action =="compliment") {
        if(this.abilities.compliment.effect(this.player) == true){
          this.bosses[0].health = 45;
        }
      }
      }
    if(this.bosses[0].health > 0){
      let bossAbility = this.abilities[this.bosses[0].abilities[0]];
      if(bossAbility.type === "effect")
      {
        if(bossAbility.name === "tweet"){
          this.abilities.tweet.effect(this.bosses[0]);
        }
      }
    }else{
      this.player.experience += this.enemies[0].stats.intelligence;
      if(this.player.experience > (this.player.level * 10) * (this.player.level * 10)){
        this.player.level = this.player.level+=1;
        this.player.stats.strength += Math.floor((Math.random()*3)+4);
        this.player.stats.intelligence += Math.floor((Math.random()*3)+4);
        this.player.stats.luck += Math.floor((Math.random()*3)+4);
        this.player.max_health += (this.player.stats.strength * 8);
        this.player.current_health = this.player.max_health;
        this.player.experience = 0;
      }
      this.CreateDrop();
      this.bosses.pop();
    }

    if(this.player.current_health <= 0){
      this.gameOver = true;
    }
  }



Game.prototype.CreateMod = function(type, name, value, PorS){
  let item = {};
  item.type = type;
  item.name = name;
  item.value = value;
  if(PorS == 'p'){
    this.prefix.push(item);
  }else{
    this.suffix.push(item);
  }
}

Game.prototype.CreateDrop = function(){
  let item = {strength : 0, intelligence: 0};
  let index ="";
  let itemNum = Math.floor(Math.random()* 10000)+1;
  if(itemNum % (this.prefix.length * 2) < this.prefix.length) {
    console.log("Prefix" + itemNum % (this.prefix.length * 2));
    index += this.prefix[itemNum % (this.prefix.length * 2)].name + " ";
    item[this.prefix.type] += this.prefix.value;
  }
  if(itemNum % (this.suffix.length * 2) < this.suffix.length) {
    console.log("Suffix" + itemNum % (this.suffix.length * 2));
    index += this.suffix[itemNum % (this.suffix.length * 2)].name  + " ";
    item[this.suffix.type] += this.suffix.value;
}
index+= "Magazine";
item.name = index;
this.player.inventory.push(item);
return index;
}

Game.prototype.UseMagazine = function(action){
//read = add appropriate amount of intelligence or strength
//eat = recover player hp

if(action == "read"){
  this.player.stats.intelligence += this.player.inventory[0].intelligence;
  this.player.stats.strength += this.player.inventory[0].strength;
}
if(action =="eat"){
  if(this.player.inventory[0].name.includes("Fox") == false){
    this.player.max_health +=1;
    this.player.current_health = this.player.max_health;
  }

}
}
Game.prototype.CreateBoss = function(level, name){
  this.bosses.push({
    name: name,
    stats : {strength : Math.floor((Math.random()*(6*level))+11), intelligence : 1 },
    abilities : ["tweet"],
    health : Math.floor((Math.random()*(100*level))+500)
  });
}
