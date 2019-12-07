/*TODO:
  -MOAR transitions!!!!
    - learning an avaialble trick plays a transition/fading effect
  - show level & exp on page
  */

function hideHoverText(event) {
  document.querySelector("#reqsElement").style.visibility = "hidden";
  let topMessage = document.querySelector("h1.message");
  topMessage.innerHTML = "SKATE UP!"; // top message default
  topMessage.style.color = "#32323c"; // default trick fill (dark grey)
  document.querySelector("#expGain").innerHTML = ""; // clear the exp gain
  document.querySelector("h2.reqs").innerHTML = ""; // clear the reqs heading
  document.querySelector("ul.reqs").innerHTML = ""; // clear the unordered list
  if(event.target.parentElement.querySelector(".trick_text_path_available") != null) {
    event.target.parentElement.querySelector(".trick_text_path_available").style.removeProperty("fill");
  }
  else if(event.target.parentElement.querySelector(".trick_text_path_learned") != null) {
    event.target.parentElement.querySelector(".trick_text_path_learned").style.removeProperty("fill");
  }
}

var unmetReqColour = "#FFb3b3"; //pink
var metReqColour = "#66b366"; // green
var blue = "#3A3AC1"; // blue
var lightBlue = "#c8c8f0"
var defaultLineHeight = "2.5rem";
function getColouredElement(reqText, satisfied, lineHeight = defaultLineHeight) {
  let req = document.createElement("li");
  req.appendChild(document.createTextNode(reqText));
  req.style.color =  satisfied ? metReqColour : unmetReqColour;
  req.style.lineHeight = lineHeight;
  return req;
}

function appendReqsToUL(trick) {
  var reqsUL = document.querySelector("ul.reqs");
  // we no longer append the exp requirement
  /*let expReqText = trick.expReq + " exp. (" + exp + "/" + trick.expReq + ")";
  reqsUL.appendChild(getColouredElement(expReqText, (exp >= trick.expReq)));*/
  // now apeend the trick prerequisites
  if(trick.numPreReqs >= 1) {
    let preReq1 = trick.preReqs[0];
    let s = (preReq1.reqCnt > 1) ? "s" : "";
    let preReq1Text = "Do " + preReq1.reqCnt + " " + preReq1.id + s + " (" + tricks[preReq1.id].availableCnt + "/" + preReq1.reqCnt + ")";
    let lineHeight = defaultLineHeight;
    if(preReq1.altId != undefined) {
      let s = (preReq1.altCnt > 1) ? "s" : "";
      preReq1Text += "\nor " + preReq1.altCnt + " " + preReq1.altId + s + " (" + tricks[preReq1.altId].availableCnt + "/" + preReq1.altCnt + ")";
      lineHeight = "1.2em";
    }
    reqsUL.appendChild(getColouredElement(preReq1Text, preReqSatisfied(preReq1), lineHeight));
  }
  if(trick.numPreReqs == 2) {
    let preReq2 = trick.preReqs[1];
    let s = (preReq2.reqCnt > 1) ? "s" : "";
    let preReq2Text = "Do " + preReq2.reqCnt + " " + preReq2.id + s + " (" + tricks[preReq2.id].availableCnt + "/" + preReq2.reqCnt + ")";
    let lineHeight = defaultLineHeight;
    if(preReq2.altId != undefined) {
      let s = (preReq2.altCnt > 1) ? "s" : "";
      preReq2Text += "\nor " + preReq2.altCnt + " " + preReq2.altId + s + " (" + tricks[preReq2.altId].availableCnt + "/" + preReq2.altCnt + ")";
      lineHeight = "1.2em";
    }
    reqsUL.appendChild(getColouredElement(preReq2Text, preReqSatisfied(preReq2), lineHeight));
  }
}

