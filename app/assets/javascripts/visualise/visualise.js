/**
* Created by cmathew on 04/01/16.
*/

dcs.directive('mobiliseView', function(){
  return {
    restrict : 'A',
    templateUrl: function(elem, attr) {
      return 'mobilise/' + attr.type + '-view.htm';
    }
  };
});
