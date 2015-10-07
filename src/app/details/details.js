(function (app) {

  app.controller('DetailsController', function ($scope, firebase, $firebaseArray, $stateParams, $rootScope, $state, currentDate, $filter) {
    var model = this;
    model.transactions = null;
    model.getTableSum = getTableSum;
    model.filterByCat = $stateParams.cat;
    model.filteredModel = filter;


    init();

    function init() {
      $rootScope.showLoader = true;
      currentDate.getRange().then(function(res) {
        model.currentDate = res;
        model.transactions = $firebaseArray(firebase.child(model.currentDate.year + '/' + model.currentDate.month));
        model.transactions.$loaded().then(function () {
          $rootScope.showLoader = false;
        }, function (error) {
          $state.go('login');
          $rootScope.showLoader = false;
        });
      });


    }

    function getTableSum() {
      var sum = 0;
      angular.forEach(model.filteredModel(), function (value, key) {
        sum += value.sum;
      });
      return sum.toFixed(2);
    }

    function filter(){
      return $filter('filter')(model.transactions,{ category: model.filterByCat });
    }


  });

}(angular.module("budgetApp.details")));
