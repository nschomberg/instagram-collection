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
instagramApp.controller('viewAllController', function($scope) {
	$scope.pageClass = 'page-view-all';
});

//View Single Controller
instagramApp.controller('viewSingleController', function($scope) {
	$scope.pageClass = 'page-view-single';
});

//Create Controller
instagramApp.controller('createController', function($scope) {
	$scope.pageClass = 'page-create';
});
