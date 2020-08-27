import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import IndicatorSelector from './IndicatorSelector';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

jest.mock('../../api', () => ({
  getIndicatorsByUser: jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: { getIndicators: [] },
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
                getIndicators: [
                  {
                    codeName: 'abilityToSolveProblemsAndConflicts',
                    name: 'Problemas y conflictos',
                    surveyIndicatorId: 42
                  },
                  {
                    codeName: 'academicIntegration',
                    name: 'Integración académica',
                    surveyIndicatorId: 268
                  },
                  {
                    codeName: 'accessInformation',
                    name: 'Información',
                    surveyIndicatorId: 51
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

test('Indicator selector empty', async () => {
  let selectedIndicators = [];

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <IndicatorSelector
        user={user}
        indicatorsData={selectedIndicators}
        onChangeIndicator={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(
    await getByText(/views.indicatorFilter.noOption/i)
  ).toBeInTheDocument();

  expect(onChange).not.toHaveBeenCalled();
});

test('Select an indicator', async () => {
  let selectedIndicators = [];

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <IndicatorSelector
        user={user}
        indicatorsData={selectedIndicators}
        onChangeIndicator={onChange}
        isMulti={true}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('Problemas y conflictos'));

  expect(onChange).toHaveBeenCalledWith([
    {
      codeName: 'abilityToSolveProblemsAndConflicts',
      label: 'Problemas y conflictos',
      value: 42
    }
  ]);
});
