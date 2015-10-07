(function (app) {

  app.controller('LoginController', function ($scope, $firebaseArray, $stateParams, $rootScope, $state, localStorageService) {
    var model = this;
    var ref = new Firebase("https://budgethalfinapp.firebaseio.com");
    model.user = {
      email: null,
      password: null
    };
    model.login = login;
    model.err = null;

    function login() {
      $rootScope.showLoader = true;

      ref.authWithPassword({
        email: model.user.email,
        password: model.user.password
      }, function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          model.err = error;
          $rootScope.showLoader = false;
          $scope.$apply();
        } else {
          console.log("Authenticated successfully with payload:", authData);
          localStorageService.set('budgetApp-uid', authData.uid);
          $state.go('app.home');
        }
      });

    }

    init();

    function init() {
      var authData = ref.getAuth();
      if (authData) {
        $state.go('app.home');
      }
    }


  });


  app.controller('RegisterController', function ($scope, $firebaseArray, $stateParams, $rootScope, $state) {
    var model = this;
    var ref = new Firebase("https://budgethalfinapp.firebaseio.com");
    model.newuser = {
      email: null,
      password: null
    };
    model.register = register;
    model.err = null;

    function register() {
      $rootScope.showLoader = true;
      ref.createUser(model.newuser, function (error, userData) {
        if (error) {
          switch (error.code) {
            case "EMAIL_TAKEN":
              model.err = "The new user account cannot be created because the email is already in use.";
              break;
            case "INVALID_EMAIL":
              model.err = "The specified email is not a valid email.";
              break;
            default:
              model.err = "Error creating user:" + error;
          }
        } else {
          $state.go('login');
        }
        $rootScope.showLoader = false;
        $scope.$apply();
      });

    }


    init();

    function init() {

    }


  });

}(angular.module("budgetApp.login")));