function startsWithVowel(id) {
  let firstChar = id[0].toUpperCase();
  return "AEIOU".includes(firstChar);
}
function showHoverText(trick, event) {
  let reqsElement = document.querySelector("#reqsElement");
  let topMessage = document.querySelector("h1.message")
  let reqsHeading = reqsElement.querySelector("h2.reqs");
  if(event.target.classList.contains("trick_shape_path_learned")) {
    // trick has been learned
    event.target.parentElement.querySelector(".trick_text_path_learned").style.fill = lightBlue;
    let an = startsWithVowel(trick.id) ? "an" : "a";
    topMessage.innerHTML = "Click to do " + an + " " + trick.id + "!";
    topMessage.style.color = blue;
    let expGain = document.querySelector("#expGain");
    expGain.innerHTML = "( +" + trick.expGain + " exp. )";
    return;
  }
  else if(event.target.classList.contains("trick_shape_path_available")) {
    // trick is avaiable to learn
    event.target.parentElement.querySelector(".trick_text_path_available").style.fill = metReqColour; //"#66b366";
    topMessage.innerHTML = "Click to learn " + trick.id;
    topMessage.style.color = metReqColour;
    reqsHeading.innerHTML = "You can learn " + trick.id + "!";
    reqsHeading.style.color = metReqColour;
    reqsElement.style.visibility = "visible";
    reqsElement.style.borderTop = "2px solid " + metReqColour;
    reqsElement.style.borderLeft = "2px solid " + metReqColour;
  }
  else {
    // trick is not available yet
    console.assert(event.target.classList.contains("trick_shape_path"));
    topMessage.innerHTML = trick.id + " makes no sense (҂⌣̀_⌣́)";
    topMessage.style.color = unmetReqColour;
    reqsHeading.innerHTML = "Requirements to learn " + trick.id + ":";
    reqsHeading.style.color = unmetReqColour;
    reqsElement.style.visibility = "visible";
    reqsElement.style.borderTop = "2px solid " + unmetReqColour;
    reqsElement.style.borderLeft = "2px solid " + unmetReqColour;
  }
  appendReqsToUL(trick);
}

function sizeFraction(id) {
  let len = document.querySelector(id).innerHTML.length;
  console.log(len);
  if(len <= 3) document.querySelector(id).style.letterSpacing = "3px"; // Eg: 1/3
  else if(len == 4) document.querySelector(id).style.letterSpacing = "2px"; // Eg: 1/10
  else if(len == 5) document.querySelector(id).style.letterSpacing = "1px"; // Eg: 10/100
  else if(len == 6) document.querySelector(id).style.letterSpacing = "0px"; // Eg: 10/100
  else if(len >= 7) { // Eg: 100/200
    document.querySelector(id).style.letterSpacing = "-1px";
    document.querySelector(id).style.fontSize = "0.8em";
  }
}
function updateCounters(){
  if(currentLevel == levels.length - 1) { // we are the highest level
    // so remove the exp bar and trick bar from the page
    document.querySelector("#bars").innerHTML = "";
    return;
  }
  let nextLevel = levels[currentLevel + 1];
  document.querySelector("#expCount").innerHTML = exp + "/" + nextLevel.expReq;
  sizeFraction("#expCount");
  document.querySelector("#trickCount").innerHTML = tricksLearned + "/" + nextLevel.numTricks;
  sizeFraction("#trickCount");

  if(exp >= nextLevel.expReq) { // exp requirement has been fullfilled
    document.querySelector("#expBar").style.width = "100%";
    document.querySelector("#expCount").style.color = blue;
  }
  else { // exp requiement is a fraction
    document.querySelector("#expBar").style.width = (exp * 100.0 / nextLevel.expReq) + "%";
    document.querySelector("#expCount").style.color = lightBlue;
  }
  if(tricksLearned >= nextLevel.numTricks) { // tricks learned requirement has been fullfilled
    document.querySelector("#tricksBar").style.width = "100%";
    document.querySelector("#trickCount").style.color = metReqColour;
  }
  else { //trick learned is a fraction
    //let tricksBarWidth = ((tricksLearned - levels[currentLevel].numTricks) * 100.0) / (nextLevel.numTricks - levels[currentLevel].numTricks);
    let tricksBarWidth = (tricksLearned * 100.0) / nextLevel.numTricks;
    document.querySelector("#tricksBar").style.width = tricksBarWidth + "%";
    document.querySelector("#trickCount").style.color = unmetReqColour;
  }
}

function updateLevel(){
  // if the exp and tricksLearned requirement for the next level is met, go up a level!
  if(currentLevel == levels.length - 1) {alert("you are a winner!");return;} // we are at the highest level
  let nextLevel = levels[currentLevel + 1];
  if(tricksLearned >= nextLevel.numTricks && exp >= nextLevel.expReq) { // go up a level!
    currentLevel++;
    document.querySelector("h2.level").innerHTML = "You are " + nextLevel.prefix + ":";
    document.querySelector("h3.level").innerHTML = nextLevel.title;
    exp -= nextLevel.expReq;
  }
  updateCounters();
}

function isVisible(trick) {
  // returns true if a trick's prerequisites have been learned
  for(let i = 0; i < trick.numPreReqs; i++) {
      let preReq = trick.preReqs[i];
      if(tricks[preReq.id].totalNumberDone == 0) { // preReq hasn't been learned
        if(preReq.altId == undefined || tricks[preReq.altId].totalNumberDone == 0) {
          // alternate preReq does not exist or has not been learned
          return false;
        }
      }
  }
  return true; // all the prereqs have been learned
}
function updateVisible(trick) { // only changes hidden SVGs to visible
  // updateVisible is called on all tricks after learning a trick
  let svg = document.getElementById(trick.id);
  if(svg.classList.contains("trick_svg_hidden") && isVisible(trick)) {
    // trick is hidden but it should be available
    svg.setAttribute("class", "trick_svg_visible");
    svg.querySelector(".trick_shape_path").addEventListener("mouseover", trick.boundShowHoverText, false);
    svg.querySelector(".trick_shape_path").addEventListener("mouseout", hideHoverText, false);
  }
}

