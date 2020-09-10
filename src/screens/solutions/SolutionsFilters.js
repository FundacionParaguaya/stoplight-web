import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CountrySelector from '../../components/selectors/CountrySelector';
import DimensionSelector from '../../components/selectors/DimensionSelector';
import IndicatorSelector from '../../components/selectors/IndicatorSelector';
import SearchTextFilter from '../../components/filters/SearchTextFilter';
import { ROLES_NAMES } from '../../utils/role-utils';

import SolutionTypeSelector from './SolutionTypeSelector';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  innerContainer: {
    zIndex: 11 // To override material table
  },
  filter: {
    marginTop: 0,
    marginBottom: 0
  },
  button: {
    height: 39,
    marginBottom: 20
  },
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  typeSelector: {
    marginTop: 20,
    alignItems: 'flex-start'
  }
}));

const showCountryFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM ||
  role === ROLES_NAMES.ROLE_ROOT ||
  role === ROLES_NAMES.ROLE_HUB_ADMIN;

const SolutionFilters = ({
  countryData,
  dimensionData,
  indicatorsData,
  solutionTypeData,
  onChangeCountry,
  onChangeDimension,
  onChangeIndicator,
  onChangeFilterText,
  onChangeSolutionType,
  goToForm,
  user
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid
        className={classes.innerContainer}
        container
        justify="space-between"
        spacing={1}
      >
        {showCountryFilters(user) && (
          <Grid item lg={2} md={2} sm={2} xs={12}>
            <CountrySelector
              withTitle={false}
              countryData={countryData}
              onChangeCountry={onChangeCountry}
              error={false}
              required={false}
            />
          </Grid>
        )}
        <Grid item lg={4} md={4} sm={4} xs={12}>
          <DimensionSelector
            withTitle={false}
            dimensionData={dimensionData}
            onChangeDimension={onChangeDimension}
            error={false}
            required={false}
            isClearable={true}
          />
        </Grid>
        <Grid item lg={3} md={3} sm={4} xs={12}>
          <IndicatorSelector
            withTitle={false}
            indicatorsData={indicatorsData}
            onChangeIndicator={onChangeIndicator}
            error={false}
            required={false}
            isMulti={true}
            isClearable={true}
          />
        </Grid>
        <Grid
          item
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className={classes.typeSelector}
          container
          alignItems="center"
          justify="flex-end"
        >
          <SolutionTypeSelector
            withTitle={false}
            solutionTypeData={solutionTypeData}
            onChangeSolutionType={onChangeSolutionType}
            isClearable={true}
            className={classes.filter}
          />
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <SearchTextFilter
            onChangeInput={onChangeFilterText}
            searchLabel={t('views.solutions.search')}
            searchByLabel={t('views.solutions.searchBy')}
          />
        </Grid>
        <Grid
          item
          lg={3}
          md={4}
          sm={4}
          xs={12}
          className={classes.gridAlignRight}
        >
          <Button
            variant="contained"
            onClick={goToForm}
            className={classes.button}
          >
            {t('views.solutions.addSolution')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(SolutionFilters);
