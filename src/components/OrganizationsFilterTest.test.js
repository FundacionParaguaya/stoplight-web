import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import OrganizationsFilter from './OrganizationsFilter';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

const organizations = [
  { value: 'ALL', label: 'All Organizations' },
  { value: 84, label: 'Broadacres-Hambleton Supported accommodation' },
  { value: 64, label: 'Comunidad' },
  { value: 92, label: 'Probar suborg' },
  { value: 67, label: 'Roots of Renewal' }
];

jest.mock('../api', () => ({
  getOrganizationsByHub: jest
    .fn()
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
    .mockImplementation(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: {
                organizations: [
                  { id: 'ALL', name: 'All Organizations' },
                  {
                    id: 84,
                    name: 'Broadacres-Hambleton Supported accommodation'
                  },
                  { id: 64, name: 'Comunidad' },
                  { id: 92, name: 'Probar suborg' },
                  { id: 67, name: 'Roots of Renewal' }
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
}));

test('Organization filter empty', async () => {
  let selectedOrganization = [];

  const hub = { value: 1 };

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <OrganizationsFilter
        user={user}
        data={selectedOrganization}
        hub={hub}
        onChange={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(
    await getByText(/views.organizationsFilter.noOption/i)
  ).toBeInTheDocument();

  expect(onChange).not.toHaveBeenCalled();
});

test('Select an organization', async () => {
  let expectedOrgs = organizations;

  let selectedOrganization = [];

  const hub = { value: 1 };

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <OrganizationsFilter
        user={user}
        data={selectedOrganization}
        hub={hub}
        onChange={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('Roots of Renewal'));

  expect(onChange).toHaveBeenCalledWith(
    [{ value: 67, label: 'Roots of Renewal' }],
    expectedOrgs
  );
});

test('Select all organizations', async () => {
  let selectedOrganization = [{ value: 'ALL', label: 'All Organizations' }];

  const hub = { value: 1 };

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <OrganizationsFilter
        user={user}
        data={selectedOrganization}
        hub={hub}
        onChange={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  expect(
    await getByText(/views.organizationsFilter.noOption/i)
  ).toBeInTheDocument();
});
