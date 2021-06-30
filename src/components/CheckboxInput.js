import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import GreenCheckbox from './GreenCheckbox';

const CheckboxInput = ({ label, onChange, checked }) => (
  <Grid
    container
    alignItems="center"
    style={{ cursor: 'pointer' }}
    onClick={() => onChange()}
  >
    <GreenCheckbox onChange={() => {}} checked={checked} />
    <Typography variant="subtitle2">{label}</Typography>
  </Grid>
);

CheckboxInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default CheckboxInput;
