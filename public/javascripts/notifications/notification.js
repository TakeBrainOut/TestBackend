/**
 * Created by kirill on 30.06.16.
 */

angular.module('myApp.notification', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/notification', {
                templateUrl: 'partials/notification',
                controller: 'NotificationCtrl',
                activetab: 'notification'
            })
    }])
    .controller('NotificationCtrl', function ($scope, $http) {
        $scope.notification = {title: "", text: ""};
        $scope.notification_answer = "";
        $scope.sendNotification = function () {
            // NotificationService.save($scope.notification, function (data) {
            //     alert(data);
            // }, function (error) {
            //     alert(error);
            // // })
            // $http.post('v', $scope.notification, config).then(function (data) {
            //     alert(data);
            // }, function(error){
            //     alert(error);
            // });
            $http({
                method: 'POST',
                url: '/api/notification',
                data: $scope.notification
            }).then(function successCallback(response) {
                $scope.notification_answer = JSON.stringify(response, undefined, 4);
                alert("все ок");
            }, function errorCallback(response) {
                alert("не ок");
            });

        };
    });

