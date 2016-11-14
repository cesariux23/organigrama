var express = require('express');
var app = express();


app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
    adscripciones.findOne({raiz:true},function(err, doc){
        res.render('index', { raiz:doc._id});
    });
});

app.get('/:id', function (req, res) {
    var id=req.params.id;
    res.render('index', { raiz:id});
});

app.get('/adscripcion/:id', function (req, res) {

    adscripciones.aggregate(
        {$sort:{
                _id:1
            }
        },
        {
            $lookup: {
                from: 'adscripciones',
                localField: '_id',
                foreignField: 'super',
                as: 'subareas'
            }
        },
        {
          $lookup: {
              from: 'empleados',
              localField: '_id',
              foreignField: 'adscripcion',
              as: 'empleados'
          }
        },
        {
            $match:{
                '_id':req.params.id
            }
        }
    ,function(err, doc){
        //area primaria
        var area=doc[0];
        res.json(area);   
    });
});


var MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://localhost:27017/recursoshumanos', function(err, database) {
  if (err) return console.log(err)
  db = database;
    adscripciones=db.collection('adscripciones');
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
