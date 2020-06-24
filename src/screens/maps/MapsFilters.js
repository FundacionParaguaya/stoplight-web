import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ROLES_NAMES } from '../../utils/role-utils';
import OrganizationsFilter from '../../components/OrganizationsFilter';
import HubsFilter from '../../components/HubsFilter';
import SurveysFilter from '../../components/SurveysFilter';
import FacilitatorFilter from '../../components/FacilitatorFilter';
import ColorsFilter from '../../components/filters/ColorsFilter';
import IndicatorsFilter from '../../components/filters/IndicatorsFilter';
import SearchTextFilter from '../../components/filters/SearchTextFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10
  },
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  label: {
    marginRight: theme.spacing(1),
    fontSize: 14
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const showOrganizationFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM ||
  role === ROLES_NAMES.ROLE_ROOT ||
  role === ROLES_NAMES.ROLE_HUB_ADMIN ||
  role === ROLES_NAMES.ROLE_APP_ADMIN;

const showFalicitatorFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_ROOT ||
  role === ROLES_NAMES.ROLE_HUB_ADMIN ||
  role === ROLES_NAMES.ROLE_APP_ADMIN;

const MapsFilters = ({
  hubData,
  organizationsData,
  surveyData,
  indicatorData,
  facilitatorsData,
  colorsData,
  onChangeHub,
  onChangeOrganization,
  onChangeSurvey,
  onChangeIndicator,
  onChangeFacilitator,
  onChangeColor,
  onChangeText,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const onChangeSearchText = e => {
    if (e.key === 'Enter') {
      onChangeText(e.target.value);
    }
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
        {showHubFilters(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <HubsFilter data={hubData} onChange={onChangeHub} stacked={true} />
          </Grid>
        )}
        {showOrganizationFilters(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <OrganizationsFilter
              data={organizationsData}
              onChange={onChangeOrganization}
              hub={hubData}
              stacked={true}
            />
          </Grid>
        )}
        <Grid item md={12} sm={12} xs={12}>
          <SurveysFilter
            data={surveyData}
            onChange={onChangeSurvey}
            hub={hubData}
            organizations={organizationsData}
            isMulti={false}
            stacked={true}
            preSelect={true}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <IndicatorsFilter
            survey={surveyData}
            indicator={indicatorData}
            onChangeIndicator={onChangeIndicator}
            isMulti={false}
            preSelect={true}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <ColorsFilter
            colorsData={colorsData}
            onChangeColors={onChangeColor}
          />
        </Grid>
        {showFalicitatorFilters(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <FacilitatorFilter
              data={facilitatorsData}
              onChange={onChangeFacilitator}
              isMulti={true}
              label={t('views.facilitatorFilter.label')}
              stacked={true}
            />
          </Grid>
        )}
        <Grid item md={12} sm={12} xs={12}>
          <SearchTextFilter
            onChangeInput={onChangeSearchText}
            searchLabel={t('views.map.filters.search')}
            searchByLabel={t('views.map.filters.searchBy')}
            stacked={true}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(MapsFilters);
