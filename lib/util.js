'use strict';

var _require = require('simple-protocol-helpers'),
    success = _require.success,
    failure = _require.failure,
    isFailure = _require.isFailure,
    isProtocol = _require.isProtocol;

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

module.exports = {
  safep: safep,
  success: success,
  failure: failure,
  isFailure: isFailure,
  isProtocol: isProtocol
};