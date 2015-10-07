(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('app.history', {
            url: '/history',
            views: {
                "main": {
                    controller: 'HistoryController as model',
                    templateUrl: 'history/history.tpl.html'
                }
            },
            data:{ pageTitle: 'History' }
        });
    });

}(angular.module("budgetApp.history", [
    'ui.router'
])));
