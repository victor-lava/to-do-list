'use strict';

/*************************************
	Variables init
**************************************/

var data = new Object(),
	list = new Array(),
	item = {
		text: '',
		status: 'default'
	}


var d = new Date();
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

data.dayNumber = d.getDay();
data.month = '';
data.year = d.getFullYear();
data.dayName = days[d.getDay()];

/* default data */
var list = [
	{ text: 'Buy new sweatshirt', status: 'completed'},
	{ text: 'Begin promotional phase', status: 'completed'},
	{ text: 'Read an article', status: 'default'},
	{ text: 'Try not to fall asleep', status: 'default'},
	{ text: 'Watch ‘Sherlock’', status: 'default'},
	{ text: 'Begin QA for the product', status: 'default'},
	{ text: 'Go for a walk', status: 'default'}
]
/* end of default data */


/*************************************
		Main method
**************************************/

function createNewItem(){

	var listToAdd = document.querySelector('#list-to-add'),
		itemToAdd = document.createElement('li');


		itemToAdd.innerHTML = "<input type='text' class='text' autocomplete='off'> <span class='selector'></span>";
		itemToAdd.classList.add('slide-in');
		itemToAdd.querySelector('.selector').addEventListener('click', markAsCompleted);

		list.push(item);
		listToAdd.prepend(itemToAdd);

		//document.querySelector('#list-to-add li:first-child .selector').addEventListener('click', markAsCompleted);

		document.querySelector('#list-to-add li:first-child input').focus();
	
}

function markAsCompleted(){

	var liItem = this.parentElement.classList.toggle('done');

		//liItem.add('done');

	//alert('done');

}


/* takes list parameter as an array of objects and adds them to list */
function loadList(list){

	var listToAdd = document.querySelector('#list-to-add'),
		index;

	for(index = 0; index < list.length; index++){
		var item = list[index],
			newLi = document.createElement('li');

			newLi.innerHTML = "<input type='text' value='" + item.text + "' class='text' autocomplete='off'> <span class='selector'></span>";

			if(item.status == 'completed'){
				newLi.classList.add('done');
			}

			listToAdd.append(newLi);
	}

}

function loadData(data){

	document.querySelector('.center-wrapper #day').innerHTML = data.dayNumber;
	document.querySelector('.center-wrapper #month').innerHTML = data.month;
	document.querySelector('.center-wrapper #dayName').innerHTML = data.dayName;
	document.querySelector('.center-wrapper #year').innerHTML = data.year;


}

function onKeyUp(event){
	switch(event.keyCode){
		case 13:
		createNewItem();
		break;
	}
	//alert(event.keyCode);
}

/*************************************
			Boot
**************************************/

document.addEventListener('DOMContentLoaded', function(){



	document.querySelector('#add').addEventListener('click', createNewItem);
	document.addEventListener('keyup',onKeyUp);

	loadList(list);
	loadData(data);


	/* add click events to all of the loaded elements */
	var items = document.querySelectorAll('#list-to-add li .selector'),
		index;

	for(index = 0; index < items.length; index++){
		items[index].addEventListener('click', markAsCompleted);

	}
	/* end of */


});