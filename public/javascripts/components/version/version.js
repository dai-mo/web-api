'use strict';

angular.module('dcs.version', [
  'dcs.version.interpolate-filter',
  'dcs.version.version-directive'
])

.value('version', '0.1');
