import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'react-sanfona';
import FacilitatorFilter from '../../components/FacilitatorFilter';
import ColorsFilter from '../../components/filters/ColorsFilter';
import IndicatorsFilter from '../../components/filters/IndicatorsFilter';
import HubsFilter from '../../components/HubsFilter';
import OrganizationsFilter from '../../components/OrganizationsFilter';
import SurveysFilter from '../../components/SurveysFilter';
import { useWindowSize } from '../../utils/hooks-helpers';
import { ROLES_NAMES } from '../../utils/role-utils';

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
  },
  mapTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2
  },
  moreFilter: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    borderRadius: 2,
    border: `1.5px solid ${theme.palette.grey.quarter}`,
    '&:hover': {
      border: `1.5px solid ${theme.palette.primary.main}`
    }
  },
  advancedLabel: {
    color: theme.palette.primary.dark,
    width: '80%',
    paddingLeft: '20%',
    textAlign: 'center'
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    width: '20%'
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
  onChangeColors,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const showAllFilters = width > 960;

  const [expandedFilters, setExpandedFilters] = useState(false);

  return (
    <div className={classes.container}>
      <Grid container spacing={showAllFilters ? 2 : 1}>
        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.mapTitle}>
            <Typography variant="h4">{t('views.toolbar.map')}</Typography>
          </div>
        </Grid>
        {showHubFilters(user) && showAllFilters && (
          <Grid item md={12} sm={12} xs={12}>
            <HubsFilter data={hubData} onChange={onChangeHub} stacked={true} />
          </Grid>
        )}
        {showOrganizationFilters(user) && showAllFilters && (
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
        {showFalicitatorFilters(user) && showAllFilters && (
          <Grid item md={12} sm={12} xs={12}>
            <FacilitatorFilter
              data={facilitatorsData}
              organizations={organizationsData}
              onChange={onChangeFacilitator}
              isMulti={true}
              label={t('views.facilitatorFilter.label')}
              stacked={true}
            />
          </Grid>
        )}
        <Grid item md={12} sm={6} xs={12}>
          <IndicatorsFilter
            survey={surveyData}
            indicator={indicatorData}
            onChangeIndicator={onChangeIndicator}
            isMulti={false}
            preSelect={true}
          />
        </Grid>
        <Grid item md={12} sm={6} xs={12}>
          <ColorsFilter
            colorsData={colorsData}
            onChangeColors={onChangeColors}
          />
        </Grid>
        {!showAllFilters &&
          (showHubFilters(user) ||
            showOrganizationFilters(user) ||
            showFalicitatorFilters(user)) && (
            <Grid item md={12} sm={12} xs={12}>
              <Accordion>
                <AccordionItem
                  onExpand={() => setExpandedFilters(!expandedFilters)}
                  onClose={() => setExpandedFilters(!expandedFilters)}
                  title={
                    <div className={classes.moreFilter}>
                      <Typography
                        className={classes.advancedLabel}
                        variant="subtitle1"
                      >
                        {t('views.map.filters.moreFilters')}
                      </Typography>
                      {!expandedFilters ? (
                        <KeyboardArrowDown className={classes.expandIcon} />
                      ) : (
                        <KeyboardArrowUp className={classes.expandIcon} />
                      )}
                    </div>
                  }
                >
                  {showHubFilters(user) && (
                    <Grid item md={12} sm={12} xs={12}>
                      <HubsFilter
                        data={hubData}
                        onChange={onChangeHub}
                        stacked={true}
                      />
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
                  {showFalicitatorFilters(user) && (
                    <Grid item md={12} sm={12} xs={12}>
                      <FacilitatorFilter
                        data={facilitatorsData}
                        organizations={organizationsData}
                        onChange={onChangeFacilitator}
                        isMulti={true}
                        label={t('views.facilitatorFilter.label')}
                        stacked={true}
                      />
                    </Grid>
                  )}
                </AccordionItem>
              </Accordion>
            </Grid>
          )}
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(MapsFilters);
