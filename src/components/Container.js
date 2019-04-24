import React from 'react';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';

function Container(props) {
  const {
    classes,
    children,
    variant,
    className: classNameProp,
    ...other
  } = props;

  const className = clsx(
    classes.root,
    {
      [classes.fluid]: variant === 'fluid',
      [classes.stretch]: variant === 'stretch',
      [classes.slim]: variant === 'slim'
    },
    classNameProp
  );

  return (
    <Grid container justify="center">
      <Grid
        item
        xs={Number(xs)}
        md={Number(md)}
        lg={Number(lg)}
        sm={Number(sm)}
        {...other}
        className={classNameProp}
      >
        {children}
      </Grid>
    </Grid>
  );
}

const styles = {
  root: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  fluid: {
    width: '100%'
  },
  stretch: {
    width: '75%'
  },
  slim: {
    width: '30%'
  }
};

export default withStyles(styles)(Container);
