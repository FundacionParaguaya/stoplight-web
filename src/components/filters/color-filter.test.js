import React from 'react';
import { render } from '@testing-library/react';
import ColorsFilter from './ColorsFilter';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key })
}));

test('renders a Color Filter', () => {
  let colors = {
    green: true,
    yellow: true,
    red: true
  };

  const { queryByTestId } = render(
    <ColorsFilter colorsData={colors} onChangeColors={() => {}} />
  );

  expect(queryByTestId('green-checkbox')).toBeInTheDocument();

  expect(queryByTestId('yellow-checkbox')).toBeInTheDocument();

  expect(queryByTestId('red-checkbox')).toBeInTheDocument();
});
