/**
 * Created by kirill on 12.3.16.
 */

angular.module('myApp.auth', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('inside', {
                views: {
                    'login': {
                        templateUrl: 'partials/inside'}
                },
            })
            .state('outside', {
            views: {
                'login': {
                    templateUrl: 'partials/outside'}
            }

        });

        //$urlRouterProvider.otherwise(function($injector, $location){
        //    var state = $injector.get('$state');
        //    state.go('outside');
        //    return $location.path();
        //});
    })
    .service('AuthService', function($q, $http) {
        var LOCAL_TOKEN_KEY = 'hopheyahahah';
        var isAuthenticated = false;
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            isAuthenticated = true;
            authToken = token;

            // Set the token as header for your requests!
            $http.defaults.headers.common.Authorization = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            isAuthenticated = false;
            $http.defaults.headers.common.Authorization = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var register = function(user) {
            return $q(function(resolve, reject) {
                $http.post('/signup', user).then(function(result) {
                    if (result.data.success) {
                        resolve(result.data.msg);
                    } else {
                        reject(result.data.msg);
                    }
                });
            });
        };

        var login = function(user) {
            return $q(function(resolve, reject) {
                $http.post('/auth', user).then(function(result) {
                    if (result.data.success) {
                        storeUserCredentials(result.data.token);
                        resolve(result.data.msg);
                    } else {
                        reject(result.data.msg);
                    }
                });
            });
        };

        var logout = function() {
            destroyUserCredentials();
        };

        loadUserCredentials();

        return {
            login: login,
            register: register,
            logout: logout,
            isAuthenticated: function() {return isAuthenticated;},
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })

    //.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    //    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    //        console.log('is_auth ' + AuthService.isAuthenticated());
    //        console.log('from_state ' + fromState.name + ' to_state ' + next.name);
    //        if (!AuthService.isAuthenticated()) {
    //            console.log(next.name);
    //            if(next.name !== 'outside')
    //                event.preventDefault();
    //                $state.go('inside');
    //        };
    //    });
    //})

    //.run( function($state, AuthService){
    //    if (AuthService.isAuthenticated()){
    //        $state.go('inside');
    //    }
    //    else {
    //        $state.go('outside')
    //    }
    //    console.log('is_auth ' + AuthService.isAuthenticated());
    //})

    .controller('AuthCtrl', function($scope, AuthService, $state, $location, $http){
        $scope.user = {
           name: '',
           password: ''
       };
        $scope.service = AuthService;
        $scope.getUserInfo = function () {
            $http.get('/api/userinfo').then(function(result) {
                $scope.user = result.data;
            });
        };


        $scope.onLogin = function () {
            AuthService.login($scope.user).then(function(msg) {
                alert("Вы успешно вошли");
            }, function(msg) {
                alert(msg);
            });
        };

        $scope.signup = function() {
            AuthService.register($scope.user).then(function(msg) {
                alert(msg);
            }, function(errMsg) {
                alert(errMsg);
            });
        };

        $scope.logout = function() {
            AuthService.logout();
            $scope.user = { name: '',
                password: ''};
            $state.go('outside');
        };

        $scope.$watch('service.isAuthenticated()', function (newValue){
            if (newValue){
                $state.go('inside');
                $scope.getUserInfo();
                $location.path('/view')
            }
            else {
                $scope.logout();
            }

        });

    });