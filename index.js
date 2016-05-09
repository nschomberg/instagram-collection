var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config.json');

mongoose.connect(config.mongodbUrl);
//var database = require('./lib/database-service');
//
var instagram = require('./lib/instagram-api');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.get('/api/collections', function(request, response) {
	response.json({
		message: 'success'
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
