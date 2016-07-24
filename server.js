'use strict';

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var queries = require('./queries');

var app = express();

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
  conError: 'Error connecting to database',
  conSuccess: 'Database connection established',
  getSuccess: 'Data recieved from DB:\n',
  statusFail: {'status': 'not exists'},
  statusOk: {'status': 'ok'},
  listen: 'Server is listening port: '
};

var serverQueries = {
  getMeal: 'SELECT * FROM meals',
  postMeal: 'INSERT INTO meals (name, calorie, date) VALUES (?, ?, ?)',
  deleteMeals: 'DELETE FROM meals WHERE id=?'
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
