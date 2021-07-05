



var click_to_roll = document.querySelector("#click_to_roll");
window.alert(5 + 6);
console.log("poop");
click_to_roll.addEventListener("click", console.log("hellooo"), false);

var dice = [];
for(int i = 0; i < 6; i++){
  dice[i] = document.createElement('object');
}
dice[0] = '<object type="image/svg+xml" data="die_images/my_die_face_1.svg" class="die">1</object>';
dice[1] = '<object type="image/svg+xml" data="die_images/my_die_face_2.svg" class="die">2</object>';
dice[2] = '<object type="image/svg+xml" data="die_images/my_die_face_3.svg" class="die">3</object>';
dice[3] = '<object type="image/svg+xml" data="die_images/my_die_face_4.svg" class="die">4</object>';
dice[4] = '<object type="image/svg+xml" data="die_images/my_die_face_5.svg" class="die">5</object>';
dice[5] = '<object type="image/svg+xml" data="die_images/my_die_face_6.svg" class="die">6</object>';

function roll(){
  var numDice = 3;
  var x = 10;
  var yChange = 50/numDice;
  var y = 1
  for(int i = 0; i < numDice; i++){
    let dieHTML = dice[Math.floor(Math.random())*6];
    document.querySelector('#roll').innerHTML += dieHTML;
    let spin = Math.floor(Math.random() * 10);
    let timerId = setInterval(move(die, x, y, spin), 20);
    y = y + yChange; //each die rolled should be distributed vertically across the game area
  }
}

function move(die, x, y, rotate){
    die.style.left = parseInt(die.style.left) + x + "px";
    die.style.top = parseInt(die.style.top) + y + "px";
    currentDeg = parseInt(die.style.transform.split("rotate(")[1]);
    die.style.rotate = "rotate(" + (currentDeg + rotate) + "deg)";
}
