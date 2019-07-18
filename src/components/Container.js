import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import clsx from 'clsx';

function Container(props) {
  const {
    classes,
    children,
    variant,
    className: classNameProp,
    ...other
  } = props;

  const xs = clsx({
    12: variant === 'fluid',
    11: variant === 'slim' || variant === 'stretch' || variant === undefined
  });

  const sm = clsx({
    12: variant === 'fluid',
    7: variant === 'slim',
    11: variant === 'stretch' || variant === undefined
  });

  const md = clsx({
    5: variant === 'slim',
    9: variant === 'stretch',
    8: variant === undefined,
    12: variant === 'fluid'
  });

  const lg = clsx({
    4: variant === 'slim',
    9: variant === 'stretch',
    8: variant === undefined,
    12: variant === 'fluid'
  });

  return (
    <Grid container justify="center">
      <Grid
        item
        xs={Number(xs)}
        md={Number(md)}
        lg={Number(lg)}
        sm={Number(sm)}
        {...other}
        className={`${classNameProp} ${classes.child}`}
      >
        {children}
      </Grid>
    </Grid>
  );
}

const styles = {
  root: {
    width: 990,
    maxWidth: '70%',
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
  },
  child: {
    width: '100%'
  }
};

export default withStyles(styles)(Container);
