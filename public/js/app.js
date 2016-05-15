/**
 * This Angular app contains all the logic for running the front-end
 */

var instagramApp = angular.module('instagramApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

/**
 * Routes for the single page-app
 */
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

/**
 * navController handles logic in the navbar
 */
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

/**
 * homeController handles logic on the Home page
 */
instagramApp.controller('homeController', function($scope) {
	$scope.pageClass = 'page-home';
});

/**
 * viewAllController handles logic on the View All page
 */
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

/**
 * viewSingleController handles logic on the View page
 */
instagramApp.controller('viewSingleController', function($scope, $http, $location) {
	$scope.pageClass = 'page-view-single';
	$scope.isLoading = true;
	$scope.isLoadingMore = false;
	$scope.isError = false;

	//pagination variables
	$scope.offset = 0;
	$scope.limit = 50;
	$scope.page = 0;

	//collection and list of content
	$scope.collection = {};
	$scope.contents = [];

	//selected content will be displayed in the modal
	$scope.selectedContent = {};
	var collectionId = $location.search()
		.collection;
	console.log(collectionId);

	var makeCallout = function() {
		return $http({
			method: 'GET',
			url: '/api/collections?collection=' + collectionId + '&limit=' + $scope.limit + '&offset=' + $scope.offset
		});
	};

	var onCalloutFinish = function(response) {
		console.dir(response);
		$scope.isError = false;
		$scope.collection = response.data.collection;
		for (var content of response.data.content.docs) {
			$scope.contents.push(content);
		}
		$scope.offset = parseInt(response.data.content.offset) + parseInt(response.data.content.limit);
		$scope.limit = response.data.content.limit;
		$scope.total = response.data.content.total;
	};

	// Here we define the init function for the controller
	var doInit = function(ctrl) {
		// Make a GET request to the API to get all collections
		makeCallout()
			.then(function success(response) { // this callback will be called asynchronously when the response is available
				onCalloutFinish(response);
				$scope.isLoading = false;
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);
				$scope.isLoading = false;
				$scope.isError = true;
			});
	};

	queryMore = function() {
		$scope.isLoadingMore = true;
		makeCallout()
			.then(function success(response) { // this callback will be called asynchronously when the response is available
				onCalloutFinish(response);
				$scope.isLoadingMore = false;
			}, function error(response) { // called asynchronously if an error occurs or server returns response with an error status.
				console.dir(response);
				$scope.isLoadingMore = false;
				$scope.isError = true;
			});
	};

	//Initialize controller on load
	doInit(this);

	window.onscroll = function(ev) {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !$scope.isLoadingMore && $scope.offset < $scope.total) {
			queryMore();
		}
	};
});

/**
 * createController handles logic on the Create page
 */
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
					'tag': $scope.tag.value,
					'time_start': $scope.dates.startDate,
					'time_end': $scope.dates.endDate
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

	//Set up default dates in dates object
	$scope.dates = {};

	//Default start set to yesterday
	$scope.dates.startDate = new Date();
	$scope.dates.startDate.setDate($scope.dates.startDate.getDate() - 1);

	//Default end set to now
	$scope.dates.endDate = new Date();

	//Date picker options
	$scope.dateOptions = {
		showWeeks: false,
		startingDay: 0
	};

	//Set disabled dates on the calendar
	$scope.setMaxDate = function() {
		//No restriction on how far back of a date you can pick
		$scope.dateOptions.minDate = null;

		//Set max date restriction to right now
		var maxDate = new Date();
		$scope.dateOptions.maxDate = maxDate;
	};
	$scope.setMaxDate();

	//Date picker options - no disabled days
	$scope.disabled = function(calendarDate, mode) {
		return;
	};

	//Date picker options - event bindings
	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dateOpened = true;
	};
	$scope.startOpened = false;
	$scope.endOpened = false;

	//Date picker options - misc (for more info: https://github.com/zhaber/angular-js-bootstrap-datetimepicker/)
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

/**
 * loader - directive provides a simple template for showing a loader across our views with the <loader/> tag
 */
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

/**
 * error - directive provides a simple template for showing an "error" message across our views with the <error/> tag
 */
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

/**
 * empty - directive provides a simple template for showing an "empty" message across our views with the <empty/> tag
 */
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

/**
 * backButton - directive provides a back button with the <back-button/> tag
 */
instagramApp.directive('backButton', function() {
	return {
		restrict: 'E', // <back-button/> to call the directive
		template: '<button onclick="history.back()" class="btn btn-lg btn-default text-right landing-button"><i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;Back</button>',
		link: function($scope, elem, attr) {}
	};
});
