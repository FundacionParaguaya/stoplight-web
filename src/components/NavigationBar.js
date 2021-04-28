import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter, Link, useRouteMatch } from 'react-router-dom';
import Container from './Container';
import { COLORS } from '../theme';

class NavigationBar extends Component {
  state = {
    showLeaveModal: false
  };

  leaveSurvey = () => {
    this.props.history.push('/surveys');
  };

  render() {
    const { classes } = this.props;

    const options = this.props.options;

    return (
      <React.Fragment>
        <Container variant="fluid" className={classes.container}>
          {options &&
            options.map((option, index) => {
              return (
                <MenuLink
                  label={option.label}
                  to={option.link}
                  activeOnlyWhenExact={true}
                  first={index === 0}
                  optionClass={classes.menuLinkText}
                  optionClassAlt={classes.menuTextAlt}
                  state={option.state}
                  key={index}
                />
              );
            })}
        </Container>
      </React.Fragment>
    );
  }
}

function MenuLink({
  label,
  to,
  activeOnlyWhenExact,
  first,
  optionClass,
  optionClassAlt,
  state
}) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      {!first && <span>&nbsp; > &nbsp;</span>}
      {!match ? (
        <Link
          to={{ pathname: to, state: state }}
          style={{ color: COLORS.GREEN }}
          className={optionClass}
        >
          {label}
        </Link>
      ) : (
        <p className={optionClassAlt}>{label}</p>
      )}
    </div>
  );
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey });

const styles = theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      minHeight: '70%'
    },
    paddingTop: '1rem',
    zIndex: 10
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column'
  },

  menuLinkText: {
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'none',
    fontSize: 16
  },
  menuTextAlt: {
    color: COLORS.TEXT_LIGHTGREY,
    position: 'relative',
    textDecoration: 'none',
    fontWeight: 400,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    fontSize: 16
  }
});
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(NavigationBar))
);
