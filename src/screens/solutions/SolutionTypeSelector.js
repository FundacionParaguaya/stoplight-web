import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Select from 'react-select';
import { selectStyle } from '../../utils/styles-utils';
import { getSolutionTypes } from '../../api';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 20,
    marginBottom: 20,
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

const solutionTypeSelector = ({
  withTitle,
  user,
  solutionTypeData,
  onChangeSolutionType,
  className,
  isClearable,
  parentLang
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const label = t('views.solutions.form.solutionType');

  const [loading, setLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    setLoading(true);
    let lang = !!parentLang ? parentLang : language;
    getSolutionTypes(user, lang)
      .then(response => {
        const typeOptions = _.get(response, 'data.data.solutionTypes', []).map(
          type => ({
            label: type.description,
            value: type.code
          })
        );
        setTypeOptions(typeOptions);
      })
      .finally(() => setLoading(false));
  }, [language, parentLang]);

  return (
    <div className={clsx(classes.container, className)}>
      {withTitle && (
        <Typography variant="subtitle1" className={classes.label}>
          {label}
        </Typography>
      )}

      <div className={classes.selector}>
        <Select
          value={solutionTypeData}
          onChange={value => onChangeSolutionType(value)}
          placeholder={withTitle ? '' : label}
          isLoading={loading}
          loadingMessage={() => t('views.indicatorFilter.loading')}
          noOptionsMessage={() => t('views.indicatorFilter.noOption')}
          options={typeOptions}
          components={{
            DropdownDimension: () => <div />,
            DimensionSeparator: () => <div />,
            ClearDimension: () => <div />
          }}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={isClearable}
          hideSelectedOptions
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(solutionTypeSelector);
