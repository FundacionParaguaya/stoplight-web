import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { getCollectionTypes } from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';
import Select from 'react-select';
import { FormHelperText } from '@material-ui/core';
import { selectStyle } from '../../utils/styles-utils';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
      marginTop: 0
    }
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
}));

const CollectionSelector = ({
  user,
  collectionData,
  required,
  onBlur,
  onChangeCollection,
  isClearable,
  parentLang,
  error
}) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState([]);
  const label = `${t('views.collectionSelector.label')} ${required ? '*' : ''}`;

  useEffect(() => {
    setLoading(true);
    const lang = !!parentLang ? parentLang : language;
    getCollectionTypes(user, lang)
      .then(response => {
        console.log('respuesta', response);
        const collections = _.get(
          response,
          'data.data.listArticlesTypes',
          []
        ).map(collection => ({
          label: collection.code,
          value: collection.code
        }));
        setCollectionOptions(collections);
      })
      .finally(() => setLoading(false));
  }, [language, parentLang]);

  return (
    <div className={classes.container}>
      <div className={classes.selector}>
        <Select
          value={collectionData}
          onChange={value => onChangeCollection(value)}
          onBlur={onBlur}
          placeholder={label}
          isLoading={loading}
          loadingMessage={() => t('views.collectionSelector.loading')}
          noOptionsMessage={() => t('views.collectionSelector.noOption')}
          options={collectionOptions}
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
      {error && (
        <FormHelperText error={error}>
          {t('validation.fieldIsRequired')}
        </FormHelperText>
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(CollectionSelector);
