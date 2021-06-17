import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import GreenCheckbox from './GreenCheckbox';

const CheckboxInput = ({ label, onChange, checked }) => (
  <Grid container alignItems="center">
    <GreenCheckbox onChange={e => onChange()} checked={checked} />
    <Typography variant="subtitle2">{label}</Typography>
  </Grid>
);

export default CheckboxInput;
