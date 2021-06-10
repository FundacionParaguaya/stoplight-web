import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { unifyFamilies } from '../../api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useTranslation } from 'react-i18next';

const MergeFamilyModal = ({
  open,
  toggleModal,
  user,
  selectedFamilies,
  afterSubmit
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onClose = submitted => {
    submitted && afterSubmit();
    toggleModal(selectedFamilies);
  };

  const handleMergeFamilies = () => {
    const families = selectedFamilies.map(family => {
      return family.familyId;
    });
    setLoading(true);
    console.log(families);
    unifyFamilies(families, language, user)
      .then(() => {
        enqueueSnackbar(t('views.familyList.mergeFamily.success'), {
          variant: 'success'
        });
        setLoading(false);
        onClose(true);
      })
      .catch(e => {
        setLoading(false);
        enqueueSnackbar(e.message, {
          variant: 'error'
        });
      });
  };

  const subtitle =
    Array.isArray(selectedFamilies) && selectedFamilies.length === 2
      ? `${t('views.familyList.mergeFamily.subtitle')} ${
          selectedFamilies[0].name
        }, ${selectedFamilies[1].name}`
      : '';

  return (
    <ConfirmationModal
      title={t('views.familyList.mergeFamily.confirm')}
      subtitle={subtitle}
      cancelButtonText={t('general.no')}
      continueButtonText={t('general.yes')}
      onClose={onClose}
      disabledFacilitator={loading}
      open={open}
      confirmAction={handleMergeFamilies}
    />
  );
};

export default MergeFamilyModal;
