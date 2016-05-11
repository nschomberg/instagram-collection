var instagramApp = angular.module('instagramApp', ['ngRoute', 'ngAnimate']);


//Here, let's define some routes for the single page-app
instagramApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/page-home.html',
			controller: 'mainController'
		})
		.when('/all', {
			templateUrl: 'views/page-view-all.html',
			controller: 'viewAllController'
		})
		.when('/view', {
			templateUrl: 'views/page-view-single.html',
			controller: 'viewSingleController'
		})
		.when('/create', {
			templateUrl: 'views/page-create.html',
			controller: 'createController'
		});
});

//Here we define a couple of different controllers

//Main Controller
instagramApp.controller('mainController', function($scope) {
	$scope.pageClass = 'page-home';
});

//View All Controller
instagramApp.controller('viewAllController', function($scope,$http) {
	$scope.pageClass = 'page-view-all';
	$scope.isLoading = true;

	$scope.collections = [];

	// Here we define the init function for the controller
	var doInit = function(ctrl){
		// Make a GET request to the API to get all collections
		$http({
			method: 'GET',
			url: '/api/collections'
		}).then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				//Assign the repsonse's collection data to our scope
				$scope.collections = response.data.collections;
				//
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);

			});
	};

	//Initialize controller on load
	doInit(this);


});

//View Single Controller
instagramApp.controller('viewSingleController', function($scope,$http,$location) {
	$scope.pageClass = 'page-view-single';
	$scope.isLoading = true;
	$scope.isError = false;

	$scope.contents = [];
	var collectionId = $location.search().collection;
	console.log(collectionId);
	// Here we define the init function for the controller
	var doInit = function(ctrl){
		// Make a GET request to the API to get all collections
		$http({
			method: 'GET',
			url: '/api/content?collection=' + collectionId
		}).then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				//Assign the repsonse's collection data to our scope
				$scope.contents = response.data.content;
				$scope.isLoading = false;
				$scope.isError = false;
				//
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);
				$scope.isLoading = false;
				$scope.isError = true;

			});
	};

	//Initialize controller on load
	doInit(this);
});

//Create Controller
instagramApp.controller('createController', function($scope,$http) {
	$scope.pageClass = 'page-create';

	$scope.tag = "default";

	// Here we define the init function for the controller
	$scope.create = function(){
		console.log($scope.tag);
		// Make a GET request to the API to get all collections
		$http.post('/api/create?tag='+$scope.tag, {tag:$scope.tag}).then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				//Assign the repsonse's collection data to our scope
				//$scope.contents = response.data.content;
				alert('done');
				$scope.isLoading = false;
				$scope.isError = false;
				//
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);
				$scope.isLoading = false;
				$scope.isError = true;

			});
	};
});
