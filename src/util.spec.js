const { safep, isSimpleProtocol } = require('./util')
const deep = require('assert').deepEqual

describe('safe promise', () => {
  it('should convert a promise to a safe promise', () => {
    let p = () => {
      return Promise.resolve('a')
    }

    return safep(p)().then((result) => {
      deep(result.success, true)
      deep(result.payload, 'a')
    })
  })

  it('should return reject promise result', () => {
    let error = new Error('something bad!')
    let p = () => {
      return Promise.reject(error)
    }

    return safep(p)().then((result) => {
      deep(result.success, false)
      deep(result.error, error)
    })
  })
})

describe('isSimpleProtocol', () => {
  it('should recognize falsely payload', () => {
    const r1 = {
      success: true,
      payload: false
    }

    const actual = isSimpleProtocol(r1)
    const expected = true
    deep(actual, expected)
  })

  it('should recognize falsely error', () => {
    const r1 = {
      success: false,
      error: false
    }

    const actual = isSimpleProtocol(r1)
    const expected = true
    deep(actual, expected)
  })
})
