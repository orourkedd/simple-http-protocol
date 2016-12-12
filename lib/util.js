'use strict';

var _require = require('../vendor/ramda'),
    has = _require.has;

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

function isSimpleProtocol(p) {
  if (!p) {
    return false;
  }

  if (p.success === true && has('payload', p)) {
    return true;
  }

  if (p.success === false && has('error', p)) {
    return true;
  }

  return false;
}

module.exports = {
  safep: safep,
  isSimpleProtocol: isSimpleProtocol
};