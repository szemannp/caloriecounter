'use strict';

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var app = express();

var con = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'caloriecounter'
});

var serverQueries = {
  getMeals: 'SELECT * FROM meals',
  postMeals: 'INSERT INTO meals (name, calorie, date) VALUES (?, ?, ?)',
  deleteMeals: 'DELETE FROM meals WHERE id='
};

var endpoints = {
  overall: '/meals',
  withId: '/meals/:id'
};

var serverMessages = {
  conError: 'Error connecting to database',
  conSuccess: 'Database connection established',
  getSuccess: 'Data recieved from DB:\n',
  statusFail: {'status': 'not exists'},
  statusOk: {'status': 'ok'},
  listen: 'Server is listening port: '
};

var backendData = {
  staticFolder: 'client',
  serverPort: 3000
};

con.connect(function (err) {
  if (err) {
    console.log(serverMessages.conError);
    return;
  }
  console.log(severMessages.conSuccess);
});

app.use(bodyParser.json());
app.use(express.static(backendData.staticFolder));

// meal related methods, later have to be contained in meals module

function addMeal(meal, callback) {
  var table = [meal.name, meal.calorie, meal.date];
  var newQuery = mysql.format(serverQueries.postMeals, table);
  con.query(newQuery, function (err, result) {
    if (err) {
      return console.log(serverQueries.statusFail);
    }
    callback(result);
  });
}

// server methods

app.get(endpoints.overall, function (req, res) {
  con.query(serverQueries.getMeals, function (err, result) {
    if (err) {
      console.log(err.toString());
    }
    console.log(serverMessages.getSuccess);
    console.log(result);
    res.json(result);
  });
});

app.post(endpoints.overall, function (req, res) {
  var meal = {
    name: req.body.name,
    calorie: req.body.calorie,
    date: null
  }
  var callback = function (result) {
    console.log(result);
    res.json(serverMessages.statusOk);
  }
  addMeal(meal, callback);
});

app.delete(endpoints.withId, function (req, res) {
  var toDelete = serverQueries.deleteMeals + req.params.id;
  console.log(toDelete);
  con.query(toDelete, function(err, result) {
    if (err) {
      console.log(serverMessages.statusFail);
    }
    console.log(serverMessages.statusOk);
    res.json(serverMessages.statusOk);
  });
});

app.listen(backendData.serverPort);
console.log(serverMessages.listen + backendData.serverPort);
