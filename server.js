console.log("Shalom Chaverim");
// call the packages we need
const MongoClient = require('mongodb').MongoClient
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express

// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine','ejs');

// get an instance of the express Router
var router = express.Router();

var numberOfDogs=0;

// a “get” at the root of our web app: http://localhost:3000/api
app.get('/', function(req, res) {
  //console.log("get");  //logs to terminal
  db.collection('dogs').find().toArray((err, result) => {
      if (err) return console.log(err)
    // renders index.ejs
      res.render('index.ejs', {dogs: result})

      console.log("result length " + result.length)

      numberOfDogs=0
      for (var i=0; i<=result.length; i++){
        numberOfDogs++
      }

    })
});


var db

MongoClient.connect('mongodb://madison:madison7@ds119503.mlab.com:19503/madison',{useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db('madison');
    var port = process.env.PORT || 80
    app.listen(port, () => {
        console.log('ITS WORKING!')
    })
})

app.post('/save', function(req, res) {

  var a=req.body.dogNameTextBox
  var b=req.body.dogFoodTextBox
  var c=req.body.dogPersonalityTextBox

  if (a!=""){
    db.collection('dogs').save({dogName: a, dogFood: b, dogPersonality: c, id: numberOfDogs} )
    numberOfDogs+=1
  }

  res.redirect("/");  //renders index page in browser
});

// DELETE function
app.get('/delete/:id', function(req, res) {

  var thisId=parseInt(req.params.id)

  db.collection('dogs').deleteOne({id:thisId})

  db.collection('dogs').updateMany({id: {$gt: thisId}}, {$inc: {id: -1}});

  res.redirect('/')

});

//EDIT function
app.get('/edit/:id', function (req, res) {

  var thisId=parseInt(req.params.id)

  db.collection('dogs').find({id:thisId}).toArray(function(err, result) {
      if (err) return console.log(err)

      res.render('edit.ejs', {dogDetails: result[0]})

  })

})

//UPDATE function
app.post('/update', function (req, res){

  var thisId=parseInt(req.body.id)
  var a=req.body.dogNameTextBoxEdit
  var b=req.body.dogFoodTextBoxEdit
  var c=req.body.dogPersonalityTextBoxEdit

  if (a!=""){
    db.collection('dogs').updateOne({"id": thisId}, { $set: {"dogName": a, "dogFood": b, "dogPersonality": c}})
    {upsert: true}
  }

  res.redirect("/") //renders index page in browser


})
