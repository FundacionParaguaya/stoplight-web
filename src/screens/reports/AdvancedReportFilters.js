import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { ROLES_NAMES } from '../../utils/role-utils';
import FacilitatorFilter from '../../components/FacilitatorFilter';
import ColorsByIndicatorFilter from '../../components/filters/ColorsByIndicatorFilter';
import IndicatorsFilter from '../../components/filters/IndicatorsFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
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

const showFalicitatorFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_ROOT ||
  role === ROLES_NAMES.ROLE_HUB_ADMIN ||
  role === ROLES_NAMES.ROLE_APP_ADMIN;

const AdvancedReportFilters = ({
  facilitatorsData,
  survey,
  indicator,
  colorsData,
  onChangeFacilitator,
  onChangeIndicator,
  onChangeColors,
  user
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
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

        <Grid item md={12} sm={12} xs={12} container>
          <IndicatorsFilter
            survey={survey}
            indicator={indicator}
            onChangeIndicator={onChangeIndicator}
            isMulti={true}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12} container spacing={1}>
          <ColorsByIndicatorFilter
            indicators={indicator}
            colorsData={colorsData}
            onChangeColors={onChangeColors}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(AdvancedReportFilters);
