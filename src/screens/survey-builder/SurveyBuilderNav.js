import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateBuilderNavHistory } from '../../redux/actions';

const SurveyBuilderNavContext = React.createContext([]);

const SurveyBuilderNav = ({ currentSurvey, updateBuilderNavHistory }) => {
  const location = useLocation();
  const url = location.pathname;
  const { state } = location;
  useEffect(() => {
    const MAX_LENGTH = 50;
    if (currentSurvey) {
      const { lifemapNavHistory = [] } = currentSurvey;
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
        updateBuilderNavHistory({
          lifemapNavHistory: newEntries
        });
      }
    }
  }, [url, state, currentSurvey]);
  return <React.Fragment />;
};
const mapStateToProps = ({ currentSurvey }) => ({
  currentSurvey
});

const mapDispatchToProps = { updateBuilderNavHistory };

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBuilderNav);

export { SurveyBuilderNavContext };
