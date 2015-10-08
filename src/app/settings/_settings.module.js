(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('app.settings', {
            url: '/settings',
            views: {
                "main": {
                    controller: 'SettingsController as model',
                    templateUrl: 'settings/settings.tpl.html'
                }
            },
            data:{
              pageTitle: 'Settings',
              state:'הגדרות'
            }
        });
    });

}(angular.module("budgetApp.settings", [
    'ui.router'
])));