function preReqSatisfied(preReq) {
  // returns true if a prerequisite is satisfied, false otherwise
  if(tricks[preReq.id].availableCnt >= preReq.reqCnt) return true;
  if(preReq.altId != undefined && preReq.altCnt != undefined) {
    // there are alternate prerequisites
    if(tricks[preReq.altId].availableCnt >= preReq.altCnt) return true;
  }
  return false;
}
function isAvailable(trick) {
  // returns true if a trick is available, false otherwise
  if (trick.expReq > exp) return false;
  for(let i = 0; i < trick.numPreReqs; i++) {
    if(!preReqSatisfied(trick.preReqs[i])) return false;
  }
  return true;
}
function updateAvailable(trick) {
  // updates trick availability: tricks become available or unavailable
  // updateAvailable is called on all tricks after learning or performing a trick
  // updateAvailable does nothing to hidden svgs or learned tricks
  // it only modifies tricks that have incorrect availability
  let svg = document.getElementById(trick.id);
  if(svg.classList.contains("trick_svg_hidden")) return;  // updateAvailable is only called on visible tricks

  let visible_shape_paths = svg.getElementsByClassName("trick_shape_path");
  let available_shape_paths = svg.getElementsByClassName("trick_shape_path_available");
  if(visible_shape_paths.length == 1 && isAvailable(trick)) {
    // trick is not available, but it should be
    let visible_text_path = svg.getElementsByClassName("trick_text_path")[0];
    visible_text_path.setAttribute("class", "trick_text_path_available"); // make the trick appear available
    let visible_shape_path = visible_shape_paths[0];
    visible_shape_path.setAttribute("class", "trick_shape_path_available");
    visible_shape_path.addEventListener("click", trick.boundLearnTrick, false);
  }
  else if(available_shape_paths.length == 1 && !isAvailable(trick)) {
    // trick is available, but it should not be
    let avaialable_text_path = svg.getElementsByClassName("trick_text_path_available")[0];
    avaialable_text_path.setAttribute("class", "trick_text_path"); // make the trick appear unavailable
    let available_shape_path = available_shape_paths[0]
    available_shape_path.setAttribute("class", "trick_shape_path");
    available_shape_path.removeEventListener("click", trick.boundLearnTrick, false);
  }
}

function performTrick(trick, event){
  exp += trick.expGain; // gain exp based on which trick was performed
  trick.totalNumberDone++;
  trick.availableCnt++;
  for (let t in tricks) {
    updateAvailable(tricks[t]); // only updates visible tricks, and not learned tricks
  }
  updateLevel();
}

function decreaseAvailableCntsInPreReqs(trick) {
  for (let i = 0; i < trick.numPreReqs; i++){ // loop through  the trick's preReqs
    let preReq = trick.preReqs[i];
    // either reqCnt or altCnt is satisfied
    if(tricks[preReq.id].availableCnt >= preReq.reqCnt) { // reqCnt satisfied
      tricks[preReq.id].availableCnt -= preReq.reqCnt;
    }
    else { // altCnt satisfied
      console.assert((preReq.altId != undefined), "trick was learned without satisfied preReqs");
      tricks[preReq.altId].availableCnt -= preReq.altCnt;
    }
  }
}

function learnTrick(trick, event){ // learnTrick is only called on available tricks
  let shape_path = event.target; // event.target will always be the available shape path
  console.assert(shape_path.className.baseVal == "trick_shape_path_available");
  shape_path.removeEventListener("click", trick.boundLearnTrick, false);
  shape_path.addEventListener("click", performTrick.bind(null, trick), false);
  shape_path.setAttribute("class", "trick_shape_path_learned");
  let text_path = shape_path.parentElement.getElementsByClassName("trick_text_path_available")[0];
  text_path.setAttribute("class", "trick_text_path_learned");
  hideHoverText(event);
  showHoverText(trick, event);
  trick.totalNumberDone = 1;
  trick.availableCnt = 0;
  decreaseAvailableCntsInPreReqs(trick);
  for(let t in tricks) {
    if(tricks[t].totalNumberDone == 0) {
      updateVisible(tricks[t]); // only changes hidden svgs to visible
      updateAvailable(tricks[t]); // only updates visible tricks, and not learned tricks
    }
  }
  tricksLearned++; // we have learned a trick!
  updateLevel();
}

