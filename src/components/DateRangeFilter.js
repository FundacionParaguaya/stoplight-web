import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  fromLabel: {
    marginRight: theme.spacing(1),
    fontSize: 14
  },
  toLabel: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontSize: 14
  },
  familiesFilterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  familiesLabel: {
    color: '#6A6A6A',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesFilterLabelInput: {
    transform: 'translate(14px, -6px) scale(0.75)!important'
  },
  textField: {
    backgroundColor: '#fff',
    marginTop: '0px!important',
    marginBottom: '0px!important',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: '2px',
        border: '1.5px solid #DCDEE3'
      },
      '&:hover fieldset': {
        borderColor: 'hsl(0, 0%, 70%)'
      },
      '&.Mui-focused fieldset': {
        border: '1.5px solid #309E43'
      }
    }
  }
}));

const DateRangeFilter = ({ from, setFrom, to, setTo }) => {
  const {
    i18n: { language },
    t
  } = useTranslation();
  const dateFormat = getDateFormatByLocale(language);
  const classes = useStyles();

  const fromProps = {
    format: dateFormat,
    value: from ? moment.unix(from) : null,
    okLabel: t('general.ok'),
    cancelLabel: t('general.cancel'),
    onChange: value => setFrom(value ? value.unix() : null),
    fullWidth: true,
    TextFieldComponent: passedProps => {
      return (
        <TextField
          {...passedProps}
          InputProps={{
            classes: {
              input: classes.familiesFilterInput
            }
          }}
          InputLabelProps={{
            classes: {
              root: classes.familiesLabel,
              shrink: classes.familiesFilterLabelInput
            }
          }}
          variant="outlined"
          margin="dense"
          className={classes.textField}
        />
      );
    }
  };
  const toProps = {
    format: dateFormat,
    value: to ? moment.unix(to) : null,
    okLabel: t('general.ok'),
    cancelLabel: t('general.cancel'),
    onChange: value => setTo(value ? value.unix() : null),
    fullWidth: true,
    TextFieldComponent: passedProps => {
      return (
        <TextField
          {...passedProps}
          InputProps={{
            classes: {
              input: classes.familiesFilterInput
            }
          }}
          InputLabelProps={{
            classes: {
              root: classes.familiesLabel,
              shrink: classes.familiesFilterLabelInput
            }
          }}
          variant="outlined"
          margin="dense"
          className={classes.textField}
        />
      );
    }
  };
  return (
    <div className={classes.container}>
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale={language}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          f
          <Typography variant="subtitle1" className={classes.fromLabel}>
            {t('views.dateRangeFilter.from')}
          </Typography>
          <DatePicker
            clearLabel={t('general.clear')}
            clearable
            {...fromProps}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Typography variant="subtitle1" className={classes.toLabel}>
            {t('views.dateRangeFilter.to')}
          </Typography>
          <DatePicker clearLabel={t('general.clear')} clearable {...toProps} />
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DateRangeFilter;
