import React from 'react'
import ReactDOM from 'react-dom'
import Login from './Login'

it('renders without crashing', () => {
    expect(JSON.stringify(Login)).toMatchSnapshot();
})
