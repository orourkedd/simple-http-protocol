const { has } = require('../vendor/ramda')

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

function isSimpleProtocol (p) {
  if (!p) {
    return false
  }

  if (p.success === true && has('payload', p)) {
    return true
  }

  if (p.success === false && has('error', p)) {
    return true
  }

  return false
}

module.exports = {
  safep,
  isSimpleProtocol
}
