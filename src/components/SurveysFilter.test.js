import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  queryByText
} from '@testing-library/react';
import SurveysFilter from './SurveysFilter';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

const hubData = null;

const organizationsData = [];

let surveyData = [];

jest.mock('../api', () => ({
  getSurveysByUser: jest.fn().mockImplementation(
    () =>
      new Promise(resolve => {
        const response = {
          data: {
            data: {
              surveysInfoWithOrgs: [
                {
                  applications: [{ id: 44 }, { id: 63 }, { id: 1 }],
                  organizations: [],
                  id: 36,
                  title: 'Armenia - WPI'
                },
                {
                  applications: [],
                  organizations: [],
                  id: 7,
                  title: 'California, USA - UCI & Salvation Army'
                },
                {
                  applications: [],
                  organizations: [],
                  id: 11,
                  title: 'Cardamomo HON - Nelixia'
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

test('should not repeat selected survey in the list of selectable surveys', async () => {
  const onChangeSurvey = jest.fn();
  const { container, getByText, queryAllByText, rerender } = render(
    <Provider store={store}>
      <SurveysFilter
        data={surveyData}
        onChange={onChangeSurvey}
        hub={hubData}
        organizations={organizationsData}
      />
    </Provider>
  );
  let input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('Armenia - WPI'));

  surveyData = [
    {
      applications: [{ id: 44 }, { id: 63 }, { id: 1 }],
      organizations: [],
      id: 36,
      title: 'Armenia - WPI'
    }
  ];

  rerender(
    <Provider store={store}>
      <SurveysFilter
        data={surveyData}
        onChange={onChangeSurvey}
        hub={hubData}
        organizations={organizationsData}
      />
    </Provider>
  );

  input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(queryAllByText('Armenia - WPI')).toHaveLength(1);
});

test('should render unselected survey in the list', async () => {
  const onChangeSurvey = jest.fn();
  surveyData = [
    {
      applications: [{ id: 44 }, { id: 63 }, { id: 1 }],
      organizations: [],
      id: 36,
      title: 'Armenia - WPI'
    }
  ];
  const { container, getByText, queryAllByText, rerender } = render(
    <Provider store={store}>
      <SurveysFilter
        data={surveyData}
        onChange={onChangeSurvey}
        hub={hubData}
        organizations={organizationsData}
      />
    </Provider>
  );

  let input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  expect(queryAllByText('Armenia - WPI')).toHaveLength(1);

  fireEvent.click(getByText('Armenia - WPI'));

  expect(queryAllByText('Armenia - WPI')).toHaveLength(0);

  surveyData = [];

  rerender(
    <Provider store={store}>
      <SurveysFilter
        data={surveyData}
        onChange={onChangeSurvey}
        hub={hubData}
        organizations={organizationsData}
      />
    </Provider>
  );

  input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(queryAllByText('Armenia - WPI')).toHaveLength(1);
});
