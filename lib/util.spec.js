'use strict';

var _require = require('./util'),
    safep = _require.safep,
    isSimpleProtocol = _require.isSimpleProtocol;

var deep = require('assert').deepEqual;

describe('safe promise', function () {
  it('should convert a promise to a safe promise', function () {
    var p = function p() {
      return Promise.resolve('a');
    };

    return safep(p)().then(function (result) {
      deep(result.success, true);
      deep(result.payload, 'a');
    });
  });

  it('should return reject promise result', function () {
    var error = new Error('something bad!');
    var p = function p() {
      return Promise.reject(error);
    };

    return safep(p)().then(function (result) {
      deep(result.success, false);
      deep(result.error, error);
    });
  });
});

describe('isSimpleProtocol', function () {
  it('should recognize falsely payload', function () {
    var r1 = {
      success: true,
      payload: false
    };

    var actual = isSimpleProtocol(r1);
    var expected = true;
    deep(actual, expected);
  });

  it('should recognize falsely error', function () {
    var r1 = {
      success: false,
      error: false
    };

    var actual = isSimpleProtocol(r1);
    var expected = true;
    deep(actual, expected);
  });
});