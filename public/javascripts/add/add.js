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

        $scope.fullCorrectAnswers = "";

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
            for (var i = 0; i < $scope.testData.questions[$scope.cur_index].answ.length; i++) {
                if ($scope.cor_answ_array.indexOf((i + 1).toString()) > -1) {
                    console.log("contains " + i)
                    $scope.testData.questions[$scope.cur_index].answ[i].isCorrect = true;
                }
                else {
                    $scope.testData.questions[$scope.cur_index].answ[i].isCorrect = false;

                }
            }
        }

        $scope.testAction = function () {

            // make all answers false

            $scope.testData.questions.forEach(function (item, i, arr){
                if (item.answ != undefined) {
                    if (item.number.indexOf("A") > -1){
                        item.answ.forEach(function (answ_item, j, item_arr) {
                            $scope.testData.questions[i].answ[j].isCorrect = false;
                        });
                        if (item.number.indexOf("B") > -1){
                            $scope.testData.questions[i].answ= [];
                        }
                    }

                };
            });
            var corAnsw = [];
            if ($scope.fullCorrectAnswers != undefined){
                corAnsw = $scope.fullCorrectAnswers.split("\n");
            }
            else return;
            if (corAnsw.length == $scope.testData.questions.length){
                corAnsw.forEach(function (item, i, arr) {
                        if ($scope.testData.questions[i].number.indexOf("A") > -1){
                            var resultByQuest = item.split(" ");
                            if ($scope.testData.questions[i].answ == undefined || $scope.testData.questions[i].answ.length == 0){
                                for (var k = 0; k < 5; k++){
                                    $scope.testData.questions[i].answ.push({text: k + 1, isCorrect: false})
                                }
                            }
                                for (var j = 0; j < resultByQuest.length; j++){
                                    $scope.testData.questions[i].answ[resultByQuest[j] - 1].isCorrect = true;
                                }

                        }
                        else if ($scope.testData.questions[i].number.indexOf("B")  > -1){
                            if ($scope.testData.questions[i].answ == undefined || $scope.testData.questions[i].answ.length == 0){
                                $scope.testData.questions[i].answ = [];
                                $scope.testData.questions[i].answ.push({text: item, isCorrect: true});
                            }
                            else {
                                $scope.testData.questions[i].answ[0] = {text: item, isCorrect: true};
                            }
                        }
                });
            }
            else {
                alert("Test length != cor answ length");
            }

        }


        // $scope.addCorrectAnsw = function () {
        //     if ($scope.testData.questions[$scope.cur_index].answ == undefined || $scope.testData.questions[$scope.cur_index].answ.length == 0){
        //         if ($scope.testData.questions[$scope.cur_index].number.indexOf("A")){
        //             for (var i = 0; i < 5; i++){
        //                 $scope.testData.questions[$scope.cur_index].answ.push({text: i + 1, isCorrect: false})
        //             }
        //         }
        //     }
        // }
        $scope.handleKey = function($event){
            $scope.cur_index = parseInt($scope.cur_index);

            if ($event.keyCode == 39){
               if ($scope.cur_index == $scope.testData.questions.length - 1){
                   $scope.cur_index = 0;
               }
               else {
                   $scope.cur_index ++;
               }
           }
            else if ($event.keyCode == 37){
               if ($scope.cur_index == 0){
                   $scope.cur_index = $scope.testData.questions.length - 1;
               }
               else{
                   $scope.cur_index --;
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
