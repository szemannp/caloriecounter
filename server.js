'use strict';

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var queries = require('./queries');

var app = express();

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'solar``7',
  database: 'caloriecounter'
});

var databaseQueries = queries(con);

var urlencodedParser = bodyParser.urlencoded({extended: false});

// server setup objects

var endpoints = {
  allItems: '/meals',
  withId: '/meals/:id'
};

var backendData = {
  staticFolder: './client',
  serverPort: 3000
};

var serverMessages = {
  listen: 'Server is listening port: '
};

// end of server setup

app.use(bodyParser.json());
app.use(express.static(backendData.staticFolder));


app.get(endpoints.allItems, function(req, res) {
  databaseQueries.getMeals(function(meals) {
    res.send(meals);
  });
});

app.post(endpoints.allItems, urlencodedParser, function(req, res) {
  databaseQueries.addMeal(req.body, function(row) {
    res.send(row);
  });
});

app.delete(endpoints.withId, urlencodedParser, function(req, res) {
  var toDelete = req.params.id;
  databaseQueries.deleteMeal(toDelete, function(meal) {
    res.send(meal);
  });
});

app.listen(backendData.serverPort);
console.log(serverMessages.listen + backendData.serverPort);
