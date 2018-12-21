import Login from './Login'

it('renders without crashing', () => {
    expect(JSON.stringify(Login)).toMatchSnapshot();
})
