import React from 'react';
import { render } from '@testing-library/react';
import FamilyImages from './FamilyImages';

let images;

beforeEach(() => {
  images = [
    {
      category: 'picture',
      url:
        'https://s3.us-east-2.amazonaws.com/fp-psp-files/stoplight-file-1595879932243-picture.jpg'
    },
    {
      category: 'picture',
      url:
        'https://s3.us-east-2.amazonaws.com/fp-psp-files/stoplight-file-1595879932387-picture.jpg'
    }
  ];
});

test('should render two images', () => {
  const { queryAllByTestId } = render(<FamilyImages images={images} />);

  expect(queryAllByTestId('family-picture')).toHaveLength(2);
});
