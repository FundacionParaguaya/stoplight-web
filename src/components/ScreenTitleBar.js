import React from 'react';
import { Typography, withStyles, Badge } from '@material-ui/core';

const ScreenTitleBar = ({ classes, title, subtitle, betaBadge }) => {
  return (
    <div className={classes.container}>
      {betaBadge && (
        <StyledBadge badgeContent="Beta!" className={classes.badge}>
          <Typography variant="h4">{title}</Typography>
        </StyledBadge>
      )}
      {!betaBadge && <Typography variant="h4">{title}</Typography>}
      <Typography variant="h6">{subtitle || ''}</Typography>
    </div>
  );
};

const StyledBadge = withStyles(theme => ({
  badge: {
    color: '#fff',
    backgroundColor: theme.palette.secondary.main,
    fontSize: '10px!important',
    borderRadius: 2,
    fontFamily: 'Poppins',
    padding: '0px 5px',
    paddingTop: 1,
    top: 10,
    right: -10
  }
}))(props => <Badge {...props} />);

const styles = {
  container: {
    padding: '60px 0'
  }
};

export default withStyles(styles)(ScreenTitleBar);
