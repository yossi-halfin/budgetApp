(function (module) {

  module.config(function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginController as model',
      templateUrl: 'login/login.tpl.html',
      data: {pageTitle: 'Login'}
    })
      .state('register', {
      url: '/register',
      controller: 'RegisterController as model',
      templateUrl: 'login/register.tpl.html',
      data: {pageTitle: 'Register'}
    });
  });

}(angular.module("budgetApp.login", [
  'ui.router'
])));
