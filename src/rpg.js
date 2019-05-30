export class Game{
  constructor(){
  this.gameOver = false;
  this.prefix = [];
  this.suffix = [];
  this.environment = "light";
  this.player = {};
  this.enemies = [];
  this.bosses = [];
  this.player.inventory = [];
  //this.player.location = [];
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

  GenerateEnemy(level){
    this.enemies.push({
      stats : {strength : Math.floor((Math.random()*(6*level))+11), intelligence : Math.floor((Math.random()*(6*level))+11) },
      abilities : ["punch"],
      health : Math.floor((Math.random()*(4*level))+30)
    });
  }

  CombatRound(action){
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

  combatBoss(action){
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



CreateMod (type, name, value, PorS){
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

CreateDrop (){
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

UseMagazine (action){
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
CreateBoss (level, name, abilities){
  this.bosses.push({
    name: name,
    stats : {strength : Math.floor((Math.random()*(6*level))+11), intelligence : 1 },
    abilities : abilities,
    health : Math.floor((Math.random()*(100*level))+500)
  });
}
}
var game = new Game();
game.CreateMod("intelligence","People",-1,'s');
game.CreateMod("intelligence","Collector's",-1,'p');
game.CreateMod("intelligence","Academic's",3,'p');
game.CreateMod("strength","Crusty",5,'p');
game.CreateMod("strength","Time",1,'s');
game.CreateMod("strength","Karate",5,'s');
game.CreateMod("strength","Gamer",-5,'s');
game.CreateMod("intelligence","Fox News",-5,'s');
game.CreateBoss(1, "MyPillow Michael", ["insult"]);
game.CreateBoss(2, "Wavy Kanye", ["insult"]);
game.CreateBoss(3, "Billionare Betsy", ["insult"]);
game.CreateBoss(4, "Turtle McConnell", ["insult"]);
game.CreateBoss(5, "Chad Kavanaugh", ["insult"]);
game.CreateBoss(6, "Keebler Elf Sessions", ["insult"]);
game.CreateBoss(7, "Don Jr.", ["insult"]);
game.CreateBoss(8, "Rascist Barbie", ["insult"]);
game.CreateBoss(9, "Fox and Friends", ["insult","rouse the elders"]);
game.CreateBoss(10, "45", ["tweet","insult"]);
