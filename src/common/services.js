(function(module) {

  module.factory('currentDate', currentDateFunc);

  module.service('modalSrv', modalConfig);
  module.controller('modalCtrl', modalCtrl);
  module.service('editSrv', editSrv);
  module.controller('modalEditCtrl', modalEditCtrl);


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


  function editSrv($modal) {
    this.open = function (transaction) {
      var instance = $modal.open({
        templateUrl: 'details/edit.tpl.html',
        controller: 'modalEditCtrl as model',
        resolve: {
          transaction: function () {
            return transaction;
          }
        }
      });
      return instance.result.then(function (callback) {
        return callback;
      });
    };
  }

  function modalEditCtrl($scope, $modalInstance,transaction,CATEGORIES) {
    var model = this;
    model.transaction = angular.copy(transaction);
    model.transaction.date = new Date(model.transaction.date);
    model.CATEGORIES = CATEGORIES;

    model.save = function () {
      var tempTransaction = angular.copy(model.transaction);
      tempTransaction.date = tempTransaction.date.getTime();
      $modalInstance.close({item:tempTransaction,save:true});
    };


    model.delete = function () {
      var tempTransaction = angular.copy(model.transaction);
      tempTransaction.date = tempTransaction.date.getTime();
      $modalInstance.close({item:tempTransaction,save:false});
    };

    model.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }


}(angular.module("common")));

