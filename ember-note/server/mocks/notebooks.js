/*jshint node:true*/

/*
  NOTE: http://www.per-aspera.eu/tutorial-ember-2-http-mock-for-json-api-adapter
  was very helpful
*/

module.exports = function(app) {
  var express = require('express');
  var notebooksRouter = express.Router();
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  var nedb = require('nedb');
  var notebookDB = new nedb({ filename : 'notebooks.nedb', autoload: true});

  notebooksRouter.get('/', function(req, res) {
    notebookDB.find(req.query).exec(function(error, notebooks) {
      notebooks.forEach(u => u.type = 'notebook');
      res.send({
        'data': notebooks
      });
    });
  });

  notebooksRouter.post('/', function(req, res) {
    var data     = req.body.data;
    var notebook = data.attributes;
    notebookDB.find({}).sort({id : -1}).limit(1).exec(
      function(err, notebooks) {
        if(notebooks.length != 0)
          notebook.id =  notebooks[0].id + 1;
        else
          notebook.id = 1;
        notebookDB.insert(notebook, function(err, newNotebook) {
          res.status(201);
          res.send(
            JSON.stringify(
            {
              notebook : newNotebook
            }));
        });
      })
  });

  notebooksRouter.get('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.put('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/notebooks', require('body-parser').json({ type: 'application/vnd.api+json' }), notebooksRouter);
};
