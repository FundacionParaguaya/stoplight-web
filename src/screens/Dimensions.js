import { Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import Container from '../components/Container';
import DimensionForm from './dimensions/DimensionForm';
import SeachTextFilter from '../components/filters/SearchTextFilter';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  titleContainer: {
    display: 'flex',
    height: 175
  },
  viewTitle: {
    display: 'flex',
    flexDirection: 'column',
    height: 175,
    justifyContent: 'center'
  }
}));

const Dimensions = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  const [selectedDimension, setSelectedDimension] = useState({});
  const { t } = useTranslation();
  const classes = useStyles();

  const toggleFormModal = () => {
    setOpenFormModal(!openFormModal);
  };

  return (
    <Container variant="stretch">
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <DimensionForm
        open={openFormModal}
        toggleModal={toggleFormModal}
        afterSubmit={() => {}}
        dimension={selectedDimension}
      />
      <div className={classes.titleContainer}>
        <div className={classes.viewTitle}>
          <Typography variant="h4">{t('views.toolbar.dimensions')}</Typography>
        </div>
      </div>
      <Grid container>
        <Grid item md={8} sm={8} xs={12}>
          <SeachTextFilter
            onChangeInput={() => {}}
            searchLabel={t('views.survey.filter.search')}
            searchByLabel={t('views.survey.filter.searchBy')}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={12} container justify="flex-end">
          <Button color="primary" variant="contained" onClick={toggleFormModal}>
            {t('views.dimensions.create')}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withLayout(Dimensions);
