(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var mongojs = require('mongojs');
  var db = mongojs('meanPokerplanner', ['pokerplanner']);

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/api/pokerplanner', function(req, res) {
    db.pokerplanner.find(function(err, data) {
      res.json(data);
    });
  });

  router.post('/api/pokerplanner', function(req, res) {
    db.pokerplanner.insert(req.body, function(err, data) {
      res.json(data);
      console.dir(data);
    });

  });

  router.put('/api/pokerplanner', function(req, res) {

    db.pokerplanner.update({
      _id: mongojs.ObjectId(req.body._id)
    }, {
      isCompleted: req.body.isCompleted,
      pokerplanner: req.body.pokerplanner
    }, {}, function(err, data) {
      res.json(data);
      console.dir(data);
    });

  });

  router.delete('/api/pokerplanner/:_id', function(req, res) {
    db.pokerplanner.remove({
      _id: mongojs.ObjectId(req.params._id)
    }, '', function(err, data) {
      res.json(data);
    });

  });

  module.exports = router;

}());