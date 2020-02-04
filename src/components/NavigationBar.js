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
                  activeOnlyWhenExact={false}
                  first={index === 0}
                  optionClass={classes.menuLinkText}
                  key={index}
                />
              );
            })}
        </Container>
      </React.Fragment>
    );
  }
}

function MenuLink({ label, to, activeOnlyWhenExact, first, optionClass }) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div>
      {!first && <span>&nbsp; > &nbsp;</span>}
      {!match ? (
        <Link to={to} style={{ color: COLORS.GREEN }} className={optionClass}>
          {label}
        </Link>
      ) : (
        <a
          style={{
            color: COLORS.TEXT_LIGHTGREY,
            fontSize: '16px',
            fontWeight: 400
          }}
          className={optionClass}
        >
          {label}
        </a>
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
    paddingTop: '1rem'
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
  }
});
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(NavigationBar))
);