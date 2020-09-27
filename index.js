var app = require('express')();

var bodyParser = require('body-parser');

var port = 2007;

var shortid = require('shortid');

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('db.json');
db = low(adapter);

db.defaults({list: []})
  .write();

// var list = [
// 			{id:1, name:"khiêm"},
// 			{id:2, name:"thảo"},
// 			{id:3, name:"hướng"},
// 			{id:4, name:"mạnh"},
// 			{id:5, name:"abc"}
// 		];

app.set('view engine', 'pug');

app.set('views', './views');

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', function(req,res){
	res.render("index",{
		name: "khiêm"
	});
});
 
app.get('/user', function(req,res){
	res.render("user/index",{
		listabc: db.get('list').value()
	});
});

app.get("/user/search", function(req,res){
	var q = req.query.q.toLowerCase();
	var searchs = db.get('list').value().filter(function(x){
		return x.name.indexOf(q) !== -1;
	});
	res.render("user/index",{
		listabc: searchs
	});
});

app.get('/user/create', function(req,res){
	res.render("create");
});

app.get('/user/:id',function(req,res){
	var ids = req.params.id;
	var users = db.get('list').find({id: ids}).value();
	res.render('user/view',{
		user : users
	});

})

app.post('/user/create', function(req,res){
	req.body.id = shortid.generate();
	db.get('list').push(req.body).write();
	res.redirect('/user');
});

app.listen(port, function(){
	console.log("thành công" + port);
})