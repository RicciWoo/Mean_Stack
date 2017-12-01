var mainApplicationModuleName = 'mean';

//var mainApplicationModule = angular.module(mainApplicationModuleName, []);
// add example module as dependency of main application module
var mainApplicationModule = angular.module(mainApplicationModuleName, 
	['ngResource', 'ngRoute', 'users', 'example', 'articles', 'chat']);

mainApplicationModule.config(['$locationProvider',
     function($locationProvider) {
       $locationProvider.hashPrefix('!');
     }
]);

// to solve Facebook's redirect bug that adds a hash part to
// the application's URL after the OAuth authentication round-trip
if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function() {
  // to initiate a new AngularJS application
  angular.bootstrap(document, [mainApplicationModuleName]);
});
