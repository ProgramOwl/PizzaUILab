var pizza;
var pizza_options;
var cur_pizza = {size:"medium"};
var alter=false;
var pagesecs ={	
	currentPizza:{
		catname:"Current Pizza",
		pizza:cur_pizza
	},
	checkout:{
		catname:"Checkout",
		total:0,
		pizzas:[]		
	}
};
var collapseIds=[];

var requestOptions = new XMLHttpRequest();
function loadOptions(){
	requestOptions.open('GET', 'json/pizzaoptions.json');
	requestOptions.onload = loadCompleteOptions;
  	requestOptions.send();	
}
function loadCompleteOptions(evt){
  	var dataX = JSON.parse(requestOptions.responseText);
	pizza_options = dataX;
	buildPage();
	pizza = document.getElementById('pizza');
	buildEmptyPizza();
	initializeListeners();
	updateCheckout();
}

function buildEmptyPizza(){
	var tem="";
	if(cur_pizza.size!=null){
		tem=cur_pizza.size;
	}
	else{
		tem="medium";
	}
	cur_pizza = {		
		numberOfToppings: 0,
		cost:0,
		over5:false,
		presetSelected: {is:false, name:""},
		size: tem,
		tops:{			
		}
	};
		var itemx = "{";
		for(var top in pizza_options.tops){
			if(top!="catname"){
			itemx += ('"'+top+'" :{"selected": false, "amount": "full"},');
			}
		}
		var itemy = itemx.substr(0, itemx.length-1);
		cur_pizza.tops = JSON.parse(itemy+'}');
	
	for(var x in cur_pizza.tops){
		var btnItem = document.getElementById(x);
		cur_pizza.tops[x].selected=false;
		cur_pizza.tops[x].amount="full";
		cur_pizza.numberOfToppings -= 1;

		btnItem.textContent="+ " + pizza_options.tops[x].name;
		btnItem.style.background="transparent";
		btnItem.removeEventListener('click', removeItem);
		btnItem.addEventListener('click', addItem);		
	}
	pizzaSizeSetId(cur_pizza.size);
	updateCurrentPizza();
}
function buildPage(){
	//build the page's sections
	var build ="";
		build+='<div id="pizzabox"><div id="pizza"></div></div><div id="order"><div>';
	for(var itemsp in pizza_options){
		collapseIds[collapseIds.length] = itemsp;
		build+='<div class="order-section">';
		build+='<div class="section-title" id="'+itemsp+'"> '+pizza_options[itemsp].catname+'</div>';
		build+='<div id="sub-'+itemsp+'" class="poc-collapse-menu"><ul class="collapse-ul">';

		for(var top in pizza_options[itemsp]){
			if(top!="catname"){	
				if(itemsp=="tops"){
					build +='<li id="'+top+'" class="menu-item">+ '+pizza_options[itemsp][top].name+"</li>";
				}
				else if(itemsp=="size"){
					build +='<li id="'+top+'" class="menu-item">'+pizza_options[itemsp][top].name+": "+pizza_options[itemsp][top].size+" in"+"</li>";
				}
				else if(itemsp=="presets"){
					build +='<li id="'+top+'" class="menu-item">'+pizza_options[itemsp][top].name+"</li>";
				}
			}
		}
		build+='</ul></div></div>'

	}
	build+='</div>';
	//add checkout
	var str ="";
	for(var itemsp in pagesecs){	
		var cute = pagesecs[itemsp];
		collapseIds[collapseIds.length] = itemsp;
	}
	
		str+='<div class="order-section">';
		str+='<div class="section-title" id="'+'currentPizza'+'">';
		str+=" "+pagesecs.currentPizza.catname+" ";
//		str+='<button id="addtocart">Add to Cart</button>';
		str+='</div>';
		str+='<div id="sub-'+'currentPizza'+'" class="poc-collapse-menu">';
		str+='</div></div>';
	
		str+='<div class="order-section">';
		str+='<div class="section-title" id="checkout"> ';
		str+=pagesecs.checkout.catname+'</div>';
		str+='<div id="sub-'+'checkout'+'" class="poc-collapse-menu">';
		str+='</div></div>';
	
	build+='<div>'+str+'</div></div>';
	document.getElementById("poc").innerHTML=build;
}

