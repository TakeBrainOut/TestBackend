/**
 * Created by kirill on 24.3.16.
 */

angular.module('myApp.users', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/users', {
                templateUrl: 'partials/users',
                controller: 'UsersCtrl',
                activetab: 'users'
            })
    }])
    .controller('UsersCtrl', function($scope, UsersService, AuthService){
        $scope.usersArray = [];
        if (AuthService.isAuthenticated()){
            UsersService.query(function(data){
                $scope.usersArray = data;
                console.log(data);
            });
        };

        $scope.changeActivation = function(user){
            user.isConfirmed = !user.isConfirmed;
            UsersService.update({id : user._id}, user);
        };
    });
