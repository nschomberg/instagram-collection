var instagramApp = angular.module('instagramApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

//Here, let's define some routes for the single page-app
instagramApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/page-home.html',
			controller: 'homeController'
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

//Nav controller handles logic in the navbar
instagramApp.controller('navController', function($scope, $location) {
	//Determine if the current nav element should be active based on the current URL
	$scope.isActive = function(paths) {
		for (var i = 0; i < paths.length; i++) {
			if (paths[i] == $location.path()) {
				return true;
			}
		}
		return false;
	};
});

//Home page controller
instagramApp.controller('homeController', function($scope) {
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

	window.onscroll = function(ev) {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			console.log('goof doof');
		}
	};
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

	//Set default to between now and yesterday
	$scope.startDate = new Date();
	$scope.startDate.setDate($scope.startDate.getDate()-1);
	$scope.endDate = new Date();

	$scope.setMaxDate = function() {
		// no min date
		$scope.dateOptions.minDate = null;

		//Set max date to right now
		var maxDate = new Date();
		$scope.dateOptions.maxDate = maxDate;
	};

	$scope.dateOptions = {
		showWeeks: false,
		startingDay: 0
	};

	$scope.setMaxDate();

	// Disable weekend selection
	$scope.disabled = function(calendarDate, mode) {
		return;
	};

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dateOpened = true;
	};

	$scope.startOpened = false;
	$scope.endOpened = false;

	$scope.hourStep = 1;
	$scope.format = "dd-MMM-yyyy";
	$scope.minuteStep = 15;

	$scope.timeOptions = {
		hourStep: [1, 2, 3],
		minuteStep: [1, 5, 10, 15, 25, 30]
	};

	$scope.showMeridian = true;
	$scope.timeToggleMode = function() {
		$scope.showMeridian = !$scope.showMeridian;
	};

	$scope.$watch("date", function(date) {
		// read date value
	}, true);

	$scope.resetHours = function() {
		$scope.date.setHours(1);
	};
});

//This directive provides a simple template for showing a loader across our views with the <loader/> tag
instagramApp.directive('loader', function() {
	return {
		restrict: 'E', //<loader/> to call the directive
		scope: {
			show: '=' //HTML attribute to control whether to display the directive or not
		},
		template: '<div ng-if="show" class="loader center">' +
			'<i class="fa fa fa-gear fa-spin" aria-hidden="true"></i>' +
			'</div>',
		link: function($scope, elem, attr) {}
	};
});

//This directive provides a simple template for showing an "error" message across our views with the <error/> tag
instagramApp.directive('error', function() {
	return {
		restrict: 'E', //<error/> to call the directive
		scope: {
			show: '=' //HTML attribute to control whether to display the directive or not
		},
		template: '<div ng-if="show">' +
			'<h1>ERROR</h1>' +
			'</div>',
		link: function($scope, elem, attr) {}
	};
});

//This directive provides a simple template for showing an "empty" message across our views with the <empty/> tag
instagramApp.directive('empty', function() {
	return {
		restrict: 'E', // <empty/> to call the directive
		scope: {
			show: '=' //HTML attribute to control whether to display the directive or not
		},
		template: '<div ng-if="show" class="empty center">' +
			'Empty :(' +
			'</div>',
		link: function($scope, elem, attr) {}
	};
});

//This directive provides a back button
instagramApp.directive('backButton', function() {
	return {
		restrict: 'E', // <back-button/> to call the directive
		template: '<button onclick="history.back()" class="btn btn-lg btn-default text-right landing-button"><i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;Back</button>',
		link: function($scope, elem, attr) {}
	};
});
