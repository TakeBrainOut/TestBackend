/**
 * Created by kirill on 17.2.16.
 */

angular.module('myApp.add', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/add/:id', {
                templateUrl: 'partials/add',
                controller: 'AddCtrl',
                activetab: 'add'
            })
    }])
    .controller('AddCtrl', function ($scope, $routeParams, TestsService) {
        $scope.test = [];
        $scope.answ_add = "";
        $scope.cur_index = 0;
        $scope.cor_answ = "";
        $scope.cor_answ_array = [];

        $scope.subjects = ["Русский язык", "Английский язык", "Математика", "Физика"];
        $scope.testData = {
            info: {subject: '', var: '', year: ''},
            updated_at: '',
            questions: [{number: "", text: "", answ: []}]
        };
        if ($routeParams.id != 'new'){
            TestsService.get({id: $routeParams.id}, function(data){
                $scope.testData = data;
            });
        };
        $scope.testData.info.subject = $scope.subjects[0].id;
        $scope.onAddQuest = function () {
            var emptyQuest = {number: "", text:"", answ:[]};
            if ($scope.testData.questions.indexOf(emptyQuest) == -1) {
                $scope.testData.questions.push(emptyQuest);
                $scope.cur_index = $scope.testData.questions.length - 1;
            }
        };

        $scope.onDeleteQuest = function () {
            if ($scope.testData.questions.length != 1) {
                $scope.testData.questions.splice($scope.cur_index, 1);
                if ($scope.cur_index > 0) {
                    $scope.cur_index = $scope.cur_index - 1;
                }
            }
        };

        $scope.onAnswAdd = function (ans) {
            console.log($scope.testData.questions[$scope.cur_index].answ);
            var isContains = function(str, array){
                if (array === undefined)
                return false;

                for (var i = 0; i < array.length; i++){
                    if (str === array[i].text){
                        return true;
                    }
                }
                return false;
           };
            if (!isContains(ans, $scope.testData.questions[$scope.cur_index].answ)){
                $scope.testData.questions[$scope.cur_index].answ.push({text: ans, isCorrect: false});
            }
        };

        $scope.corAnswChange = function () {
            $scope.cor_answ_array = $scope.cor_answ.split(" ")
            for (var i = 0; i < $scope.testData.questions[$scope.cur_index].answ.length; i++){
                if ($scope.cor_answ_array.indexOf((i+1).toString()) > -1){
                    console.log("contains " + i)
                    $scope.testData.questions[$scope.cur_index].answ[i].isCorrect = true;
                }
                else {
                    $scope.testData.questions[$scope.cur_index].answ[i].isCorrect = false;

                }
            }
        }

        $scope.onClickCheckBox = function (number) {
            if ($scope.testData.questions[$scope.cur_index].answ[number].isCorrect){
                $scope.testData.questions[$scope.cur_index].answ[number].isCorrect = false;
            }
            else $scope.testData.questions[$scope.cur_index].answ[number].isCorrect = true;
            console.log($scope.testData.questions[$scope.cur_index].answ[number].isCorrect)
        };

        $scope.onAnswDelete = function () {

            for (var i = $scope.testData.questions[$scope.cur_index].answ.length - 1; i >= 0; i--) {
                var answ = $scope.testData.questions[$scope.cur_index].answ[i];
                if(answ.isCorrect){
                  $scope.testData.questions[$scope.cur_index].answ.splice(i, 1);
                }
            }
        };

        $scope.isChecked = function (ans) {
            if ($scope.testData.questions[$scope.cur_index].cor_answ.indexOf(ans) > -1) {
                return true;
            }
            return false;
        };

        $scope.onSendToServer = function () {
            if ($routeParams.id === 'new'){
                TestsService.save($scope.testData, function(data){
                    alert("Создание теста прошло успешно");
                }, function (error) {
                    alert("Ошибка при создании теста");
                });
            }
            else {
                TestsService.update({id: $scope.testData._id}, $scope.testData, function (data) {
                    alert("Обновление теста прошло успешно");
                }, function (err) {
                    alert("Ошибка при обновлении теста");
                });
            }
        };
    });
