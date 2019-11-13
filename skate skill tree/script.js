var isBiggerFunction = function(a, b){
  var result;
  a>b ? result = true : result = false;
  return result;
}
var result = isBiggerFunction(2,1);
//document.body.innerHTML = "<h1>result!: " + result + "</h1>";

function showArea(event){
  alert("you have clicked me");
}

document.addEventListener('click', function (event) {
	if (!event.target.matches('.tricks_path')){
    alert("you have clicked me!!!!!");
  } return;
}, false);
