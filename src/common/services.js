(function(module) {

  module.factory('currentDate', currentDateFunc);

  module.service('modalSrv', modalConfig);
  module.controller('modalCtrl', modalCtrl);



  function currentDateFunc(localStorageService, $firebaseObject) {
    function getDate() {
      var uid = localStorageService.get('budgetApp-uid');
      var ref = (new Firebase("https://budgethalfinapp.firebaseio.com/" + uid + '/settings'));
      var settingsDate = $firebaseObject(ref);
      return settingsDate.$loaded().then(function () {
        var year = (new Date()).getFullYear();
        var month = (new Date()).getMonth() + 1;
        var day = (new Date()).getDate();


        if (day > 1 && day < settingsDate.date) {
          if (month == 1) {
            month = 12;
          } else {
            --month;
          }

          if (month == 1) {
            --year;
          }
        }

        return {year: year, month: month};

      });
    }


    return {
      getRange: getDate
    };


  }
  function modalConfig($modal) {
    this.open = function (message) {
      var instance = $modal.open({
        templateUrl: 'main/tpl/modal.tpl.html',
        controller: 'modalCtrl',
        resolve: {
          message: function () {
            return message;
          }
        }
      });
      return instance.result.then(function (callback) {
        return callback;
      });
    };
  }

  function modalCtrl($scope, $modalInstance,message) {
    $scope.message=message;
    $scope.ok = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

}(angular.module("common")));

