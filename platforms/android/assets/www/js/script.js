'use strict';

/*************************************
	Variables init
**************************************/
const STORAGE = 'todolist';

var data = new Object(),
	list = new Array(),
	item = {
		text: '',
		status: 'default'
	}


var d = new Date(), 
	days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

data.dayNumber = d.getDate();
data.month = months[d.getMonth()];
data.year = d.getFullYear();
data.dayName = days[d.getDay()];

/* default data */
var list = readData(),
	triedEmpty = 0;

/*[
	// { text: 'Buy new sweatshirt', status: 'completed'},
	// { text: 'Begin promotional phase', status: 'completed'},
	// { text: 'Read an article', status: 'default'},
	// { text: 'Try not to fall asleep', status: 'default'},
	// { text: 'Watch ‘Sherlock’', status: 'default'},
	// { text: 'Begin QA for the product', status: 'default'},
	// { text: 'Go for a walk', status: 'default'}
]*/
/* end of default data */




/*************************************
		Main method
**************************************/
function readData() {
	var parsedData = JSON.parse(localStorage.getItem(STORAGE));

	if(parsedData == null) {
		parsedData = new Array();
	}

	return parsedData;
}


function saveData(data) {
	localStorage.setItem(STORAGE, data);
}

function removeData() {
	localStorage.removeItem(STORAGE);
}

function getListCount() {
	return document.querySelectorAll('#list-to-add li').length;
}

function createNewItem(){

	var listToAdd = document.querySelector('#list-to-add'),
		lastIndex = getListCount(),
		lastItem = listToAdd.querySelector('li[data-index="' + lastIndex + '"] input'),
		pass = true;
		
		if(lastItem) { /* need to check if lastItem even exists */
			if(lastItem.value == '') { /* if exists and has and empty value*/
				pass = false; /* no passing for ya! */
				triedEmpty++; /* if tried to add empty task add + 1 */

				lastItem.parentElement.classList.remove('slide-in');
				lastItem.parentElement.classList.toggle('shake-it');
				lastItem.focus();

				if(triedEmpty > 4) {
					lastItem.setAttribute('placeholder', 'Why your task is empty?');
				}

			}
		} 
	

	if(pass) {

		var itemToAdd = document.createElement('li');

	
			itemToAdd.dataset.index = getListCount() + 1;
			itemToAdd.innerHTML = "<input type='text' class='text' autocomplete='off'> <span class='selector'></span>";
			itemToAdd.classList.add('slide-in');

			itemToAdd.querySelector('input').addEventListener('focus', trackChanges);
			itemToAdd.querySelector('.selector').addEventListener('click', markAsCompleted);

			list.push(item); /* empty yet */
			saveData(JSON.stringify(list));

			listToAdd.prepend(itemToAdd);

			//document.querySelector('#list-to-add li:first-child .selector').addEventListener('click', markAsCompleted);

			document.querySelector('#list-to-add li:first-child input').focus();
	}
}

function trackChanges() {

	var currentIndex = this.parentElement.dataset.index - 1;
	console.log(currentIndex);

	this.addEventListener('change', function(){

		list = readData();
		list[currentIndex].text = this.value; /* update changes */
		saveData(JSON.stringify(list));
		console.log('changed');

	});

}

function markAsCompleted(){

	var liItem = this.parentElement.classList.toggle('done'),
		currentIndex = this.parentElement.dataset.index - 1;

		list = readData();
		list[currentIndex].status = 'completed';
		saveData(JSON.stringify(list));
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

			newLi.dataset.index = list.length - index;

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

	loadList(list.reverse());
	loadData(data);


	/* add click events to all of the loaded elements */
	var items = document.querySelectorAll('#list-to-add li'),
		item,
		index;

	for(index = 0; index < items.length; index++){
		items[index].querySelector('input').addEventListener('focus', trackChanges);
		items[index].querySelector('.selector').addEventListener('click', markAsCompleted);

	}
	/* end of */


});