import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EmailConfirmationModal from './EmailConfirmationModal';

const email = 'email@test.com.py';
let open = true;

test('Confirmation Modal Life Cycle', async () => {
  const { queryByTestId, findByText, rerender } = render(
    <EmailConfirmationModal
      open={open}
      onLeave={() => {
        open = false;
      }}
      handleSendMail={email => {}}
      email={email}
      loading={false}
    />
  );

  expect(queryByTestId('email-input')).toBeInTheDocument();

  expect(await findByText(/views.final.email/i)).toBeInTheDocument();

  fireEvent.click(await findByText(/general.cancel/i));

  rerender(
    <EmailConfirmationModal
      open={open}
      onLeave={() => {
        open = false;
      }}
      handleSendMail={email => {}}
      email={email}
      loading={false}
    />
  );

  expect(queryByTestId('email-input')).not.toBeInTheDocument();
});