//changers
function createBackgroundList(){
	var str = "";
	var itemsp = cur_pizza.tops;
	for(var top in itemsp){
		if(itemsp[top].selected){
			var temp = "empty";
			if(itemsp[top].amount == "full"){
				temp = pizza_options.tops[top].full;
			}
			else if(itemsp[top].amount == "left"){
				temp = pizza_options.tops[top].left;
			}
			else if(itemsp[top].amount == "right"){
				temp = pizza_options.tops[top].right;
			}

			if(temp != "empty"){
				str += "url(" + temp + "),";
			}
		}
	}
	str += "url(images/bases/pizza.png)";	
	pizza.style.backgroundImage = str;
}
function pizzaSizeSet(evt){
	var nameid = evt.target.id;	
	if(document.getElementById(nameid)){
		pizzaSizeSetId(nameid);
	}
}
function pizzaSizeSetId(nameid){
	for(var x in pizza_options.size){
		if(x!="catname"){
			var t = document.getElementById(x);
			t.style.background="transparent";
			t.removeEventListener('click', pizzaSizeSet);
			t.addEventListener('click', pizzaSizeSet);
		}
	}

	var btnItem = document.getElementById(nameid);
	cur_pizza.size = nameid;
	btnItem.removeEventListener('click', pizzaSizeSet);
	btnItem.style.background = "rgba(255,205,0,0.6)";
	var wind = document.getElementById('pizzabox').clientWidth;
	//console.log("wind: ",wind);//min:212, max~:1138
	wind = (wind>446? 446:wind);
	var size=300;
	if(nameid=="small"){		
		size=(wind/3)+(wind/12);
	}
	else if(nameid=="medium"){		
		size=(wind/2)+(wind/12);
	}
	else if(nameid=="large"){		
		size=(wind/2)+(wind/6);
	}
	else if(nameid=="jumbo"){		
		size=wind;
	}	
	if(wind<=400){
		size= 300;
	}
	pizza.style.width=size+"px";	
	pizza.style.height=size+"px";
	updateCurrentPizza();		
}

function addToCart(){
	toppingsTotal();
	var cute = pagesecs.checkout.pizzas;
	var namex ="";
	if(cur_pizza.presetSelected.is){
		document.getElementById(cur_pizza.presetSelected.name).style.background="transparent";
		namex+=pizza_options.presets[cur_pizza.presetSelected.name].name+": ";
		namex+=pizza_options.size[cur_pizza.size].name_short+"";
		var inparts = pizza_options.presets[cur_pizza.presetSelected.name].tops;
		var i;
		for(i=0; i<inparts.length; i++){
			var selected = cur_pizza.tops[inparts[i]].selected;
			if(!selected){
				namex+=", -"+inparts[i];
			}
		}
	}
	else{
		namex ="Pizza "+(cute.length+1)+": ";
		namex+=pizza_options.size[cur_pizza.size].name_short+"";
		for(var x in cur_pizza.tops){
			if(x!="catname"&&cur_pizza.tops[x].selected){
				namex+=", "+x;
			}
		}
	}
	var pizzaSubmit = {
		id:"piz"+(cute.length+1),
		name:namex,
		over5:cur_pizza.over5,
		cost:cur_pizza.cost,
		pizza:cur_pizza
	};
	cute[cute.length] = pizzaSubmit;
	console.log(pagesecs.checkout);
	buildEmptyPizza();
	updateCheckout();
	updateOrderListeners();
}
function orderCompleted(){
	//finished
//	console.log("completed");
	pagesecs.checkout.pizzas=[];
	pagesecs.checkout.total=0;
	buildEmptyPizza();
	updateCheckout();
//	document.getElementById('orderComplete').textContent="Finished";
	alert("Order has been placed!");
}

