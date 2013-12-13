function demo() {

    var Developer = function (params) {

      this.lastName = params.ln;
      this.firstName = params.fn;
      this.hasCar = params.hasCar;

    };

    Developer.prototype = {

      addListener: function () {
        var me = this;
        var clicker = document.getElementById("clickMe");
        clicker.addEventListener("click", function (event) {
          debugger;
          me.listening(event);
          console.log(this.lastName);
          console.log(event);
        });
      },

      listening: function (event){
        console.log(this.lastName);
      }

    };

    var me = new Developer({ln: "Staples", fn:"Josh", hasCar: false});
    me.addListener();
    var you = new Developer({fn: "Walter", ln: "White", hasCar: true});
}
