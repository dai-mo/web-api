/**
 * Created by cmathew on 31/12/15.
 */
//'use strict';
define(['angular'], function(angular) {
  'use strict';

  function getPort($location) {
    var port = $location.port();
    if(port === '') {
      port = '80';
    }
    return port;
  }


  // Declare app level module which depends on views, and components
  var app = angular.module('app', []);



  // dcs.factory("config", function ($http, $location) {
  //
  //
  //
  //   return {
  //       get: function() {
  //         var nifiUrl = $location.protocol() +
  //         '://' +
  //         $location.host() +
  //         ':' +
  //         getPort() +
  //         '/nifi';
  //         return $http.get(baseUrl + '/dcs/api/v0/ui-config');
  //     }
  //   }
  // });


  app.directive('containerResize', function(){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: {
        crType: '@'
      },
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
      //template: 'Test'
      // templateUrl: '',
      //replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function(scope, iElm, iAttrs, controller) {

        var type = scope.crType;

        var start, minimum = 20;

        var prevElm,prevElmStyle,prevElmWidth,prevElmHeight;
        var prevElmPanelHeading,prevElmPanelBody, prevElmPanelHeadingHeight;
        var nextElm,nextElmStyle,nextElmWidth,nextElmHeight;
        var nextElmPanelHeading,nextElmPanelBody, nextElmPanelHeadingHeight;

        var prevElmStartFlexBasis,nextElmStartFlexBasis;


        var init = function() {
          var siblings = iElm.parent().children();
          if(siblings.length != 3) {
            alert('Flex container contains incorrect number of children');
            return;
          }
          prevElm = siblings[0];
          nextElm = siblings[2];
        };

        init();

        var initProperties = function() {

          prevElmStyle = window.getComputedStyle(prevElm, null);
          prevElmWidth = parseInt(prevElmStyle.getPropertyValue('width'));
          prevElmHeight = parseInt(prevElmStyle.getPropertyValue('height'));
          prevElmStartFlexBasis = parseInt(prevElmStyle.getPropertyValue('flexBasis'));

          nextElmStyle = window.getComputedStyle(nextElm, null);
          nextElmWidth = parseInt(nextElmStyle.getPropertyValue('width'));
          nextElmHeight = parseInt(nextElmStyle.getPropertyValue('height'));
          nextElmStartFlexBasis = parseInt(nextElmStyle.getPropertyValue('flexBasis'));
        };

        initProperties();

        var initPanelProperties = function() {

          var prevElemChildren = angular.element(prevElm).children();
          var nextElemChildren = angular.element(nextElm).children();

          if(type !== 'column') {
            // this will be true in the case of the row flex box
            return;
          }
          prevElmPanelHeading = prevElemChildren[0];
          var prevElmPanelHeadingStyle = window.getComputedStyle(prevElmPanelHeading, null);
          prevElmPanelHeadingHeight = parseInt(prevElmPanelHeadingStyle.getPropertyValue('height'));
          prevElmPanelBody = prevElemChildren[1];

          nextElmPanelHeading = nextElemChildren[0];
          var nextElmPanelHeadingStyle = window.getComputedStyle(nextElmPanelHeading, null);
          nextElmPanelHeadingHeight = parseInt(nextElmPanelHeadingStyle.getPropertyValue('height'));
          nextElmPanelBody = nextElemChildren[1];
        };


        var updatePanelProperties = function(prevHeight, nextHeight) {
          prevElmPanelBody.style.height = prevHeight + 'px';
          prevElmPanelBody.style['min-height'] = prevHeight + 'px';
          nextElmPanelBody.style.height = nextHeight + 'px';
          nextElmPanelBody.style['min-height'] = nextHeight + 'px';

        };

        var endDrag = function(event) {
          document.removeEventListener('mouseup', endDrag, false);
          document.removeEventListener('mousemove', drag, false);
        };

        var drag = function(event) {
          var offset = 0, prevFlexBasis = 1, nextFlexBasis = 1;
          switch (type) {
            case 'column':
              offset = start - event.clientY;
              prevFlexBasis = prevElmHeight - offset;
              nextFlexBasis = nextElmHeight + offset;
              break;
            case 'row':
              offset = start - event.clientX;
              prevFlexBasis = prevElmWidth - offset;
              nextFlexBasis = nextElmWidth + offset;
              break;

          }


          prevElm.style.flexBasis = prevFlexBasis + 'px';
          nextElm.style.flexBasis = nextFlexBasis + 'px';

          if (type === 'column' &&
            nextElmPanelHeadingHeight < nextFlexBasis &&
            prevElmPanelHeadingHeight < prevFlexBasis) {
            updatePanelProperties(prevFlexBasis - prevElmPanelHeadingHeight, nextFlexBasis - nextElmPanelHeadingHeight);
          }
        };

        var startDrag = function(event) {

          switch(type) {
            case 'column':
              start = event.clientY;
              break;
            case 'row':
              start = event.clientX;
              break;
            default:
              return;
          }

          initProperties();
          initPanelProperties();
          document.addEventListener('mouseup', endDrag, false);
          document.addEventListener('mousemove', drag, false);
        };


        iElm.on('mousedown', function(e) {
          if(e.which === 1) {
            startDrag(e);
          }
        });
      }
    };
  });

  app.directive('wsView', function(){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: {
        viewType: '@',
        viewName: '@'
      }, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      templateUrl: 'partials/ws-view.htm'
    };
  });

  app.directive('wsPanelBody',function() {
    // Runs during compile
    return {
      link: function(scope, iElm, iAttrs, controller) {

        var init = function () {
          var children = iElm.parent().children();
          if(children.length != 2) {
            alert('Workspace view is not a bootstrap panel with two children');
            return;
          }
          var parentStyle = window.getComputedStyle(iElm.parent()[0], null);
          var parentHeight = parseInt(parentStyle.getPropertyValue('height'));

          var panelHeading = children[0];
          var panelHeadingStyle = window.getComputedStyle(panelHeading, null);
          var panelHeadingHeight = parseInt(panelHeadingStyle.getPropertyValue('height'));

          var panelBody = iElm[0];

          panelBody.style.height = (parentHeight - panelHeadingHeight) + 'px';
          panelBody.style['min-height'] = (parentHeight - panelHeadingHeight) + 'px';

        };

        init();
      }
    };
  });



  app.controller('WsViewController', ['$scope', '$location', function($scope, $location){

    $scope.nifiUrl = $location.protocol() +
      '://' +
      $location.host() +
      ':' +
      getPort($location) +
      '/nifi';

    $scope.getTemplateUrl = function() {
      return 'partials/' + $scope.viewName + '/' + $scope.viewType + 'view.htm';
    };
  }]);


  function getUrlValue(varSearch){
    var searchString = window.location.search.substring(1);
    var variableArray = searchString.split('&');
    for(var i = 0; i < variableArray.length; i++){
      var keyValuePair = variableArray[i].split('=');
      if(keyValuePair[0] == varSearch){
        return keyValuePair;
      }
    }
  }

  return app;
});