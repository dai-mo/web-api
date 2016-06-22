/**
 * Created by cmathew on 31/12/15.
 */
//'use strict';
define(['angular', 'bootstrap', 'visjs'], function(angular, bootstrap, visjs) {
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

  app.directive('containerResize', function(){
    // Runs during compile
    return {
      scope: {
        crType: '@'
      },
      restrict: 'AE',
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

  app.directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: [ "$scope", function($scope) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };

        this.addPane = function(pane) {
          if (panes.length === 0) $scope.select(pane);
          panes.push(pane);
        };
      }],
      template:
        '<div class="tabbable">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  });

  app.directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
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

  app.directive('flowVis', [function() {
      return {
          restrict: 'AE',
          scope: {
              data: '=data',
              options: '=options'
          },
          link: function(scope, element, attrs) {
              // create an array with nodes
              var nodes = new visjs.DataSet([
                {id: 1, label: 'Node 1'},
                {id: 2, label: 'Node 2'},
                {id: 3, label: 'Node 3'},
                {id: 4, label: 'Node 4'},
                {id: 5, label: 'Node 5'}
              ]);

              // create an array with edges
              var edges = new visjs.DataSet([
                {from: 1, to: 3},
                {from: 1, to: 2},
                {from: 2, to: 4},
                {from: 2, to: 5}
              ]);

              var data = {
                nodes: nodes,
                edges: edges
              };
              var options = {};
              var network = new visjs.Network(element[0], data, options);
          }
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