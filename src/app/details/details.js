(function (app) {

  app.filter('catSum', function ($filter) {
    return function (input, id) {
      var out = [];

      angular.forEach(input, function(transaction) {

        if (transaction.category === parseInt(id.category)) {
          out.push(transaction);
        }

      });

      return out;
    };
  });
  app.controller('DetailsController', function ($scope, firebase, $firebaseArray, $stateParams, $rootScope, $state, currentDate, $filter,editSrv) {
    var model = this;
    model.transactions = null;
    model.getTableSum = getTableSum;
    model.filterByCat = $stateParams.cat;
    model.filteredModel = filter;
    model.edit = edit;


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
      return $filter('catSum')(model.transactions,{ category: model.filterByCat });
    }

    function edit(item){
      var index = model.transactions.$indexFor(item.$id);
      editSrv.open(model.transactions[index]).then(function(res){
        $rootScope.showLoader = true;
        if(res.save){
          model.transactions[index]=res.item;
          model.transactions.$save(index).then(function() {
            $rootScope.showLoader = false;
            $state.go('app.details',{cat:res.item.category});
          });
        }else{
          model.transactions.$remove(model.transactions[index]).then(function() {
            $rootScope.showLoader = false;
            $state.go('app.details',{cat:res.item.category});
          });
        }

      });

    }


  });

}(angular.module("budgetApp.details")));
