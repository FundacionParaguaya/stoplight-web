import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#6A6A6A'
  },
  familyInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing()
  },
  familiesCountStyle: {
    marginRight: 4,
    color: '#626262',
    fontSize: '55px',
    fontWeight: theme.typography.fontWeightRegular,
    display: 'flex',
    flexWrap: 'wrap'
  },
  familiesLabel: { alignSelf: 'flex-end' },
  peopleCountStyle: { fontSize: '14px' },
  menWomenCountStyle: { color: '#909090', fontSize: '14px' },
  economicInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0.5)
  },
  economicsPerCapitaStyle: {
    color: '#626262',
    fontSize: '35px',
    fontWeight: theme.typography.fontWeightBold,
    display: 'flex',
    flexWrap: 'wrap',
    lineHeight: '30px'
  },
  economicBottomLabel: {
    color: '#909090',
    fontSize: '14px'
  }
}));

const FamiliesOverviewBlock = ({
  familiesOverview,
  familiesCount,
  peopleCount,
  menCount,
  womenCount,
  includeEconomics,
  innerRef,
  padding
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.mainContainer} style={{ padding }} ref={innerRef}>
      <Typography variant="h5">
        {includeEconomics
          ? t('views.familiesOverviewBlock.economics')
          : t('views.familiesOverviewBlock.overview')}
      </Typography>
      <div className={classes.familyInfoContainer}>
        <Typography
          component="p"
          variant="h4"
          className={classes.familiesCountStyle}
        >
          {familiesOverview ? familiesOverview.numberOfFamilies : familiesCount}
          <Typography
            component="span"
            variant="h6"
            className={classes.familiesLabel}
          >
            {t('views.familiesOverviewBlock.families')}
          </Typography>
        </Typography>
      </div>
      <Typography className={classes.peopleCountStyle} variant="h6">{`${t(
        'views.familiesOverviewBlock.including'
      )} ${peopleCount} ${t(
        'views.familiesOverviewBlock.people'
      )}`}</Typography>
      {/* <Typography
        className={classes.menWomenCountStyle}
        variant="h6"
      >{`${womenCount} ${t('views.familiesOverviewBlock.women')} ${t(
        'views.familiesOverviewBlock.and'
      )} ${menCount} ${t('views.familiesOverviewBlock.men')}`}</Typography> */}
      {/* {includeEconomics && (
        <React.Fragment>
          <div className={classes.economicInfoContainer}>
            <Typography
              variant="h5"
              className={classes.economicsPerCapitaStyle}
            >
              3.500$
            </Typography>
          </div>
          <Typography className={classes.economicBottomLabel} variant="h6">
            {t('views.familiesOverviewBlock.averageIncome')}
          </Typography>
        </React.Fragment>
      )} */}
    </div>
  );
};

FamiliesOverviewBlock.defaultProps = {
  familiesCount: 1350,
  peopleCount: 12500,
  menCount: 550,
  womenCount: 800
};

export default FamiliesOverviewBlock;
