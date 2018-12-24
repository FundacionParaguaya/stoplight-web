import { expect } from 'chai'
import * as actions from './../actions'

describe('actions', () => {
  it('should create an action to login', () => {
    const username = 'mentor'
    const token = '0000'
    const env = 'dev'
    const expectedAction = {
      type: 'LOGIN',
      username,
      token,
      env
    }
    expect(actions.login(username, token, env)).to.deep.equal(expectedAction)
  })
})
