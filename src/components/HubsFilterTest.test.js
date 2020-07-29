import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import HubsFilter from './HubsFilter';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

jest.mock('../api', () => ({
  getHubs: jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: {
                hubsByUser: [
                  {
                    id: 48,
                    name: 'THUB',
                    description: 'wewewejiji',
                    logoUrl:
                      'https://s3.eu-west-2.amazonaws.com/py.org.fundacionparaguaya.psp.images/hubs/2020-05-08T12:41:13.192.jpeg'
                  },
                  {
                    id: 1,
                    name: 'hub',
                    description: 'This is a Hub',
                    logoUrl: null
                  },
                  {
                    id: 44,
                    name: 'Fundacion Paraguaya',
                    description: 'Fundacion Paraguaya',
                    logoUrl: null
                  }
                ]
              },
              errors: [],
              dataPresent: true,
              extensions: null
            }
          };
          resolve(response);
        })
    )
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: { hubsByUser: [] },
              errors: [],
              dataPresent: true,
              extensions: null
            }
          };
          resolve(response);
        })
    )
}));

test('Select an option', async () => {
  let selectedHub = {};

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <HubsFilter user={user} data={selectedHub} onChange={onChange} />
    </Provider>
  );

  const input = await waitForElement(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(input).toBeInTheDocument();

  fireEvent.click(getByText('THUB'));

  expect(onChange).toHaveBeenCalledWith({ value: 48, label: 'THUB' });
});

test('Hub filter empty', async () => {
  let selectedHub = {};

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <HubsFilter user={user} data={selectedHub} onChange={onChange} />
    </Provider>
  );

  const input = await waitForElement(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(await getByText(/views.hubsFilter.noOption/i)).toBeInTheDocument();

  expect(onChange).not.toHaveBeenCalled();
});
