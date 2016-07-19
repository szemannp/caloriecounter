'use strict';

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var serverPort = 3000;

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

con.connect(function (err) {
  if (err) {
    console.log('Error connecting to database');
    return;
  }
  console.log('Database connection established');
});

app.use(bodyParser.json());
app.use(express.static('client'));

// meal related methods, later have to be contained in meals module

function addMeal(meal, callback) {
  var table = [meal.name, meal.calorie, meal.date];
  var newQuery = mysql.format(serverQueries.postMeals, table);
  con.query(newQuery, function (err, result) {
    if (err) {
      return console.log(err.toString());
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
    console.log('Data recieved from DB:\n');
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
    res.json({'status': 'ok'});
  }
  addMeal(meal, callback);
});

app.delete(endpoints.withId, function (req, res) {
  var toDelete = serverQueries.deleteMeals + req.params.id;
  console.log(toDelete);
  con.query(toDelete, function(err, result) {
    if (err) {
      console.log({'status': 'not exists'});
    }
    console.log({'status': 'ok'});
    res.json({'status': 'ok'});
  });
});

app.listen(serverPort);
console.log('Server is listening port: ' + serverPort);
