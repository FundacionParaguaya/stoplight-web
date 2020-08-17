import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import IndicatorsFilter from './IndicatorsFilter';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

const survey = { label: 'Test survey', value: 1 };

jest.mock('../../api', () => ({
  getIndicatorsBySurveyId: jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: {
                surveyById: {
                  surveyStoplightQuestions: []
                }
              },
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
                surveyById: {
                  surveyStoplightQuestions: [
                    {
                      id: 881,
                      codeName: 'familySavings',
                      shortName: 'Savings'
                    },
                    {
                      id: 882,
                      codeName: 'properKitchen',
                      shortName: 'Kitchen'
                    },
                    {
                      id: 883,
                      codeName: 'separateBedrooms',
                      shortName: 'Bedrooms'
                    }
                  ]
                }
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

test('Indicator filter empty', async () => {
  let selectedIndicators = [];

  const onChangeIndicator = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <IndicatorsFilter
        user={user}
        indicatorsData={selectedIndicators}
        survey={survey}
        indicator={selectedIndicators}
        onChangeIndicator={onChangeIndicator}
        isMulti={true}
        preSelect={false}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(
    await getByText(/views.indicatorFilter.noMatchFilters/i)
  ).toBeInTheDocument();

  expect(onChangeIndicator).not.toHaveBeenCalled();
});

test('Select an filter', async () => {
  let selectedIndicators = [];

  const onChangeIndicator = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <IndicatorsFilter
        user={user}
        indicatorsData={selectedIndicators}
        survey={survey}
        indicator={selectedIndicators}
        onChangeIndicator={onChangeIndicator}
        isMulti={true}
        preSelect={false}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('Savings'));

  expect(onChangeIndicator).toHaveBeenCalledWith([
    { value: 'familySavings', label: 'Savings' }
  ]);
});

test('Preslect an option', async () => {
  let selectedIndicators = [];

  const onChangeIndicator = jest.fn();

  const { container } = render(
    <Provider store={store}>
      <IndicatorsFilter
        user={user}
        indicatorsData={selectedIndicators}
        survey={survey}
        indicator={selectedIndicators}
        onChangeIndicator={onChangeIndicator}
        isMulti={false}
        preSelect={true}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  expect(onChangeIndicator).toHaveBeenCalledWith({
    value: 'familySavings',
    label: 'Savings'
  });
});
