'use strict';

/*************************************
	Variables init
**************************************/
const STORAGE = 'todolist';

var data = new Object(),
		list = new Array(),
		item = {
			text: '',
			status: 'default',
			timestamp: null
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

		Object.defineProperty(list, 'isDeleteOn',{
			value: false,
			iterable: false,
			writable: true
		});
// var list = [
// 	// { text: 'Buy new sweatshirt', status: 'completed'},
// 	// { text: 'Begin promotional phase', status: 'completed'},
// 	// { text: 'Read an article', status: 'default'},
// 	// { text: 'Try not to fall asleep', status: 'default'},
// 	// { text: 'Watch ‘Sherlock’', status: 'default'},
// 	// { text: 'Begin QA for the product', status: 'default'},
// 	// { text: 'Go for a walk', status: 'default'}
// ]
/* end of default data */




/*************************************
		Main method
**************************************/
function readData() {
	var parsedData = JSON.parse(localStorage.getItem(STORAGE));

	if(parsedData == null) {
		parsedData = new Array();
		parsedData.isFirstTask = false;
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

function showRemoveButton() {
	document.querySelector('#remove').classList.add('slide-in-footer');
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

		document.querySelector('#content').classList.add('hidden');

		var itemToAdd = document.createElement('li'),
				timestamp = Date.now();

			itemToAdd.id = timestamp;
			itemToAdd.dataset.index = getListCount() + 1;
			itemToAdd.innerHTML = "<input type='text' class='text' autocomplete='off'> <span class='selector'></span>";
			itemToAdd.classList.add('slide-in');

			itemToAdd.querySelector('input').addEventListener('focus', trackChanges);
			itemToAdd.querySelector('.selector').addEventListener('click', markAsCompleted);
			listToAdd.prepend(itemToAdd);

			item.timestamp = timestamp;
			list.push(item); /* empty yet */
			saveData(JSON.stringify(list));

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

	if(list.isDeleteOn) { return; } // if delete mode on return false

	let currentIndex = this.parentElement.dataset.index - 1;

		list = readData();

		if(list[currentIndex].text == '') {
			//show message return false;
			this.parentElement.classList.toggle('shake-it');
			// this.parentElement.querySelector('input').setAttribute('placeholder', 'Rly?');
			return;
		}

		// console.log(list.isDeleteOn);

		list[currentIndex].status = 'completed';
		saveData(JSON.stringify(list));
		this.parentElement.classList.toggle('done');

}


/* takes list parameter as an array of objects and adds them to list */
function loadList(list){

	var listToAdd = document.querySelector('#list-to-add'),
		index;

	for(index = 0; index < list.length; index++){
		var item = list[index],
				newLi = document.createElement('li');

		if(item.status === 'removed') { continue; } // skip if removed

			newLi.id = list[index].timestamp;
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

function removeItem(item) {
	let items = readData(),
			itemTimestamp = item.id;

	item.remove();

	for(let i = 0; i < items.length; i++) {
			console.log(i);
		if(itemTimestamp == items[i].timestamp) {
			// console.log(i);
			items.splice(i,1);
			// console.log(items);
		}
	}
	// items.forEach(function(item) {
	// 	if(itemIndex == item.index) {
	// 	item.pop();
	// 	}
	// })
	// items[itemIndex].status = 'removed';
	saveData(JSON.stringify(items));
	console.log(items);
}

function addRemoveFunctionToItems(shouldRemove = false) {
	setDeleteModeAttr(shouldRemove);
	let items = document.querySelectorAll('#list-to-add li');

	for (var i = 0; i < items.length; i++) {

		if(shouldRemove) {
			items[i].setAttribute('onclick', 'removeItem(this)');
		} else {
			items[i].removeAttribute('onclick');
		}
	}
}

function setDeleteModeAttr(isOn) {
	list.isDeleteOn = isOn;
}

function toggleDeleteMode() {
	document.querySelector('.center-wrapper').classList.toggle('delete-mode');
	if(list.isDeleteOn) {
		addRemoveFunctionToItems(false);
	} else {
		addRemoveFunctionToItems(true);
	}
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

	document.querySelector('#remove').addEventListener('click', toggleDeleteMode);
	document.querySelector('#add').addEventListener('click', createNewItem);
	document.addEventListener('keyup',onKeyUp);

	if(list.length != 0) { // No data in the list
		loadList(list.reverse());
		loadData(data);
	}
	else {
		document.querySelector('#content').classList.remove('hidden');
		// show the message
	}

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
