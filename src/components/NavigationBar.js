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
    const { classes, t } = this.props;

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
      <Link
        to={to}
        style={{ color: match ? COLORS.TEXT_LIGHTGREY : COLORS.GREEN }}
        className={optionClass}
      >
        {label}
      </Link>
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
    padding: 6,
    paddingLeft: 35
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column'
  },

  menuLinkText: {
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'none'
  }
});
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(NavigationBar))
);
