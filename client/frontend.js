'use strict';

var serverUrl = 'http://localhost:3000/';

function sendRequest () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', serverUrl + 'meals', true);
  xhr.setRequestHeader('content/type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.send();
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      var parsedResponse = JSON.parse(xhr.response);
      console.log(parsedResponse);
    }
  }
}
