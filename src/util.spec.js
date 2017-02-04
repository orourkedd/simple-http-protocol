const { safep } = require('./util')
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
