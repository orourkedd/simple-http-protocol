'use strict';

var _require = require('simple-protocol-helpers'),
    success = _require.success,
    failure = _require.failure,
    isFailure = _require.isFailure,
    isProtocol = _require.isProtocol;

var assign = require('lodash/assign');
var keys = require('lodash/keys');
var curry = require('lodash/curry');

function safep(p, ctx) {
  return function () {
    return p.apply(ctx, arguments).then(function (payload) {
      return {
        success: true,
        payload: payload
      };
    }).catch(function (error) {
      return {
        success: false,
        error: error
      };
    });
  };
}

function merge(a, b) {
  return assign({}, a || {}, b || {});
}

module.exports = {
  safep: safep,
  success: success,
  failure: failure,
  isFailure: isFailure,
  isProtocol: isProtocol,
  merge: merge,
  keys: keys,
  curry: curry
};