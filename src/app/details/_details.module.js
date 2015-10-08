(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('app.details', {
            url: '/details?cat',
            views: {
                "main": {
                    controller: 'DetailsController as model',
                    templateUrl: 'details/details.tpl.html'
                }
            },
            data:{
              pageTitle: 'Transactions',
              state:'פעולות'
            }
        });
    });

}(angular.module("budgetApp.details", [
    'ui.router'
])));
