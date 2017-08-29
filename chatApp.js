//*****Express stuff*********
var express = require('express');
var app = express();
app.use(express.static('public'));

//*****BodyParser stuff*******
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//*****Handlebars stuff******
//Create instance of handlebars let it know default layout is 'main'
//Default layout is the area all the other contents will be inserted
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//.handlebars extensions are managed by handlebars
app.engine('handlebars', handlebars.engine);
//Lets us ignore .handlebars extensions
app.set('view engine', 'handlebars');

var helpers = require('handlebars-helpers')();

//*****MySQL stuff******
var mysql = require('./dbcon.js');

app.set('port', 8002);
//*****Routes*************

//This is the route called when the homepage is first visited, and when the
//back button is pressed on the update page.
app.get('/',function(req,res,next){
    var context = {};

    res.render('home', context);
});

//This route is called by the submit button on the home page. It takes the values
//passed to it and adds them to the database.
app.post('/insert',function(req,res,next){
	var data = {textValue: req.body.text};
	var sql = "INSERT INTO messages SET ?";
	
    mysql.pool.query(sql, data, function(err){
        if (err){
            next(err);
            return;
        }
    });
});

//This route grabs the table data and uses handlebars to update the table in
//the home page.
app.get('/getMessages',function(req,res,next){
    var context = {};

    mysql.pool.query("SELECT * FROM messages", function(err, rows){
        if (err){
            next(err);
            return;
        }

        context.rows = rows;

        res.send(JSON.stringify(context));
    });
});

//*****Error Handling********
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});
//***************************

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

