import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@material-ui/core';
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
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 40
  }
}));

const DimensionItem = ({ item, handleClick }) => {
  const classes = useStyles();

  const { t } = useTranslation();

  return (
    <div className={classes.row}>
      <div className={classes.container} style={{ maxWidth: '80%' }}>
        <div className={classes.iconContainer}>
          {item.iconUrl && (
            <img src={item.iconUrl} className={classes.icon} alt="Icon" />
          )}
        </div>

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

DimensionItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default DimensionItem;
