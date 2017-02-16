const { success, failure, isFailure, isProtocol } = require('simple-protocol-helpers')
const assign = require('lodash/assign')
const keys = require('lodash/keys')
const curry = require('lodash/curry')

function safep (p, ctx) {
  return function () {
    return p
    .apply(ctx, arguments)
    .then((payload) => {
      return {
        success: true,
        payload
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
  }
}

function merge (a, b) {
  return assign({}, a || {}, b || {})
}

module.exports = {
  safep,
  success,
  failure,
  isFailure,
  isProtocol,
  merge,
  keys,
  curry
}
