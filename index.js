'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config.json');

mongoose.connect(config.mongodbUrl);
//var database = require('./lib/database-service');
//
//var instagram = require('./lib/instagram-api');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('public/index.html');
});

app.get('/api/collections', function(request, response) {
	console.dir(request.query);

	var Collection = require('./lib/models/collection');

	Collection.find({}, 'tag', function (err, collections) {
	  if (err) return err;
		response.json({
			message: collections
		});
	});
});

app.get('/api/content', function(request, response) {
	console.dir(request.query);

	var Collection = require('./lib/models/content');

	Collection.find({"_collection" : request.query.collection}, 'link created_time _collection', function (err, content) {
	  if (err) return err;
		response.json({
			message: content
		});
	});
});

app.post('/api/create', function(request, response) {
	console.dir(request.query);

	var instagram = require('./lib/instagram-api');

	instagram
		.collect(request.query.tag)
		.then(function(){
			response.json({
				message: 'request'
			});
		});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
