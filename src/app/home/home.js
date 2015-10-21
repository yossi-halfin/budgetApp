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
    model.data = [];

    init();

    function init() {
      $rootScope.showLoader = true;


      currentDate.getRange().then(function (res) {
        model.currentDate = res;
        model.objRef = $firebaseArray(firebase.child(model.currentDate.year + '/' + model.currentDate.month));

        model.objRef.$loaded().then(function () {
          $scope.$emit('newItems',model.objRef);
          angular.forEach(model.objRef, function (value, key) {
            model.categories[value.category] += value.sum;
            model.categories[12] += value.sum;
          });

          angular.forEach(model.categories.slice(1, 12), function (value, key) {
            model.data.push(
              {
                value: value,
                color: COLORS[key],
                highlight: COLORS[key],
                label: CATEGORIES[key].label
              }
            );
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

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps: 50,

        //String - Animation easing effect
        animationEasing: 'easeOut',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend">' +
        '<% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

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
        //$state.go('app.home', {}, {reload: true});
        $state.go('app.details', {cat: tempTranaction.category}, {reload: true});

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