//Collapsing and open
function openSubBox(evt){
	updateCheckout();
	updateCurrentPizza();
	var nameid = evt.target.id;
	
	if(document.getElementById(nameid)){		
	if(alter){
		var i=0;
		for(i=0; i<collapseIds.length; i++){
			document.getElementById('sub-'+collapseIds[i] ).style.maxHeight=0;
//			console.log("id: ", collapseIds[i]);
//			document.getElementById(collapseIds[i]).removeEventListener('click', closeSubBox);
			document.getElementById(collapseIds[i]).addEventListener('click', openSubBox);
		}
	}
		var btnItem = document.getElementById(nameid);
		var box = document.getElementById('sub-'+nameid);
		box.style.maxHeight="30vh";	
		btnItem.removeEventListener('click', openSubBox);
		btnItem.addEventListener('click', closeSubBox);
	}
	else{
		console.log("open Error");
	}
}
function closeSubBox(evt){
	var nameid = evt.target.id;
	
	if(document.getElementById(nameid)){
		var btnItem = document.getElementById(nameid);
		var box = document.getElementById('sub-'+nameid);
		box.style.maxHeight=0;	
		btnItem.removeEventListener('click', closeSubBox);
		btnItem.addEventListener('click', openSubBox);
	}
	else{
		console.log("close Error");
	}
}

//Item updates and swaps
function addItemId(nameid){
	var btnItem = document.getElementById(nameid);
		if(cur_pizza.presetSelected.is){
			var btnx = document.getElementById(cur_pizza.presetSelected.name);
			btnx.style.background="transparent";
			cur_pizza.presetSelected={is:false, name:""};
		}
		updateCurrentPizza();
			cur_pizza.tops[nameid].selected=true;

		btnItem.textContent="- " + pizza_options.tops[nameid].name;
		btnItem.style.background="rgba(255,50,50,0.6)";
		btnItem.removeEventListener('click', addItem);
		btnItem.addEventListener('click', removeItem);
		updateCurrentPizza();
}
function addItem(evt){
	var nameid = evt.target.id;
	if(document.getElementById(nameid)){
		addItemId(nameid);		
	}
	else{
		console.log("nameid Error");
	}
}
function itemChange(evt){	
	var nameid = evt.target.id;
		nameid = nameid.replace("radio2-","");
		nameid = nameid.substr(1,nameid.length-1);
	if(document.getElementById(nameid)){
		var siz ="";
		var ops = document.getElementsByName("radio2-"+nameid);
		for(var x in ops){
			if(ops[x].checked){
				siz=ops[x].value;
			}
		}
		cur_pizza.tops[nameid].amount=siz;
		var nameid = evt.target.id;
		updateCurrentPizza();		
	}
	else{
		console.log("nameid Error");
	}
}

function removeItem(evt){
	var nameid = evt.target.id;
	
	if(document.getElementById(nameid)){
		var nameid= nameid.replace("remove-","");
		var btnItem = document.getElementById(nameid);
		cur_pizza.tops[nameid].selected=false;
//		cur_pizza.tops[nameid].amount="full";

		btnItem.textContent="+ " + pizza_options.tops[nameid].name;
		btnItem.style.background="transparent";
		btnItem.removeEventListener('click', removeItem);
		btnItem.addEventListener('click', addItem);

		updateCurrentPizza();
	}
	else{
		console.log("nameid Error");
	}
}	
function removePizza(evt){
	var nameid = evt.target.id;
//	console.log("tarid: ", nameid);
	
	if(document.getElementById(nameid)){
		var namet= nameid.replace("remove-","");
		var cute = pagesecs.checkout.pizzas;
		var i=0;
		var count=0;
		var tempL=[];
		for(i=0; i<cute.length; i++){
			if(namet != cute[i].id){
				tempL[count] = cute[i];
				count+=1;
			}
		}
		pagesecs.checkout.pizzas = tempL;
		updateCheckout();
	}
	else{
		console.log("nameid Error");
	}
}
function presetSelected(evt){
	var nameid = evt.target.id;	
	if(document.getElementById(nameid)){
		if(cur_pizza.presetSelected.is&&cur_pizza.presetSelected.name==nameid){
			for(var x in pizza_options.presets){
				if(x!="catname"){
					var t = document.getElementById(x);
					t.style.background="transparent";
				}
			}
			cur_pizza.presetSelected={is:false, name:""};			
			buildEmptyPizza();
		}
		else{
			for(var x in pizza_options.presets){
				if(x!="catname"){
					var t = document.getElementById(x);
					t.style.background="transparent";
				}
			}
			var btnitem = document.getElementById(nameid);
			btnitem.style.background="rgba(255,50,50,0.6)";
			var inparts = pizza_options.presets[nameid].tops;
			buildEmptyPizza();
			var i;
			for(i=0; i<inparts.length; i++){
				addItemId(inparts[i]);
			}
			cur_pizza.presetSelected={is:true, name:nameid};
			updateCurrentPizza();
		}
	}
}
function personalPreset(evt){
	var nameid = evt.target.id;	
	if(document.getElementById(nameid)){
		nameid = nameid.replace("double-","");
		buildEmptyPizza();
		var cute = pagesecs.checkout.pizzas;
		var tempPizza;
		var i;
		for(i=0; i<cute.length; i++){
			if(cute[i].id == nameid){
			   	tempPizza = cute[i].pizza;
				i=cute.length;
			   }
		}
		cur_pizza.size = tempPizza.size;
		cur_pizza.presetSelected = tempPizza.presetSelected;
		cur_pizza.numberOfToppings = tempPizza.numberOfToppings;
		cur_pizza.cost = tempPizza.cost;
		cur_pizza.over5 = tempPizza.over5;
		for(var x in tempPizza.tops){
			if(tempPizza.tops[x].selected){
				cur_pizza.tops[x].amount = tempPizza.tops[x].amount;
				addItemId(x);
			}
		}
		updateCurrentPizza();
	}
}

