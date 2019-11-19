
function trickIsLearned(id) {
  var svg = document.getElementById(id);
  return svg.getElementsByClassName("trick_shape_path_learned").length == 1;
}
function trickIsHidden(id) {

  var svg = document.getElementById(id);
  return svg.getElementsByClassName("trick_shape_path").length == 1;
}


function updateAvailable(id) {
  for(var i = 0; i <tricks.length; i++) { //iterate through all tricks
    var a_trick = tricks[i];
    console.log(i, a_trick.id);
      if(trickIsHidden(a_trick.id) && trickIsLearned(a_trick.prerequisites[0])) {
        if(a_trick.prerequisites.length == 1 || trickIsLearned(a_trick.prerequisites[1])){
          var available_trick = document.getElementById(a_trick.id);
          available_trick.getElementsByClassName("trick_shape_path")[0].className.baseVal = "trick_shape_path_available";
        }
      }
  }
}


function learnTrick(event){
  // target will always be the path
  if(exp >= 5) {
    event.target.setAttribute("class", "trick_shape_path_learned");
    updateAvailable(event.target.parentElement.id);
    exp -= 5;
    document.getElementById("myExp").innerHTML = exp + " mL of blood sacrificed to Skatan";
  }
  else {alert("your exp (" + exp + ") is not enough to learn this trick");}
}

function trick(id, prerequisites, expRequired) {
  this.id = id;
  this.prerequisites = prerequisites;
  this.exp = expRequired;
}

var exp = 0;
var doubleHeel = new trick("doubleHeel", ["heel"], 18);
var inwardDouble = new trick("inwardDouble", ["doubleHeel", "inward"], 75);
var _360Inward = new trick("360Inward", ["inward"], 75);
var impossible = new trick("impossible", ["popShuv"], 21);
var tre = new trick("tre", ["varial"], 20);
var nightmare = new trick("nightmare", ["doubleFlip", "varial"], 23);
var doubleFlip = new trick("doubleFlip", ["kickflip"], 14);
var doubleHard = new trick("doubleHard", ["doubleFlip", "hardflip"], 44);
var _360Hard = new trick("360Hard", ["hardflip"], 46);
var _360FrontShuv = new trick("360FrontShuv", ["frontShuv"], 25);
var lazer = new trick("lazer", ["varialHeel"], 30);
var daydream = new trick("daydream", ["doubleHeel", "varialHeel"], 35);

var heel = new trick("heel", ["ollie"], 9);
var inward = new trick("inward", ["heel", "popShuv"], 28);
var popShuv = new trick("popShuv", ["ollie"], 1);
var varial = new trick("varial", ["kickflip", "popShuv"], 11);
var kickflip = new trick("kickflip", ["ollie"], 7);
var hardflip = new trick("hardflip", ["kickflip", "frontShuv"], 22);
var frontShuv = new trick("frontShuv", ["ollie"], 3);
var varialHeel = new trick("varialHeel", ["heel", "frontShuv"], 19);

var tricks = [doubleHeel, inwardDouble, _360Inward, impossible, tre,
              nightmare, doubleFlip, doubleHard, _360Hard, _360FrontShuv,
              lazer, daydream, heel, inward, popShuv, varial, kickflip,
              hardflip, frontShuv, varialHeel];

var trick_paths = document.getElementsByClassName("trick_shape_path"); // all 21 trick shape paths
for(var i = 0; i < trick_paths.length; i++){
  trick_paths[i].addEventListener("click", learnTrick, false);
}
document.getElementById("ollie").getElementsByClassName("trick_shape_path")[0].className.baseVal = "trick_shape_path_available";
//.setAttribute(("class"), "trick_shape_path_available");

function requireDoubleFlips(){
  inwardDouble.prerequisites = ["doubleHeel", "inward"];
  nightmare.prerequisites = ["doubleFlip", "varial"];
  doubleHard.prerequisites = ["doubleFlip", "hardflip"];
  daydream.prerequisites = ["doubleHeel", "varialHeel"];
}
function noDoubleFlips(){
  inwardDouble.prerequisites = ["inward"];
  nightmare.prerequisites = ["varial"];
  doubleHard.prerequisites = ["hardflip"];
  daydream.prerequisites = ["varialHeel"];
}
document.getElementById("v2").addEventListener("click", requireDoubleFlips, false);
document.getElementById("v1").addEventListener("click", noDoubleFlips, false);

function gainExp(){
  exp += 5;
  document.getElementById("myExp").innerHTML = exp + " mL of blood sacrificed to Skatan";
}
document.getElementById("gain").addEventListener("click", gainExp, false);
