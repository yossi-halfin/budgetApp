(function (app) {

  app.controller('SettingsController', function ($scope, firebase, $firebaseObject, $stateParams, $rootScope) {
    var model = this;
    var ref = null;
    model.settings=null;
    model.save = save;
    model.cancelChanges = cancelChanges;
    model.settingsCopy=null;
    init();

    function init() {
      ref = $firebaseObject(firebase.child('settings'));
      ref.$loaded(
        function(data) {
          model.settings = data;
        },
        function(error) {
          console.error("Error:", error);
        }
      );
    }

    function save(){
      $rootScope.showLoader = true;
      ref.$save().then(function(ref) {
        $rootScope.showLoader = false;
              }, function(error) {
        console.log("Error:", error);
        $rootScope.showLoader = false;
      });

    }

    function cancelChanges(){
      ref = $firebaseObject(firebase.child('settings'));
      ref.$loaded(
        function(data) {
          model.settings = data;
        },
        function(error) {
          console.error("Error:", error);
        }
      );
    }


  });

}(angular.module("budgetApp.settings")));
