import Spinner from './../Spinner'
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

describe('Spinner Component', () => {
  it('Spinner renders without crashing', () => {
    shallow(<Spinner />)
  })

  it('Spinner has a Loader COMPONENT', () => {
    expect(shallow(<Spinner />).find('Loader')).to.have.lengthOf(1)
  })
})
