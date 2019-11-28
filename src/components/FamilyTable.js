import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Fuse from 'fuse.js';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { updateSurvey } from '../redux/actions';
import { getDrafts } from '../api';
import { getDateFormatByLocale } from '../utils/date-utils';
import { SNAPSHOTS_STATUS } from '../redux/reducers';
import { COLORS } from '../theme';
import MaterialTable from 'material-table';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: '100%'
  }
}));

const FamilyTable = ({
  user,
  handleClickOnSnapshot,
  setDraftsNumber,
  setDraftsLoading
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const dateFormat = getDateFormatByLocale(language);
  const classes = useStyles();
  const [statusFilter, setStatusFilter] = useState('');
  const [familiesFilter, setFamiliesFilter] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(false);
  const [deletingDraft, setDeletingDraft] = useState({
    open: false,
    draft: null
  });

  const goToFamily = rowData => {
    //TODO
  };
  return (
    <div className={classes.familyContainer}>
      <MaterialTable
        options={{
          pageSize: 10,
          rowStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          },
          headerStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          },
          searchFieldStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          }
        }}
        columns={[
          { title: 'Family Name', field: 'name' },
          { title: 'Document', field: 'document' },
          { title: 'Family Code', field: 'code' }
        ]}
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} of {count}',
            labelRowsSelect: 'Filas'
          },
          toolbar: {
            nRowsSelected: '{0} row(s) selected',
            searchPlaceholder: 'Buscar'
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: 'No hay registros para mostrar',
            filterRow: {
              filterTooltip: 'Filtrar'
            }
          }
        }}
        data={[]}
        actions={[
          {
            icon: 'delete',
            tooltip: 'Borrar Usuario',
            onClick: (event, rowData) => goToFamily(rowData)
          }
        ]}
        title="Lista de Usuarios"
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey };

export default connect(mapStateToProps, mapDispatchToProps)(FamilyTable);
