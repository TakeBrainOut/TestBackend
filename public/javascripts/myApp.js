/**
 * Created by Кирилл on 06.02.2016.
 */

angular.module('myApp', ['ngRoute', 'ngResource', 'myApp.view', 'myApp.add', 'myApp.auth', 'myApp.users'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .otherwise({ redirectTo: '/view' });
    }])
    .factory("TestsService", function($resource){
        return $resource('/api/tests/:id', null,
            {
                'update' : {method: 'PUT'},
                'del' : {method: 'DELETE'}
            });
    })
    .factory("UsersService", function($resource){
        return $resource('/api/users/:id', null,
            {
                'update' : {method: 'PUT'}
            });
    })

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated'
    });

