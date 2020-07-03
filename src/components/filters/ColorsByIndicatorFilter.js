import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ColorsFilter from './ColorsFilter';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },

  labelContainer: {
    marginRight: theme.spacing(1),
    paddingLeft: 20,
    fontSize: 14,
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    justifyContent: 'flex-start'
  },
  label: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

const ColorsByIndicatorFilter = ({
  indicators,
  colorsData,
  onChangeColors
}) => {
  const classes = useStyles();

  useEffect(() => {
    let newColorsData = [];
    indicators.forEach(indicator => {
      let colors = colorsData.find(
        colors => colors.codename === indicator.value
      );
      !!colors
        ? newColorsData.push({
            codename: indicator.value,
            name: indicator.label,
            values: colors.values
          })
        : newColorsData.push({
            codename: indicator.value,
            name: indicator.label,
            values: { green: true, yellow: true, red: true }
          });
    });
    onChangeColors(newColorsData);
  }, [indicators]);

  const onChangeIndicatorsColors = (colors, codename) => {
    let index = colorsData.findIndex(colors => colors.codename === codename);
    colorsData[index].values = colors;
    onChangeColors(colorsData);
  };

  return colorsData.map(indicator => (
    <div className={classes.container} key={indicator.codename}>
      <Grid container>
        <Grid item md={3} sm={12} xs={12}>
          <Tooltip title={indicator.name} aria-label="name">
            <div className={classes.labelContainer}>
              <Typography variant="subtitle1" className={classes.label}>
                {indicator.name}
              </Typography>
            </div>
          </Tooltip>
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <ColorsFilter
            colorsData={indicator.values}
            onChangeColors={colors =>
              onChangeIndicatorsColors(colors, indicator.codename)
            }
          />
        </Grid>
      </Grid>
    </div>
  ));
};

export default ColorsByIndicatorFilter;
