(function (app) {

  app.config(function ($stateProvider, $urlRouterProvider, snapRemoteProvider, localStorageServiceProvider) {
    snapRemoteProvider.globalOptions.disable = 'left';
    localStorageServiceProvider.setPrefix('budgetApp');

    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'main/tpl/main.tpl.html',
      resolve: {
        firebase: function (localStorageService, $rootScope) {
          $rootScope.showLoader = true;
          var uid = localStorageService.get('budgetApp-uid');
          var ref = (new Firebase("https://budgethalfinapp.firebaseio.com/" + uid));

          ref.once("value", function (snapshot) {
            if (!snapshot.hasChild("settings")) {
              ref.child('settings').set({
                date: 10
              });
            }
            $rootScope.showLoader = false;

          });
          return ref;
        }
      },
      controller: 'AppController as model',
      data: {pageTitle: ''}
    });


  });

  app.run(function ($rootScope, httpRequestTracker, $state) {
    $rootScope.$state = $state;
    $rootScope.hasPendingRequests = function () {
      return httpRequestTracker.hasPendingRequests() || $rootScope.showLoader;
    };
  });

  app.controller('AppController', function ($scope, $state, $rootScope,modalSrv,$window) {
    var model = this;
    var firebase = new Firebase("https://budgethalfinapp.firebaseio.com");
    model.logout = logout;
    model.back = back;

    function back(){
      $window.history.back();
    }
    function logout() {
      modalSrv.open('האם את/ה בטוח שברצונך להתנתק?').then(function(res){
        if(res){
          $rootScope.showLoader = true;
          firebase.unauth();
          var authData = firebase.getAuth();
          if (!authData) {
            $rootScope.showLoader = false;
            $state.go('login');
          }
        }
      });

    }





  });

}(angular.module("budgetApp", [
  'common',
  'budgetApp.history',
  'budgetApp.details',
  'budgetApp.home',
  'budgetApp.settings',
  'budgetApp.login'
])));
