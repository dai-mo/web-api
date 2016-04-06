'use strict';

describe('dcs.version module', function() {
  beforeEach(module('dcs.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
