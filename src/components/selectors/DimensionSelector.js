import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getDimensionsByUser } from '../../api';
import Select from 'react-select';
import * as _ from 'lodash';
import { selectStyle } from '../../utils/styles-utils';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start'
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
}));

const DimensionSelector = ({ user, dimensionData, onChangeDimension }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [dimensionOptions, setDimensionOptions] = useState([]);

  useEffect(() => {
    setLoading(true);

    getDimensionsByUser(user, language)
      .then(response => {
        const dimensions = _.get(response, 'data.data.getDimensions', []).map(
          dimension => ({
            label: dimension.name,
            value: dimension.surveyDimensionId
          })
        );
        setDimensionOptions(dimensions);
      })
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.dimensionFilter.label')}
      </Typography>

      <div className={classes.selector}>
        <Select
          value={dimensionData}
          onChange={value => onChangeDimension(value)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.dimensionFilter.loading')}
          noOptionsMessage={() => t('views.dimensionFilter.noOption')}
          options={dimensionOptions}
          components={{
            DropdownDimension: () => <div />,
            DimensionSeparator: () => <div />,
            ClearDimension: () => <div />
          }}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={false}
          hideSelectedOptions
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(DimensionSelector);
