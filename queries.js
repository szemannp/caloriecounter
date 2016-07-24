'use strict';

var meal = (function(con) {

  var serverMessages = {
    conError: 'Error connecting to database',
    conSuccess: 'Database connection established',
    statusFail: {'status': 'not exists'},
    statusOk: {'status': 'ok'}
  };

  var serverQueries = {
    getMeals: 'SELECT * FROM meals',
    postMeals: 'INSERT INTO meals (name, calorie, date) VALUES (?, ?, ?)',
    deleteMeals: 'DELETE FROM meals WHERE id='
  };

  con.connect(function(err) {
    if (err) {
      console.log(serverMessages.conError);
      return;
    }
    console.log(serverMessages.conSuccess);
  });

  function getMeals(cbFunct) {
    con.query(serverQueries.getMeals, function(err, meals) {
      if (err) {
        console.log(err.toString());
        return;
      }
      cbFunct(meals);
    });
  };

  function addMeal(attributes, cbFunct) {
    var query = serverQueries.postMeal;
    var queryParams = [attributes.name, attributes.calorie, attributes.date];
    con.query(query, queryParams, function(err, meal) {
      if (err) {
        console.log(err.toString());
        return;
      }
      cbFunct({
        id: meal.insertId,
        name: attributes.name,
        calorie: attributes.calorie,
        date: attribute.date
      });
    });
  };

  function deleteMeal(id, cbFunct) {
    con.query(serverQueries.deleteMeal, id, function(err, meal) {
      if (err) {
        console.log(err.toString());
        return;
      } else if (meal.affectedRows === 1) {
        callback({id: id});
      } else {
        callback(serverMessages.statusFail);
      }
    });
  };

  return {
    getMeals: getMeals,
    addMeal: addMeal,
    deleteMeal: deleteMeal
  }
});

module.exports = meal;
