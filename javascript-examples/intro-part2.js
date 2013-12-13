
function demo() {

    // JAVASCRIPT HOISTING - FUNCTION LEVEL, NOT BLOCK LEVEL

    debugger;

    // "global variable"
    var testVar = "I'm a global";

    function example( )
    {
      alert(testVar);  //what does this line alert?

     /*local variable with same name as the global
        declared outside the function
     */

      var testVar = "I'm a local var";
      alert(testVar);  // what does this line alert?
    }

    example();

    debugger;

    // OBJECT LITERAL
    var Person = {
      lastName: "Staples",
      firstName: "Joshua",
      doWork: function () {
        alert("doing work");
      },
      driveCar: function () {
        alert("driving car");
      }
    };

    Person.driveCar();


    // CLOSURE
    function who(ln, fn) {
      var lastName = ln;
      var firstName = fn;

      var getFullName = function () {
        alert(firstName + " " + lastName);
      };

      return getFullName;
    }

    var bar = who("Staples", "Joshua"); // bar is now a closure.

    debugger;

    bar();


    debugger;
    // OBJECT CONSTRUCTOR
    var Developer = function (params) {

      this.lastName = params.ln;
      this.firstName = params.fn;
      this.hasCar = false;

      this.computers = {
                          "mac": false,
                          "linux": true,
                          "windows": true
      };
    };

    debugger;

    // OBJECT PROTOTYPE
    Developer.prototype = {
      driveCar: function () {
        if(this.hasCar){
          alert("VRROOOOMMMMM");
        } else {
          alert("STRUT STRUT STRUT STRUT");
        }
      },
      changeFirstName: function (fn){
        this.firstName = fn;
      }
    };

    debugger;

    var me = new Developer({ln: "Staples", fn:"Josh"});

    me.driveCar();

    alert("has mac at work?  " + me.computers.mac + "!!!");

    // change first name via a function.  this is not necessary as there are no 'private' variables on a JS object*
    me.changeFirstName("Bill");

    // access first name directly as it is an object property
    alert(me.firstName);
    debugger;

    var you = new Developer({fn: "Walter", ln: "White"});
    alert(you.firstName);
    debugger;

    you.firstName = "Purple";
    alert(you.firstName);
    debugger;

    you.firstName = function (){ alert('where am i!')};
    debugger;

    alert(you.firstName);      // outputs source code!

    debugger;

    alert(you.firstName());    //

    debugger;

    // adding method to object singleton;
    you.kickBall = function (){
      alert("GOOOOOOOOOAAAAAAAAAALLLLLLLLLL! for " + this.lastName);
    };
    you.kickBall();     //logs, the above

    debugger;

    try {
      me.kickBall();      // ERROR
    } catch (err) {
      alert(err);
    }

    // extending base constructor

    debugger;

    Developer.prototype.jump = function () {
      alert(this.lastName + " is Jumping");
    };

    me.jump();
    you.jump();

    debugger;

}


