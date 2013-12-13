// To work from local directory, append the following to the executable path in a Chrome shortcut
//  --allow-file-access-from-files

 // e.g. "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files

// Dev Console
// F12 in windows
// Step 0 - Config browser as above
// Step 1 - Turn off cache
// Step 2 - Browse to file directory.   Open file in browser.

debugger;

  // TYPES
  var x;               // Now x is undefined
  var x = 5;           // Now x is a Number
  var x = "Josh";      // Now x is a String

  var $$topGlobal = 'first post!';

function demoMe() {

  var carname="Volvo XC60";    // this is stylestically better.
  var carname='Volvo XC60';

  var answer = "It's alright";
  var answer = "He is called 'Johnny 5'";
  var answer = 'He is called "Johnny 5"';

  debugger;

  //NUMBERS
  var x1=34.00;      // Written with decimals
  var x2=34;         // Written without decimals

  //LARGE NUMBERS
  var y=123e5;      // 12300000
  var z=123e-5;     // 0.00123

  //BOOLEANS
  var x=true;
  var y=false;

  //ARRAY
  var sup = [];      // NOT! var sup = new Array();
  sup.push('yo');
  sup.push(1);
  sup.push(1124 + "asdf");

  debugger;

  //OBJECTS
  var yo = {
    "fn": 'Josh',
    ln: "Staples",
    ssn: '123-45-6789',
  };

  console.log(yo.fn);
  console.log(yo['ln']);

  debugger;

  sup.push(yo);
  yo['eyes'] = 2;

  debugger;

  var yoyo = {
    fingers: '10',
    toes: "eleven",
    ssn: '123-45-6789',
  };

  sup.push(yoyo);

  debugger;

  console.table(sup);

  console.log('an array of objects', sup);
  console.info('an array of objects', sup);
  console.warn('an array of objects', sup);

  sup.arrprop = true;

  debugger;

  console.table(sup);

  debugger;

  // undeclared variable
  $$$firstpost = "WHERE AM I!?";

}

demoMe();


