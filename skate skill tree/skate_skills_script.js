
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
  event.target.parentElement.style.opacity = "1";
  event.target.setAttribute("class", "trick_shape_path_learned");
  updateAvailable(event.target.parentElement.id);
}

function trick(id, prerequisites) {
  this.id = id;
  this.prerequisites = prerequisites;
}

var doubleHeel = new trick("doubleHeel", ["heel"]);
var inwardDouble = new trick("inwardDouble", ["inward"]);
var _360Inward = new trick("360Inward", ["inward"]);
var impossible = new trick("impossible", ["popShuv"]);
var tre = new trick("tre", ["varial"]);
var nightmare = new trick("nightmare", ["varial"]);
var doubleFlip = new trick("doubleFlip", ["kickflip"]);
var doubleHard = new trick("doubleHard", ["hardflip"]);
var _360Hard = new trick("360Hard", ["hardflip"]);
var _360FrontShuv = new trick("360FrontShuv", ["frontShuv"]);
var lazer = new trick("lazer", ["varialHeel"]);
var daydream = new trick("daydream", ["varialHeel"]);

var heel = new trick("heel", ["ollie"]);
var inward = new trick("inward", ["heel", "popShuv"]);
var popShuv = new trick("popShuv", ["ollie"]);
var varial = new trick("varial", ["kickflip", "popShuv"]);
var kickflip = new trick("kickflip", ["ollie"]);
var hardflip = new trick("hardflip", ["kickflip", "frontShuv"]);
var frontShuv = new trick("frontShuv", ["ollie"]);
var varialHeel = new trick("varialHeel", ["heel", "frontShuv"]);

var tricks = [doubleHeel, inwardDouble, _360Inward, impossible, tre,
              nightmare, doubleFlip, doubleHard, _360Hard, _360FrontShuv,
              lazer, daydream, heel, inward, popShuv, varial, kickflip,
              hardflip, frontShuv, varialHeel];

var trick_paths = document.getElementsByClassName("trick_shape_path"); // all 21 trick shape paths
for(var j = 0; j < trick_paths.length; j++){

  trick_paths[j].addEventListener("click", learnTrick, false);
}
document.getElementById("ollie").getElementsByClassName("trick_shape_path")[0].className.baseVal = "trick_shape_path_available";
//.setAttribute(("class"), "trick_shape_path_available");
