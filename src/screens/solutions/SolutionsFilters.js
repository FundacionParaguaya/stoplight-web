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

const useStyles = makeStyles(theme => ({
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
  },
  solutionTypeFilter: {
    marginTop: 0,
    marginBottom: 0,
    [theme.breakpoints.down('md')]: {
      marginTop: -20
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
      marginBottom: 40
    }
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
  language,
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
          <Grid item lg={3} md={4} sm={3} xs={12}>
            <CountrySelector
              withTitle={false}
              countryData={countryData}
              parentLang={language}
              onChangeCountry={onChangeCountry}
              error={false}
              required={false}
            />
          </Grid>
        )}
        <Grid item lg={3} md={4} sm={5} xs={12}>
          <DimensionSelector
            withTitle={false}
            dimensionData={dimensionData}
            parentLang={language}
            onChangeDimension={onChangeDimension}
            error={false}
            required={false}
            isClearable={true}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={4} xs={12}>
          <IndicatorSelector
            withTitle={false}
            indicatorsData={indicatorsData}
            dimensionData={dimensionData}
            parentLang={language}
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
          md={4}
          sm={5}
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
            parentLang={language}
            isClearable={true}
            className={classes.solutionTypeFilter}
          />
        </Grid>
        <Grid item md={4} sm={7} xs={12} lg={6}>
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
          sm={12}
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
