angular.module('users').factory('AllUsers', ['$resource', 
function($resource) {
	return $resource('/users', { }, { 
		list: {
			method: 'GET'
		}
	});
}]);