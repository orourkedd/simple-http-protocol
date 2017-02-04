const { success, failure, isFailure, isProtocol } = require('simple-protocol-helpers')

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

module.exports = {
  safep,
  success,
  failure,
  isFailure,
  isProtocol
}
