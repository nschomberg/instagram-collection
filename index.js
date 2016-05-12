'use strict';

//Load up the config file
let config = require('./config.json');

//Set up the app to use the Express module
let express = require('express');
let app = express();

//Set up json body parsing for POST requests
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//Set up and connect to MongoDB using Mongoose module
let mongoose = require('mongoose');
mongoose.connect(config.mongodbUrl);

//Set up the port: 5000 unless otherwise defined (eg Heroku process)
app.set('port', (process.env.PORT || 5000));

//Set up the server to read static files from the public directory
app.use(express.static(__dirname + '/public'));

//Default route returns the home page
app.get('/', function(request, response) {
	response.render('public/index.html');
});


//API: GET all collections
app.get('/api/collections', function(request, response) {
	console.dir(request.query);

	let Collection = require('./lib/models/collection');
	let query = {};
	let queryFields = 'tag';

	Collection.find(query, queryFields)
		.then(function(queryResult) {
			response.json({
				collections: queryResult
			});
		})
		.catch(function(queryError) {
			response.json({
				message: queryError
			});
		});
});

app.get('/api/content', function(request, response) {
	console.dir(request.query);

	let Collection = require('./lib/models/content');
	let collectionId = request.query.collection;
	let query = {
		"_collection": collectionId
	};
	let queryFields = 'link created_time images _collection';

	Collection.find(query, queryFields)
		.then(function(queryResult) {
			response.json({
				content: queryResult
			});
		})
		.catch(function(queryError) {
			response.json({
				message: queryError
			});
		});
});

app.post('/api/create', function(request, response) {

	//Load up the Instagram API module
	let instagram = require('./lib/instagram-api');

	instagram.collect(request.body.tag)
		.then(function(result) {
			response.json({
				message: 'Success!',
				collection: result
			});
		})
		.catch(function(error) {
			response.json({
				error: error,
				message: 'Oops, something went wrong'
			});
		});
});

/*app.post('/api/create', function(request, response) {

	console.dir(request);
	console.dir(request.body);
	console.dir(typeof request.body);
	console.dir(typeof request);



	let instagram = require('./lib/instagram-api');

	instagram.collect(request.query.tag)
		.then(function(result) {
			response.json({
				message: 'doof'
			});
		})
		.catch(function(error) {
			response.json({
				error: error,
				message: 'Oops, something went wrong'
			});
		});
});*/


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
