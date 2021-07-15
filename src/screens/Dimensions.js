import * as _ from 'lodash';

import { Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import Container from '../components/Container';
import DimensionForm from './dimensions/DimensionForm';
import DimensionList from './dimensions/DimensionList';
import DropdownMenu from '../components/header/DropdownMenu';
import SeachTextFilter from '../components/filters/SearchTextFilter';
import { connect } from 'react-redux';
import { dimensionsPool } from '../api';
import englishLogo from '../assets/english.png';
import { makeStyles } from '@material-ui/core/styles';
import paragLogo from '../assets/paraguay.png';
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
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState({});
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [filterLang, setFilterLang] = useState(language);
  const [filter, setFilter] = useState('');
  const classes = useStyles();

  const toggleFormModal = dimension => {
    setOpenFormModal(!openFormModal);
    setSelectedDimension(dimension);
  };

  const loadDimensions = () => {
    setLoading(true);
    setFilter('');
    dimensionsPool(filterLang, language, user)
      .then(response => {
        console.log(response);
        const data = _.get(response, 'data.data.dimensionsByLang');
        setDimensions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = event => {
    setFilterLang(event);
  };

  const languageOptions = [
    {
      code: 'en',
      image: englishLogo,
      label: 'English',
      action: () => handleClose('en')
    },
    {
      code: 'es',
      image: paragLogo,
      label: 'Español',
      action: () => handleClose('es')
    }
  ];

  useEffect(() => {
    loadDimensions();
  }, [filterLang]);

  const reloadPage = () => {
    loadDimensions();
  };

  const langOption =
    languageOptions.find(o => o.code === filterLang) || languageOptions[0];
  const placeHolderDropdownMenu = langOption.label;
  const filteredDimensions = dimensions.filter(
    o => !filter || o.name.indexOf(filter) >= 0
  );

  return (
    <Container variant="stretch">
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <DimensionForm
        open={openFormModal}
        toggleModal={() => setOpenFormModal(!openFormModal)}
        afterSubmit={reloadPage}
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
            onChangeInput={e => setFilter(e.target.value)}
            searchLabel={t('views.survey.filter.search')}
            searchByLabel={t('views.survey.filter.searchBy')}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={12} container justify="flex-end">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setSelectedDimension({});
              setOpenFormModal(!openFormModal);
            }}
          >
            {t('views.dimensions.create')}
          </Button>
        </Grid>
      </Grid>
      <Grid container justify="flex-end">
        <Grid item>
          <DropdownMenu
            placeholder={placeHolderDropdownMenu}
            options={languageOptions}
          />
        </Grid>
      </Grid>
      <DimensionList
        dimensions={filteredDimensions}
        toggleFormModal={toggleFormModal}
      />
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withLayout(Dimensions));
