(function(module) {

  module.filter('category', function ($filter, CATEGORIES) {
    return function (catId) {
      return $filter('filter')(CATEGORIES, {ID: catId})[0].label;
    };
  });

  module.filter('limitTo', function () {
    return function (arr, start, end) {
      return (arr || []).slice(start, end);
    };
  });



}(angular.module("common")));

