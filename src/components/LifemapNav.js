import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateNavHistory as updateNavHistoryAction } from '../redux/actions';

const LifemapNavContext = React.createContext([]);

const LifemapNav = ({ location, currentDraft, updateNavHistory }) => {
  const url = location.pathname;
  const { state } = location;
  React.useEffect(() => {
    const MAX_LENGTH = 50;
    if (currentDraft) {
      const { lifemapNavHistory = [] } = currentDraft;
      let duplicatedUrl = false;
      if (
        lifemapNavHistory.length > 0 &&
        lifemapNavHistory[lifemapNavHistory.length - 1].url === url
      ) {
        duplicatedUrl = true;
      }
      if (!duplicatedUrl) {
        let newEntries = [...lifemapNavHistory, { url, state }];
        if (newEntries.length > MAX_LENGTH) {
          newEntries = newEntries.slice(1);
        }
        updateNavHistory({
          lifemapNavHistory: newEntries
        });
      }
    }
  }, [url, state, currentDraft, updateNavHistory]);
  return <div />;
};
const mapStateToProps = ({ currentDraft }) => ({
  currentDraft
});

const mapDispatchToProps = { updateNavHistory: updateNavHistoryAction };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LifemapNav));
export { LifemapNavContext };
