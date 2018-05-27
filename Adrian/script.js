//Example from in class
// var btnpep = document.getElementById('btn-pepperoni');
// var pizza = document.getElementById('pizza');

// btnpep.addEventListener('click', addPepperoni);

// function addPepperoni(evt) {
//   pizza.style.background = "url(pepperoni.png), url(blackolives.png), url(mushrooms.png), url(pizza.png)";
// }

var prebuiltbtn = document.getElementById('prebuilt-btn');
var sizebtn = document.getElementById('size-btn');
var toppingbtn = document.getElementById('toppings-btn');
var prebuiltbody = document.getElementById('prebuilt-body');
var sizebody = document.getElementById('size-body');
var toppingbody = document.getElementById('toppings-body');

prebuiltbtn.addEventListener('click', togglePrebuilt);
sizebtn.addEventListener('click', toggleSize);
toppingbtn.addEventListener('click', toggleTopping);

function togglePrebuilt(evt) {
  if(prebuiltbody.style.display === "none") {
    prebuiltbody.style.display = "block";
  }
  else {
    prebuiltbody.style.display = "none";
  }
}
function toggleSize(evt) {
  if(sizebody.style.display === "none") {
    sizebody.style.display = "block";
  }
  else {
    sizebody.style.display = "none";
  }
}
function toggleTopping(evt) {
  if(toppingbody.style.display === "none") {
    toppingbody.style.display = "block";
  }
  else {
    toppingbody.style.display = "none";
  }
}