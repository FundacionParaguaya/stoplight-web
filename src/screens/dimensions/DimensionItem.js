import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import logo from '../../assets/dimension_agroproductive.png';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  row: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.quarter}`
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 32,
    marginRight: theme.spacing(1)
  }
}));

const DimensionItem = ({ item, handleClick }) => {
  const classes = useStyles();

  const { t } = useTranslation();

  return (
    <div className={classes.row}>
      <div className={classes.container} style={{ maxWidth: '80%' }}>
        <img src={logo} className={classes.icon} />
        <Typography variant="subtitle1">{item.name}</Typography>
      </div>
      <div className={classes.container}>
        <Tooltip title={t('general.edit')}>
          <IconButton color="inherit" onClick={() => handleClick(item)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default DimensionItem;
