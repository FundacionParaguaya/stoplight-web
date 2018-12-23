import React from 'react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import { shallow, render } from 'enzyme'
import { expect } from 'chai'
import Login from './../Login'

const mockStore = configureMockStore()
const store = mockStore({})

it('renders without crashing', () => {
  shallow(<Login />)
})

describe('Login Component', () => {
  let wrapper
  // our mock login function to replace the one provided by mapDispatchToProps
  const mockLoginfn = jest.fn()

  beforeEach(() => {
    // pass the mock function as the login prop
    wrapper = render(
      <Provider store={store}>
        <Login setLogin={mockLoginfn} />
      </Provider>
    )
  })

  it('should have a username field', () => {
    expect(wrapper.find('#username')).to.have.lengthOf(1)
  })
  it('should have a password field', () => {
    expect(wrapper.find('#inputPassword')).to.have.lengthOf(1)
  })
})
