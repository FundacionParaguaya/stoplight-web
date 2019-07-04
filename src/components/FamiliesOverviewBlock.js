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
  menWomenCountStyle: { color: '#909090', fontSize: '14px' }
}));

const FamiliesOverviewBlock = ({
  familiesCount,
  peopleCount,
  menCount,
  womenCount,
  innerRef
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.mainContainer} ref={innerRef}>
      <Typography variant="h5">
        {t('views.familiesOverviewBlock.overview')}
      </Typography>
      <div className={classes.familyInfoContainer}>
        <Typography
          component="p"
          variant="h4"
          className={classes.familiesCountStyle}
        >
          {familiesCount}
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
      <Typography
        className={classes.menWomenCountStyle}
        variant="h6"
      >{`${womenCount} ${t('views.familiesOverviewBlock.women')} ${t(
        'views.familiesOverviewBlock.and'
      )} ${menCount} ${t('views.familiesOverviewBlock.men')}`}</Typography>
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
