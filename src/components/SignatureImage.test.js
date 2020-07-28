import React from 'react';
import { render } from '@testing-library/react';
import SignatureImage from './SignatureImage';

let image;

beforeEach(() => {
  image =
    'https://s3.us-east-2.amazonaws.com/fp-psp-lifemaps/PY.df.20200727-1595879937930-sign.png';
});

test('should render one signature img', () => {
  const { queryAllByTestId } = render(<SignatureImage image={image} />);

  expect(queryAllByTestId('signature-image')).toHaveLength(1);
});

test('should not render signature image', () => {
  image = '';
  const { queryAllByTestId } = render(<SignatureImage image={image} />);

  expect(queryAllByTestId('signature-image')).toHaveLength(0);
});
