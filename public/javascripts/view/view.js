angular.module('myApp.view', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/view', {
                templateUrl: 'partials/view',
                controller: 'ViewCtrl',
                activetab: 'view'
            })
    }])
    //.factory("TestsService", function($resource){
    //    return $resource('/api/tests')
    //})
    .controller('ViewCtrl', function($scope, $location, TestsService, AuthService, $route){
        $scope.testsArray=[];
        $scope.subjects = [];

        //$route.reload();
        if (AuthService.isAuthenticated()){
            TestsService.query(function(data){
                $scope.testsArray = data;
                $scope.subjects = getSubjects();
            });
        };

        var getSubjects = function(){
            var array = $($scope.testsArray).map(function(){return this.info.subject}).toArray();
            return array.unique();
        };

        $scope.goToItem = function (id) {
            $location.path('/add/' + id);
        }
        $scope.deleteItem = function (test) {
            if (confirm("Удалить данный тест?")) {
                TestsService.del({id: test._id}, test, function (data) {
                    alert("Удаление теста прошло успешно");
                }, function (err) {
                    alert("Ошибка при удалении теста");
                });
            } else {
            }        }
    });

Array.prototype.contains = function(item){
    if(this.indexOf(item) > -1) return true;
    return false;
};

Array.prototype.unique = function(){
    var arr = [];
    for (var i=0; i < this.length; i++){
        if(!arr.contains(this[i])){
            arr.push(this[i]);
        }
    }
    return arr;
};