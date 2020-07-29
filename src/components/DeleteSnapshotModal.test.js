import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DeleteSnapshotModal } from './DeleteSnapshotModal';

let openDeleteModal = true;
const snapshot = {
  snapshotId: 1
};
const toggleDeleteModal = () => {
  openDeleteModal = false;
};

test('delete snapshot modal open and close', async () => {
  const { findByText, rerender, queryByText } = render(
    <DeleteSnapshotModal
      open={openDeleteModal}
      onClose={toggleDeleteModal}
      snapshot={snapshot && snapshot.snapshotId}
      afterSubmit={() => {}}
      classes={{}}
    />
  );

  expect(await findByText(/general.yes/i)).toBeInTheDocument();

  fireEvent.click(await findByText(/general.no/i));

  rerender(
    <DeleteSnapshotModal
      open={openDeleteModal}
      onClose={toggleDeleteModal}
      snapshot={snapshot && snapshot.snapshotId}
      afterSubmit={() => {}}
      classes={{}}
    />
  );

  expect(await queryByText(/general.yes/i)).not.toBeInTheDocument();
});