//section updates
function updateCheckout(){
	var cute = pagesecs.checkout.pizzas;
	var str="";
	var totalx =0;
	str+='<ul class="collapse-ul-cost">';
	var i=0;	
	for(i=0; i<cute.length; i++){
		str +='<li id="pizza-'+cute[i].id+'" class="cost-item">';
		str +='<div class="double"><button id="double-'+cute[i].id+'" class="double-btn">+</button></div>';
		str +='<div class="cost-box" '+(cute[i].over5?'title="5+ Topping special">*':'>')+'$'+cute[i].cost+'</div>';
		str +='<div class="name-box" title="'+cute[i].name+'">'+cute[i].name+'</div>';
		str +='<div class="remove-btn"><button id="remove-'+cute[i].id+'">Remove</button><div></li>';
		totalx+= cute[i].cost;
	}
	str+='</ul>';
	pagesecs.checkout.total = totalx;
	str+='<div><p id="checkoutTotal">Total Cost: $'+pagesecs.checkout.total+'</p></div>';
		str+='<button id="orderComplete">Order Complete</button>';
	document.getElementById("sub-checkout").innerHTML=str;
	updateOrderListeners();
}
function updateCurrentPizza(){
	toppingsTotal();
	var str="";
	str+='<div><button id="addtocart">Add to Cart</button></div>';	
	str+='<div style="position:static;position:sticky;top:-1px;background:#dce775;z-index:5;border-bottom:2px solid black"><p>Current Pizza Cost: $'+cur_pizza.cost+'</p></div>';
	if(cur_pizza.over5&& !cur_pizza.presetSelected.is){
		str+='<div><p> 5+ Topping special</p></div>';
	}
	str+='<ul class="collapse-ul-cost">';
		str +='<li id="curp-size" class="cost-item">';
		str +='<div class="cost-box">$'+pizza_options.size[cur_pizza.size].cost+'</div>';
		str +='<div class="name-box">'+pizza_options.size[cur_pizza.size].name+'</div>';
		str +='</li>';
		for(var topx in cur_pizza.tops){
			if(topx!="catname"&&cur_pizza.tops[topx].selected){
				str +='<li id="curp-'+topx+'" class="cost-item">';
				str +='<div class="cost-box">$'+pizza_options.tops[topx].cost+'</div>';
				str +='<div class="name-box">'+pizza_options.tops[topx].name+'</div>';
					str+='<div class="size-box">';
					
					str+='<label class="radio-container">';
					str+='<input value="full" type="radio" id="radio2-f'+topx+'" name="radio2-'+topx+'"';
					if(cur_pizza.tops[topx].amount=="full"){
						str+=' checked="checked"';
					}
					str+='/>';					
					str+='<span class="checkmark-full"></span></label>';					
					
					str+='<label class="radio-container">';
					str+='<input value="right" type="radio" id="radio2-r'+topx+'" name="radio2-'+topx+'"';
					if(cur_pizza.tops[topx].amount=="right"){
						str+=' checked="checked"';
					}
					str+='/>';
					str+='<span class="checkmark-right"></span></label>';
				
					str+='<label class="radio-container">';
					str+='<input value="left" type="radio" id="radio2-l'+topx+'" name="radio2-'+topx+'"';
					if(cur_pizza.tops[topx].amount=="left"){
						str+=' checked="checked"';
					}
					str+='/>';
					str+='<span class="checkmark-left"></span></label>';
					str+='</div></li>';
				str +='<div class="remove-btn"><button id="remove-'+topx+'">Remove</button></div>';
			}
		}
		str+='</ul>';
	document.getElementById("sub-currentPizza").innerHTML=str;
	createBackgroundList();
	updateCurPizzaListeners();
}
function toppingsTotal(){	
	var topsN =0;
	for(var topx in cur_pizza.tops){
		if(topx!="catname"&&cur_pizza.tops[topx].selected){
			topsN+=1;
		}		
	}
	cur_pizza.numberOfToppings=topsN;
	var totalCost=0;
	if(cur_pizza.presetSelected.is){
		totalCost+=pizza_options.presets[cur_pizza.presetSelected.name].cost;
	}
	else{
		for(var x in cur_pizza.tops){
			if(x!="catname"&&cur_pizza.tops[x].selected){
				totalCost += pizza_options.tops[x].cost;
			}
		}
		totalCost += (cur_pizza.numberOfToppings>=1?-1:0)+(cur_pizza.numberOfToppings>=5?-1:0);
		if(cur_pizza.numberOfToppings>=5){
		cur_pizza.over5=true;
		}
		else{
			cur_pizza.over5=false;		
		}
	}
	totalCost += pizza_options.size[cur_pizza.size].cost;
	cur_pizza.cost = totalCost;
	if(cur_pizza.presetSelected.is){
		cur_pizza.over5=false;
	}
//	document.getElementById("toptotal").innerHTML = "<p>Number Of Toppings Selected: "+cur_pizza.numberOfToppings+"</p>";
}

