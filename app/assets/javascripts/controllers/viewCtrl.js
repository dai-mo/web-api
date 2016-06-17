

define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('WsViewController', ['$scope', '$location', function($scope, $location){

      $scope.nifiUrl = $location.protocol() +
        '://' +
        $location.host() +
        ':' +
        getPort($location) +
        '/nifi';

      $scope.getTemplateUrl = function() {
        return 'assets/html/' + $scope.viewName + '/' + $scope.viewType + '-view.htm';
      };
    }]);
  });