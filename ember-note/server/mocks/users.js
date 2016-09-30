/*jshint node:true*/

/*
  NOTE: http://www.per-aspera.eu/tutorial-ember-2-http-mock-for-json-api-adapter
  was very helpful
*/

module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  // Use the body-parser library in this service
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  // Create an embedded table using NEDB if it doesn't yet exist
  var nedb = require('nedb');
  var userDB = new nedb({ filename : 'users.nedb', autoload: true});

  // The POST URL is used to create a new record
  usersRouter.post('/', function(req, res) {
    var data = req.body.data;
    //console.log("data = " + JSON.stringify(data));
    var user = data.attributes;
    //console.log("user = " + JSON.stringify(user));

    // Look for the most recently created record and use it to set the id
    // field of our incoming record, which is required by Ember Data
    userDB.find({}).sort({id : -1}).limit(1).exec(function(err, users) {
      if(users.length != 0)
        user.id = users[0].id + 1;
      else
        user.id = 1;

      // Insert the new record into our datastore, and return the newly
      // created record to Ember Data
      userDB.insert(user, function(err, newUser) {
        //console.log("newUser = " + JSON.stringify(newUser));
        res.status(201);
        res.send(
          JSON.stringify(
          {
            user : newUser
          }));
      });
    })
  });

  usersRouter.get('/', function(req, res) {
    userDB.find(req.query).exec(function(error, users) {
      res.send({
        'users': users
      });
    });
  });

  usersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  usersRouter.get('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.put('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/users', require('body-parser').json());
  app.use('/api/users', require('body-parser').json({ type: 'application/vnd.api+json' }), usersRouter);
  //app.use('/api/users', usersRouter);
};