//add all listeners
function initializeListeners(){
//	console.log("init");
	for(var topx in pizza_options.size){
		if(topx!="catname"){
			document.getElementById(topx).addEventListener('click', pizzaSizeSet);
		} 
	}
	for(var top in pizza_options.tops){
		if(top!="catname"){
			document.getElementById(top).addEventListener('click', addItem);
		} 
	}
	for(var top in pizza_options.presets){
		if(top!="catname"){
			document.getElementById(top).addEventListener('click', presetSelected);
		} 
	}
	var i=0;
	for(i=0; i<collapseIds.length; i++){
		var t = document.getElementById(collapseIds[i]);
		t.addEventListener("click", openSubBox);
	}
}
function updateOrderListeners(){
	var cute = pagesecs.checkout.pizzas;
	var i=0;
	for(i=0; i<cute.length; i++){
		document.getElementById(('remove-'+cute[i].id)).addEventListener('click', removePizza);
		document.getElementById(('double-'+cute[i].id)).addEventListener('click', personalPreset);
	}	
	document.getElementById('orderComplete').addEventListener("click", orderCompleted);
}
function updateCurPizzaListeners(){
	for(var topx in cur_pizza.tops){
		if(topx!="catname"&&cur_pizza.tops[topx].selected){
			document.getElementById('remove-'+topx).addEventListener("click", removeItem);
			
			document.getElementById("radio2-f"+topx).addEventListener('click', itemChange);
			document.getElementById("radio2-l"+topx).addEventListener('click', itemChange);
			document.getElementById("radio2-r"+topx).addEventListener('click', itemChange);
		}
	}
	document.getElementById('addtocart').addEventListener("click", addToCart);
}


loadOptions();