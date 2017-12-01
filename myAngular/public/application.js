var mainApplicationModuleName = 'mean';

//var mainApplicationModule = angular.module(mainApplicationModuleName, []);
// add example module as dependency of main application module
var mainApplicationModule = angular.module(mainApplicationModuleName, 
	['ngRoute', 'users', 'example']);

mainApplicationModule.config(['$locationProvider',
     function($locationProvider) {
       $locationProvider.hashPrefix('!');
     }
]);

if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function() {
  // to initiate a new AngularJS application
  angular.bootstrap(document, [mainApplicationModuleName]);
});
