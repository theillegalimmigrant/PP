(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();
  var mongojs = require('mongojs');
  var mongoose = require('mongoose');

  var User = require('../models/user');
  var Room = require('../models/room');

  var mdb = mongoose.connect('mongodb://localhost/meanPokerplanner').connection;
  //var mdb = mongoose.connection.openUri('mongodb://localhost/meanPokerplanner');

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/api/rooms', function(req, res) {
    Room.find(function(err, data) {
      res.json(data);
    });
  });

  router.get('/api/room', function(req, res) {
    Room.findOne({'_id': req.query.id}, function(err, data) {
      res.json(data);
    });
  });


  router.post('/api/rooms', function(req, res) {
    var newRoom = new Room ({
        name: req.body.name,
        leader: req.body.leader,
        jiras: req.body.jiras
    });
    newRoom.save(function(err,data) {
       if (err) { res.json(err); } else {res.json(data);}
    });
  });

  router.put('/api/test', function(req, res) {

    Room.update({"_id": req.body._id},{$set: {  leader: req.body.leader, name: req.body.name, jiras: req.body.jiras }}, function(err, data){
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });

  });

  router.delete('/api/rooms/:_id', function(req, res) {
    db.room.remove({
      _id: mongojs.ObjectId(req.params._id)
    }, '', function(err, data) {
      res.json(data);
    });

  });

   router.get('/api/users', function(req, res) {
    User.find(function(err, data) {
      res.json(data);
    });
  });

   router.post('/api/users', function(req, res) {
     User.findOneOrCreate({name: req.body.name}, {name: req.body.name}, function(err,data) {
        if (err) { res.json(err); } else {res.json(data);}
     });
   });

  module.exports = router;

}());