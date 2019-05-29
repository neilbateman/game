import { Game } from './rpg.js';
import $ from 'jquery';

var game = new Game();
$(document).ready(function(){
  game.CreateMod("intelligence","People",-1,'s');
  game.CreateMod("intelligence","Collector's",-1,'p');
  game.CreateMod("intelligence","Academic's",3,'p');
  game.CreateMod("strength","Crusty",5,'p');
  game.CreateMod("strength","Time",1,'s');
  game.CreateMod("strength","Karate",5,'s');
  game.CreateMod("strength","Gamer",-5,'s');
  game.CreateMod("intelligence","Fox News",-5,'s');
  });
