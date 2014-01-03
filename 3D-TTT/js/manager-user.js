var Demo = Demo || {};
Demo.Manager = Demo.Manager || {};

Demo.Manager.User = function () {

  this.users = [];

};

Demo.Manager.User.prototype = {

  takeTurn: function () {

    // for two players
  if(users[0].myTurn){
      //take turn
    users[0].takeTurn();

  } else {
    users[1].takeTurn();
  }

};

