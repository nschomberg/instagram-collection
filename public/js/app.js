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
instagramApp.controller('viewAllController', function($scope, $http) {
	$scope.pageClass = 'page-view-all';
	$scope.isLoading = true;
	$scope.isError = false;

	$scope.collections = [];


	// Here we define the init function for the controller
	var doInit = function(ctrl) {
		// Make a GET request to the API to get all collections
		$http({
				method: 'GET',
				url: '/api/collections'
			})
			.then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				//Assign the repsonse's collection data to our scope
				$scope.collections = response.data.result;
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

//View Single Controller
instagramApp.controller('viewSingleController', function($scope, $http, $location) {
	$scope.pageClass = 'page-view-single';
	$scope.isLoading = true;
	$scope.isError = false;

	$scope.contents = [];
	$scope.selectedContent = {};
	var collectionId = $location.search()
		.collection;
	console.log(collectionId);
	// Here we define the init function for the controller
	var doInit = function(ctrl) {
		// Make a GET request to the API to get all collections
		$http({
				method: 'GET',
				url: '/api/collections?collection=' + collectionId
			})
			.then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				//Assign the repsonse's collection data to our scope
				$scope.contents = response.data.result;
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
instagramApp.controller('createController', function($scope, $http, $window) {
	$scope.pageClass = 'page-create';
	$scope.isLoading = false;
	$scope.tag = {};

	// Here we define the init function for the controller
	$scope.create = function() {
		$scope.isLoading = true;

		$http.defaults.headers.post["Content-Type"] = "application/json";
		$http({
				method: 'POST',
				url: '/api/create',
				data: {
					'tag': $scope.tag.value
				}
			})
			.then(function success(response) { // this callback will be called asynchronously when the response is available
				console.dir(response);
				$scope.isLoading = false;
				$scope.isError = false;
				//Redirect to the view page for the newly created collection
				$window.location.href = '/#view?collection=' + response.data.result;
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);
				$scope.isLoading = false;
				$scope.isError = true;

			});
	};
});
