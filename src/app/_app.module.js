(function (app) {

  app.config(function ($stateProvider, $urlRouterProvider, snapRemoteProvider, localStorageServiceProvider) {
    snapRemoteProvider.globalOptions.disable = 'left';
    localStorageServiceProvider.setPrefix('budgetApp');

    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'main/tpl/main.tpl.html',
      resolve: {
        firebase: function (localStorageService, $rootScope, $state) {
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

          }, function (error) {
            $rootScope.showLoader = false;
            $state.go('login');
          });
          return ref;
        }
      },
      controller: 'AppController as model',
      data: {pageTitle: ''}
    });


  });

  app.run(function ($rootScope, httpRequestTracker, $state,localStorageService) {
    $rootScope.$state = $state;
    $rootScope.localStorageService = localStorageService;
    $rootScope.hasPendingRequests = function () {
      return httpRequestTracker.hasPendingRequests() || $rootScope.showLoader;
    };
  });

  app.controller('AppController', function ($scope, $state, $rootScope, modalSrv, $window, localStorageService,$filter) {
    var model = this;
    var firebase = new Firebase("https://budgethalfinapp.firebaseio.com");
    model.logout = logout;
    model.back = back;
    model.lastItems = [];
    model.count = 0;
    model.removeNotifications = removeNotifications;
    model.notificationsFilter = notificationsFilter;


    $scope.$on('newItems',function(events,data){
      model.lastItems = data;
      model.count = 0;
      for(var i = 0; i < model.lastItems.length; i++){
        if(model.lastItems[i].date>=localStorageService.get('notif')){
          model.count++;
        }
      }
    });



    function back() {
      $window.history.back();
    }

    function removeNotifications() {
      localStorageService.set('notif', (new Date()).getTime());
      model.count=0;
    }

    function notificationsFilter(item) {
      return item.date >= localStorageService.get('notif') | 0;
    }


    function logout() {
      modalSrv.open('האם את/ה בטוח שברצונך להתנתק?').then(function (res) {
        if (res) {
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
