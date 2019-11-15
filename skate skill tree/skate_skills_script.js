
//document.body.innerHTML = "<h1>result!: " + result + "</h1>";

function learnTrick(event){
  //alert('pizza!');
  event.target.style.opacity = "0.3";
  //event.target.setAttribute("class", "learned_svg");
}

var trick_paths = document.getElementsByClassName("trick_svgs"); //trick_svgs or trick_paths ??
for(var i = 0; i < trick_paths.length; i++){
  trick_paths[i].addEventListener("click", learnTrick, false);
}
