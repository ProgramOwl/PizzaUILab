var pizza_options = {
	size:{
		small: { name:"Small", name_short:"S", size: 6},
		medium: { name:"Medium", name_short:"M", size: 12},
		large: { name:"Large", name_short:"L", size: 14},
		jumbo: { name:"Jumbo", name_short:"J", size: 24}
	},
	toppings:{
		pep:{
			name: "Pepperoni",
			full: "images/toppings/pepperoni.png"//,
//			left: "images/toppings/pepperoniL.png",
//			right: "images/toppings/pepperoniR.png"				
		},
		mush:{
			name: "Mushrooms",
			full: "images/toppings/mushrooms.png"//,
//			left: "images/toppings/mushrooms.png",
//			right: "images/toppings/mushrooms.png"			
		},
		bol:{
			name: "Black Olives",
			full: "images/toppings/blackolives.png"///,
//			left: "images/toppings/blackolives.png",
//			right: "images/toppings/blackolives.png"			
		}
	}
	
};
//probably have a great new empty pizza function
var cur_pizza = {
	toppings:{
		pep:{
//			item: pizza_options.toppings.pep,
			 selected: false,
			 amount: null
			},
		mush:{
//			item: pizza_options.toppings.mush,
			 selected: false,
			 amount: null
			},	
		bol:{
//			item: pizza_options.toppings.bol,
			 selected: false,
			 amount: null
			}
	},
	size: pizza_options.size.medium,
	numberOfToppings: 0
};

var pizza = document.getElementById('pizza');
var order = [];

function createBackgroundList(){
	toppingsTotal();
	var str = "";
	var i=0;
	var itemsp = cur_pizza.toppings;
	for(var top in itemsp){
		if(itemsp[top].selected){
			var temp = "empty";
			if(itemsp[top].amount == "full"){
				temp = pizza_options.toppings[top].full;
			}
			else if(itemsp[top].amount == "left"){
				temp = pizza_options.toppings[top].left;
			}
			else if(itemsp[top].amount == "right"){
				temp = pizza_options.toppings[top].right;
			}

			if(temp != "empty"){
				str += "url(" + temp + "),";
			}
		}
	}
	str += "url(images/bases/pizza.png)";
//	console.log("curpizza: ", cur_pizza);
//	console.log("backList: ", str);
	return str;
}

//add all listeners
function initializeListeners(){
	document.getElementById('pep').addEventListener('click', addItem); 
	document.getElementById('mush').addEventListener('click', addItem); 
	document.getElementById('bol').addEventListener('click', addItem);
}

//Item updates and swaps
function addItem(evt){
	var nameid = evt.target.id;
	
	if(document.getElementById(nameid)){
		var btnItem = document.getElementById(nameid);
		cur_pizza.toppings[nameid].selected=true;
		cur_pizza.toppings[nameid].amount="full";
		cur_pizza.numberOfToppings += 1;

		btnItem.textContent="- " + pizza_options.toppings[nameid].name;
		btnItem.style.background="#722";
		btnItem.style.borderColor="#722";
		btnItem.removeEventListener('click', addItem);
		btnItem.addEventListener('click', removeItem);
		
		pizza.style.background = createBackgroundList();		
	}
	else{
		console.log("nameid Error");
	}
}
function removeItem(evt){
	var nameid = evt.target.id;
	
	if(document.getElementById(nameid)){
		var btnItem = document.getElementById(nameid);
		cur_pizza.toppings[nameid].selected=false;
		cur_pizza.toppings[nameid].amount=null;
		cur_pizza.numberOfToppings -= 1;

		btnItem.textContent="+ " + pizza_options.toppings[nameid].name;
		btnItem.style.background="#272";
		btnItem.style.borderColor="#272";
		btnItem.removeEventListener('click', removeItem);
		btnItem.addEventListener('click', addItem);

		pizza.style.background = createBackgroundList();
	}
	else{
		console.log("nameid Error");
	}
}

function toppingsTotal(){
	document.getElementById("toptotal").innerHTML = "<p>Number Of Toppings Selected: "+cur_pizza.numberOfToppings+"</p>";
}
//function setItemAmountFull(nameid){
//maybe use radio buttons?
//	var btnItem = document.getElementById(nameid);
//	cur_pizza.toppings[nameid].selected=true;
//	cur_pizza.toppings[nameid].amount="full";
//	
//	btnpep.textContent="- "+pizza_options.toppings[nameid].name;
//	btnpep.style.background="#722";
//	btnItem.removeEventListener('click', addItem(nameid));
//	btnItem.addEventListener('click', removeItem(nameid));
//	
//	pizza.style.background = createBackgroundList();
//}


/*Resizing*/
function collapseMenu(collapseid){
	
}

initializeListeners();
createBackgroundList();

//Can we do json file read-in?/could it be a big value built on a data.js?
//does it need to go all the way to the ordering out page where you would decide dilevery or pick up?
//Can the pre-built be any of our own making or is there a known 5 pre sets?
//so one time, auto