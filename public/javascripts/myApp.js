/**
 * Created by Кирилл on 06.02.2016.
 */

angular.module('myApp', ['ngRoute', 'ngResource', 'myApp.view', 'myApp.add', 'myApp.auth', 'myApp.users', 'myApp.notification', 'textAngular'])

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
    .factory('NotificationService', function ($resource) {
        return $resource('/api/notification', null, {});
    })
    

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated'
    });

