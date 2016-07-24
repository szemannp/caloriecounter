'use strict';

var dataContainer = {
  serverUrl: 'http://localhost:3000/',
  rowHTML: '<td class="name"></td><td class="calorie"></td><td class="date"></td>',
  totalCalories: 0
};

var selectors = {
  meal: document.querySelector('#meal-input'),
  calorie: document.querySelector('#calorie-input'),
  date: document.querySelector('#date-input'),
  add: document.querySelector('#add')
};

var inputData = {
  inputMeal: selectors.meal.value,
  inputCalorie: selectors.calorie.value,
  inputDate: selectors.date.value
};

function sendRequest () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', dataContainer.serverUrl + 'meals', true);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.send();
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      var parsedResponse = JSON.parse(xhr.response);
      console.log(parsedResponse);
      responseIterator(parsedResponse);
    }
  }
}

function responseIterator(serverResponse) {
  resetTotal();
  for (var i = 0; i < serverResponse.length; i++) {
      setNewRow(serverResponse[i]);
  }
}

function setNewRow(responseElement) {
  var listParent = document.querySelector('.db-container');
  var newRow = document.createElement('tr');
  newRow.classList.add('row' + responseElement.id);
  newRow.innerHTML = dataContainer.rowHTML;
  listParent.appendChild(newRow);
  var listRow = document.querySelector('.row' + responseElement.id);
  listRow.childNodes[0].textContent = responseElement.name;
  listRow.childNodes[1].textContent = responseElement.calorie;
  listRow.childNodes[2].textContent = responseElement.date;
  getTotalCalories(responseElement);
}

function resetTotal() {
  dataContainer.totalCalories = 0;
}

function getTotalCalories(responseElement) {
  dataContainer.totalCalories += responseElement.calorie;
  var totalContainer = document.querySelector('#total');
  totalContainer.textContent = dataContainer.totalCalories;
}

function addItem() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', dataContainer.serverUrl, true);
  xhr.onload = function(){
    var meals = xhr.response;
    console.log(meals);
    setNewRow((meals[meals.length - 1].id) + 1);
  };
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify(toAddValue));
  xhr.onload = function(){
    window.location.reload();
  };
}

window.onload = sendRequest();
