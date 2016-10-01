/*jshint node:true*/

/*
  NOTE: http://www.per-aspera.eu/tutorial-ember-2-http-mock-for-json-api-adapter
  was very helpful
*/

module.exports = function(app) {
  var express = require('express');
  var notesRouter = express.Router();
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  var nedb = require('nedb');
  var noteDB = new nedb({ filename : 'notes.nedb', autoload: true});

  notesRouter.get('/', function(req, res) {
    noteDB.find(req.query).exec(function(error, notes) {
      res.send({
        'notes': notes
      });
    });
  });

  notesRouter.post('/', function(req, res) {
    var data = req.body.data;
    var note = data.attributes;
    noteDB.find({}).sort({id : -1}).limit(1).exec(
      function(err, notes) {
        if(notes.length != 0)
          note.id =  notes[0].id + 1;
        else
          note.id = 1;
        noteDB.insert(note, function(err, newNote) {
          res.status(201);
          res.send(
            JSON.stringify(
            {
              note : newNote
            }));
        });
      })
  });

  notesRouter.get('/:id', function(req, res) {
    res.send({
      'notes': {
        id: req.params.id
      }
    });
  });

  notesRouter.put('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    noteDB.update({id: id}, {$set: req.body.note},
    function(err, numReplaced, newNotes) {
      res.send({
        'notes': {
          id: id
        }
      });
    });
  });

  notesRouter.delete('/:id', function(req, res) {
		var id = parseInt(req.params.id);
		noteDB.remove({id: id}, function(err, numRemoved) {
			res.status(204).end();
		});
  });

  app.use('/api/notes', require('body-parser').json({ type: 'application/vnd.api+json' }), notesRouter);
};
