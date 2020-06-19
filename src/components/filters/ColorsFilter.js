import React from 'react';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { COLORS } from '../../theme';

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
  },
  checkboxesConatiner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  }
}));

const GreenCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main,
    paddingRight: 3,
    paddingLeft: 3
  },
  checked: {
    color: COLORS.GREEN
  }
}))(props => <Checkbox color={'default'} {...props} />);

const YellowCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main,
    paddingRight: 3,
    paddingLeft: 3
  },
  checked: {
    color: COLORS.YELLOW
  }
}))(props => <Checkbox color={'default'} {...props} />);

const RedCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main,
    paddingRight: 3,
    paddingLeft: 3
  },
  checked: {
    color: COLORS.RED
  }
}))(props => <Checkbox color={'default'} {...props} />);

const ColorsFilter = ({ colorsData, onChangeColors }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid item md={4}>
        <div className={classes.checkboxesConatiner}>
          <GreenCheckbox
            checked={colorsData.green}
            onChange={() =>
              onChangeColors({ ...colorsData, green: !colorsData.green })
            }
          />
          <Typography
            variant="subtitle1"
            className={classes.label}
            style={{ color: COLORS.GREEN }}
          >
            {t('views.report.filters.green')}
          </Typography>
        </div>
      </Grid>
      <Grid item md={5}>
        <div className={classes.checkboxesConatiner}>
          <YellowCheckbox
            checked={colorsData.yellow}
            onChange={() =>
              onChangeColors({ ...colorsData, yellow: !colorsData.yellow })
            }
          />
          <Typography
            variant="subtitle1"
            className={classes.label}
            style={{ color: COLORS.YELLOW }}
          >
            {t('views.report.filters.yellow')}
          </Typography>
        </div>
      </Grid>
      <Grid item md={3}>
        <div className={classes.checkboxesConatiner}>
          <RedCheckbox
            checked={colorsData.red}
            onChange={() =>
              onChangeColors({ ...colorsData, red: !colorsData.red })
            }
          />
          <Typography
            variant="subtitle1"
            className={classes.label}
            style={{ color: COLORS.RED }}
          >
            {t('views.report.filters.red')}
          </Typography>
        </div>
      </Grid>
    </div>
  );
};

export default ColorsFilter;
