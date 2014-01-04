var Demo = Demo || {};
Demo.Manager = Demo.Manager || {};

Demo.Game.UserManager = function () {

  this.users = [];

};

Demo.Game.UserManager.prototype = {

  takeTurn: function () {

    // for two players
  if(users[0].myTurn){
      //take turn
    users[0].takeTurn();

  } else {
    users[1].takeTurn();
  }

};