function preReq(id, cnt, altId, altCnt) {
  this.id = id;
  this.reqCnt = cnt;
  this.altId = altId; // is undefined if not passed as a parameter
  this.altCnt = altCnt; // is undefined if not passed as a parameter
}
function trick(id, preReqs, expRequired, expGained) {
  this.id = id;
  this.preReqs = preReqs;
  this.numPreReqs = preReqs.length; // will be 1 or 2 for all tricks besides ollie
  this.expReq = 0; // no longer have an expReq
  this.expGain = expGained;
  this.totalNumberDone = 0; // 0 have been done initially
  this.availableCnt = 0; // 0 have been done initially
  this.boundLearnTrick = learnTrick.bind(null, this);
  this.boundShowHoverText = showHoverText.bind(null, this);
}

var tricks = new Object(); // object containing all of the tricks except ollie
tricks.doubleHeel = new trick("doubleHeel", [new preReq("heel", 8), new preReq("ollie", 2)], 18, 12);
tricks.inwardDouble = new trick("inwardDouble", [new preReq("inward", 10), new preReq("heel", 15, "doubleHeel", 3)], 75, 25);
tricks["360Inward"] = new trick("360Inward", [new preReq("inward", 10), new preReq("popShuv", 10, "impossible", 2)], 75, 25);
tricks.impossible = new trick("impossible", [new preReq("popShuv", 3), new preReq("ollie", 3, "tre", 1)], 21, 11);
tricks.tre = new trick("tre", [new preReq("varial", 3), new preReq("popShuv", 3, "impossible", 1)], 20, 11);
tricks.nightmare = new trick("nightmare", [new preReq("varial", 6), new preReq("kickflip", 13, "doubleFlip", 2)], 23, 12);
tricks.doubleFlip = new trick("doubleFlip", [new preReq("kickflip", 5), new preReq("ollie", 1)], 14, 10);
tricks.doubleHard = new trick("doubleHard", [new preReq("hardflip", 10), new preReq("kickflip", 15, "doubleFlip", 2)], 44, 20);
tricks["360Hard"] = new trick("360Hard", [new preReq("hardflip", 10), new preReq("frontShuv", 10, "360FrontShuv", 3)], 46, 21);
tricks["360FrontShuv"] = new trick("360FrontShuv", [new preReq("frontShuv", 12, "lazer", 2)], 25, 12);
tricks.lazer = new trick("lazer", [new preReq("varialHeel", 8), new preReq("frontShuv", 8, "360FrontShuv", 2)], 30, 15);
tricks.daydream = new trick("daydream", [new preReq("varialHeel", 8), new preReq("heel", 14, "doubleHeel", 2)], 35, 17);

tricks.heel = new trick("heel", [new preReq("ollie", 9)], 9, 6);
tricks.inward = new trick("inward", [new preReq("heel", 10), new preReq("popShuv", 5)], 26, 12);
tricks.popShuv = new trick("popShuv", [new preReq("ollie", 1)], 1, 1);
tricks.varial = new trick("varial", [new preReq("kickflip", 2), new preReq("popShuv", 2)], 10, 5);
tricks.kickflip = new trick("kickflip", [new preReq("ollie", 7)], 7, 5);
tricks.hardflip = new trick("hardflip", [new preReq("kickflip", 6), new preReq("frontShuv", 6)], 21, 10);
tricks.frontShuv = new trick("frontShuv", [new preReq("ollie", 3)], 3, 2);
tricks.varialHeel = new trick("varialHeel", [new preReq("heel", 4), new preReq("frontShuv", 4)], 16, 9);

tricks.ollie = new trick("ollie", [], 0, 1)

var exp = 0; //starting amount of experience
var tricksLearned = 0; // starting number of tricks that have been learned
var currentLevel = -1; // initialize the starting level by calling updateLevel

function level(title, numTricks, expReq, prefix="a") {
  this.prefix = prefix;
  this.title = title;
  this.numTricks = numTricks;
  this.expReq = expReq;
}
var levels = [new level("poser", 0, 0), new level("snake", 1, 2), new level("rat on a skateboard", 2, 5), new level("grom", 4, 9),
              new level("park shark", 5, 14), new level("skate rat", 7, 20), new level("shredder", 8, 27), new level("street rat", 10, 35),
              new level("gnarly dude", 11, 44), new level("shop skater", 13, 54), new level("local legend", 14, 65), new level("Am", 16, 77, "an"),
              new level("gnarly shredder", 17, 90), new level("Pro", 19, 104), new level("unbeatable at SKATE", 21, 120, "")];
// add an event listener to ollie because it is available
// don't show preReqs on hover for ollie
updateVisible(tricks.ollie);
updateAvailable(tricks.ollie); // we can do this by calling update avaialable
updateLevel();
