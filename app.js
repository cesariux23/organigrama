var express = require('express');
var app = express();


app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
    adscripciones.findOne({raiz:true},function(err, doc){
        console.log(doc);
        res.render('index', { raiz:doc}); 
    });
});

app.get('/:id', function (req, res) {
    var id=req.params.id;
     adscripciones.findOne({'_id':id},function(err, doc){
         if(err){
             console.log(err);
         }
         else{
            console.log(doc);
            res.render('index', { raiz:doc}); 
         }
    });
});

app.get('/adscripcion/:id', function (req, res) {
    
    var raiz = adscripciones.aggregate(
        {
            $lookup: {
                from: 'adscripciones',
                localField: '_id',
                foreignField: 'super',
                as: 'subareas'
            }
        },
        {orderby:{'staff':1, '_id':1}}
        {$match:{'_id':req.params.id}}
    ,function(err, doc){
        res.json(doc[0]);
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
