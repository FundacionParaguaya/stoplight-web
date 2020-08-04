import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DimensionSelector from './DimensionSelector';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

const user = { username: 'test', name: 'Test' };

jest.mock('../../api', () => ({
  getDimensionsByUser: jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          const response = {
            data: {
              data: { getDimensions: [] },
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
                getDimensions: [
                  {
                    name: 'Organización y Participación',
                    surveyDimensionId: 5
                  },
                  {
                    name: 'Condiciones para el Aprendizaje',
                    surveyDimensionId: 7
                  },
                  { name: 'Autoestima e Motivação', surveyDimensionId: 6 },
                  { name: 'Vivienda e Infraestructura', surveyDimensionId: 3 }
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

test('Dimensions filter empty', async () => {
  let selectedDimension = [];

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <DimensionSelector
        user={user}
        dimensionData={selectedDimension}
        onChangeDimension={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);

  await fireEvent.keyDown(input, { key: 'Down', code: 40 });

  expect(
    await getByText(/views.dimensionFilter.noOption/i)
  ).toBeInTheDocument();

  expect(onChange).not.toHaveBeenCalled();
});

test('Select a dimension', async () => {
  let selectedDimension = [];

  const onChange = jest.fn();

  const { container, getByText } = render(
    <Provider store={store}>
      <DimensionSelector
        user={user}
        dimensionData={selectedDimension}
        onChangeDimension={onChange}
      />
    </Provider>
  );

  const input = await waitFor(() => container.querySelector('input'));

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Down', code: 40 });

  await expect(input).toBeInTheDocument();

  fireEvent.click(getByText('Condiciones para el Aprendizaje'));

  expect(onChange).toHaveBeenCalledWith({
    label: 'Condiciones para el Aprendizaje',
    value: 7
  });
});
