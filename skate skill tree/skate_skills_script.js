/*TODO:
  - hover unavailable tricks show preReqs
  - hover available show prereqs preReqs satisfied
  - learning an avaialble trick plays a transition/fading effect
  - hover learned show exp gained and a message
  - show exp on page
  */

function getColouredPElement(reqText, satisfied) {
  let reqP = document.createElement("p");
  reqP.appendChild(document.createTextNode(reqText));
  if(satisfied) reqP.style.color = "green";
  else reqP.style.color = "red";
  return  reqP;
}
function showReqs(trick, event) {
  let reqsElement = document.querySelector("#reqs");
  reqsElement.innerHTML = trick.id + " requires:";

  let expReqText = "Exp: " + exp + "/" + trick.expReq;
  let expReqP = getColouredPElement(expReqText, (exp >= trick.expReq));
  reqsElement.appendChild(expReqP);

  if(trick.numPreReqs >= 1) {
    let preReq1 = trick.preReqs[0];
    let preReq1Text = preReq1.reqCnt + " " + preReq1.id + "s (" + tricks[preReq1.id].availableCnt + "/" + preReq1.reqCnt + ")";
    if(preReq1.altId != undefined) {
      preReq1Text += " or " + preReq1.altId + ": " + tricks[preReq1.altId].availableCnt + "/" + preReq1.altCnt;
    }
    let preReq1P = getColouredPElement(preReq1Text, preReqSatisfied(preReq1));
    reqsElement.appendChild(preReq1P);
  }
  if(trick.numPreReqs == 2) {
    let preReq2 = trick.preReqs[1];
    let preReq2Text = preReq2.id + ": " + tricks[preReq2.id].availableCnt + "/" + preReq2.reqCnt;
    if(preReq2.altId != undefined) {
      preReq2Text += " or " + preReq2.altId + ": " + tricks[preReq2.altId].availableCnt + "/" + preReq2.altCnt;
    }
    let preReq2P = getColouredPElement(preReq2Text, preReqSatisfied(preReq2));
    reqsElement.appendChild(preReq2P);
  }

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
    svg.querySelector(".trick_shape_path").addEventListener("mouseover", trick.boundShowReqs, false);
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
  exp += trick.expGain;
  trick.totalNumberDone++;
  trick.availableCnt++;
  for (let t in tricks) {
    updateAvailable(tricks[t]); // only updates visible tricks, and not learned tricks
  }
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
function learnTrick(trick, event){
  // learnTrick is only called on available tricks
  let shape_path = event.target; // event.target will always be the available shape path
  console.assert(shape_path.className.baseVal == "trick_shape_path_available");
  shape_path.removeEventListener("click", trick.boundLearnTrick, false);
  shape_path.addEventListener("click", performTrick.bind(null, trick), false);
  shape_path.setAttribute("class", "trick_shape_path_learned");
  let text_path = shape_path.parentElement.getElementsByClassName("trick_text_path_available")[0];
  text_path.setAttribute("class", "trick_text_path_learned");
  trick.totalNumberDone = 1;
  trick.availableCnt = 1;
  decreaseAvailableCntsInPreReqs(trick);
  for(var t in tricks) {
    updateVisible(tricks[t]); // only changes hidden svgs to visible
    updateAvailable(tricks[t]); // only updates visible tricks, and not learned tricks
  }
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
  this.expReq = expRequired;
  this.expGain = expGained;
  this.totalNumberDone = 0; // 0 have been done initially
  this.availableCnt = 0; // 0 have been done initially
  this.boundLearnTrick = learnTrick.bind(null, this);
  this.boundShowReqs = showReqs.bind(null, this);
}

var exp = 0; //starting amount of experience
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
// add an event listener to ollie because it is available
// don't show preReqs on hover for ollie
updateAvailable(tricks.ollie); // we can do this by calling update avaialable
