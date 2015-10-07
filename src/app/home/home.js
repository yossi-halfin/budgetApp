/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * 'src/app/home', however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a 'note' section could have the submodules 'note.create',
 * 'note.delete', 'note.edit', etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 */
(function (module) {

  module.controller('HomeController', function ($firebaseArray, $log, firebase, $rootScope, $state, CATEGORIES, COLORS, currentDate, $scope) {
    var model = this;
    model.categories = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    model.categoriesValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    model.data = [];
    var categoriesLabels = [];

    init();

    function init() {
      $rootScope.showLoader = true;

      // Chart.js Data
      model.data = {
        labels: categoriesLabels,
        datasets: [
          {
            fillColor: 'rgba(49,101,120,0.6)',
            strokeColor: 'rgba(49,101,120,0.7)',
            highlightFill: 'rgba(49,101,120,0.78)',
            highlightStroke: 'rgba(49,101,120,1)',
            data: model.categoriesValues
          }
        ]
      };

      currentDate.getRange().then(function (res) {
        model.currentDate = res;
        model.objRef = $firebaseArray(firebase.child(model.currentDate.year + '/' + model.currentDate.month));

        model.objRef.$loaded().then(function () {
          angular.forEach(model.objRef, function (value) {
            model.categories[value.category] += value.sum;
            model.categoriesValues[value.category-1] += value.sum;
            model.categories[12] += value.sum;
          });

          angular.forEach(CATEGORIES, function (value, key) {
            categoriesLabels[key] = value.label;
          });
          $rootScope.showLoader = false;
        }, function (error) {
          $state.go('login');
          $rootScope.showLoader = false;
        });
      });


      // Chart.js Options
      model.options = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.02)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 0,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 1,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 15,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 150,
      };


    }


  });

  module.controller('NewController', function ($firebaseArray, $log, firebase, $scope, $state, CATEGORIES, $stateParams, currentDate, $rootScope) {
    var model = this;
    model.CATEGORIES = CATEGORIES;
    model.add = add;
    model.newTransaction = {
      category: $stateParams.cat * 1 || null,
      info: null,
      sum: null,
      date: new Date()
    };

    init();


    function add() {
      var tempTranaction = angular.copy(model.newTransaction);
      tempTranaction.date = tempTranaction.date.getTime();
      model.objRef.$add(tempTranaction).then(function (ref) {
        $state.go('app.home', {}, {reload: true});

      });
    }

    function init() {
      $rootScope.showLoader = true;
      currentDate.getRange().then(function (res) {
        $rootScope.showLoader = false;
        model.currentDate = res;
        model.objRef = $firebaseArray(firebase.child(model.currentDate.year + '/' + model.currentDate.month));
      });


    }


  });


}(angular.module("budgetApp.home")));
