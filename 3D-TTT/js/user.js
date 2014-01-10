var Demo = Demo || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player = function ( params ) {

    // this.context = context;

    this.myTurn = false;

    this.isHuman = false;

    this.name = "Player 1";

    this.uid = Demo.Util.generateUUID();

    this.hexColor = params.color.toString(16);  // red
    this.cssColor = "#FF0000";

    // this.hexColor = 0x00FF00;
    // this.cssColor = "#00FF00";

    // this.hexColor = 0x0000FF;
    // this.cssColor = "#0000FF";


};

Demo.Player.prototype = {

    /**
     * Initialize the camera object and create default cameras.
     */
    turn: function () {
        this.myTurn = !this.myTurn;
    },

    takeTurn: function () {
        // do turn logic

        //toggle turn
        this.turn();
    }
};
