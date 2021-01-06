import { Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';

const ProjectSearchFilter = ({ onChangeProjectFilter }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.containerProjectSearch}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.projects.search')}
      </Typography>
      <TextField
        InputProps={{
          classes: {
            input: classes.projectFilterInput
          }
        }}
        InputLabelProps={{
          classes: {
            root: classes.projectsLabel,
            shrink: classes.projectsFilterLabelInput
          }
        }}
        variant="outlined"
        margin="dense"
        fullWidth
        className={classes.textField}
        onKeyDown={e => onChangeProjectFilter(e)}
        label={t('views.projects.searchProject')}
      />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  label: {
    marginRight: 10,
    fontSize: 14
  },
  projectFilterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  projectsFilterLabelInput: {
    transform: 'translate(14px, -6px) scale(0.75) !important'
  },
  projectsLabel: {
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13
  },
  textField: {
    backgroundColor: theme.palette.background.default,
    marginTop: '0px!important',
    marginBottom: '0px!important',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 2,
        border: `1.5px solid ${theme.palette.grey.quarter}`
      },
      '&:hover fieldset': {
        borderColor: 'hsl(0, 0%, 70%)'
      },
      '&.Mui-focused fieldset': {
        border: `1.5px solid ${theme.palette.primary.dark}`
      }
    }
  },
  containerProjectSearch: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

export default ProjectSearchFilter;
