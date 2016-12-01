"use strict";

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
  safep: safep
};