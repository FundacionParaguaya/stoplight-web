import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import Editor from '../components/Editor';

const styles = theme => ({
  screen: {
    flex: 1,
    padding: 20
  }
});

const Solutions = ({ classes, user, t }) => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({});
  const [plainData, setPlainData] = useState(null);

  return (
    <div className={classes.screen}>
      <h2>Content</h2>
      <Editor
        data={data}
        handleData={editorData => setData(editorData)}
        handlePlainData={editorPlainData => setPlainData(editorPlainData)}
        handleStats={editorStats => setStats(editorStats)}
        placeholder={t('views.familyProfile.changeFacilitator')}
      />

      <Button onClick={() => console.log(data)}>Guardar</Button>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Solutions)))
  )
);
