import React, { Component } from 'react';
import ErrorPage from '../screens/ErrorPage';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  listenHistory = () => {
    this.props.history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    });
  };
  componentDidMount() {
    this.listenHistory();
  }

  componentWillUnmount() {
    this.listenHistory();
  }

  render() {
    const { user } = this.props;
    if (this.state.hasError) {
      return <ErrorPage user={user} />;
    } else {
      return this.props.children;
    }
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default withRouter(connect(mapStateToProps)(ErrorBoundary));
