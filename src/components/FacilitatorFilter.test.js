import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import FacilitatorFilter from './FacilitatorFilter';

const mockStore = configureMockStore();
const store = mockStore({});

let facilitatorData = [];
const organizationsData = [];

jest.mock('../api', () => ({
  getMentors: jest.fn().mockImplementation(
    () =>
      new Promise(resolve => {
        const response = {
          data: {
            data: {
              getMentorsByOrganizations: [
                {
                  email: 'person2@povertystoplight.org',
                  userId: 2,
                  username: 'person2'
                },
                {
                  email: 'person1@povertystoplight.org',
                  userId: 1,
                  username: 'person1'
                },
                {
                  email: 'person3@povertystoplight.org',
                  userId: 3,
                  username: 'person3'
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
}));

test('should not repeat selected facilitator in the list of selectable facilitators', async () => {
  const onChangeFacilitator = jest.fn();
  const { container, getByText, queryAllByText, rerender } = render(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={true}
      />
    </Provider>
  );
  let input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('person1'));

  expect(queryAllByText('person1')).toHaveLength(0);

  facilitatorData = [
    {
      label: 'person1',
      value: 1
    }
  ];

  rerender(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={true}
      />
    </Provider>
  );

  input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(queryAllByText('person1')).toHaveLength(1);
});

test('should render unselected facilitators in the list', async () => {
  const onChangeFacilitator = jest.fn();
  facilitatorData = [
    {
      label: 'person1',
      value: 1
    }
  ];
  const { container, getByText, queryAllByText, rerender } = render(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={true}
      />
    </Provider>
  );

  let input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  expect(queryAllByText('person1')).toHaveLength(1);

  fireEvent.click(getByText('person1'));

  facilitatorData = [];

  rerender(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={true}
      />
    </Provider>
  );

  input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(queryAllByText('person1')).toHaveLength(1);
});

test('should select no more than one facilitator in the list at the same time', async () => {
  const onChangeFacilitator = jest.fn();
  const { container, getByText, queryAllByText, rerender } = render(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={false}
      />
    </Provider>
  );

  let input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('person1'));

  facilitatorData = [
    {
      label: 'person1',
      value: 1
    }
  ];

  rerender(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={false}
      />
    </Provider>
  );

  input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('person2'));

  facilitatorData = [
    {
      label: 'person1',
      value: 1
    },
    {
      label: 'person2',
      value: 2
    }
  ];

  rerender(
    <Provider store={store}>
      <FacilitatorFilter
        data={facilitatorData}
        onChange={onChangeFacilitator}
        organizations={organizationsData}
        isMulti={false}
      />
    </Provider>
  );

  expect(queryAllByText('person1')).toHaveLength(1);
  expect(queryAllByText('person2')).toHaveLength(0);
});
