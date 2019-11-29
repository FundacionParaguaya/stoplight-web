import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { updateSurvey } from '../redux/actions';
import { getFamiliesList } from '../api';
import { getDateFormatByLocale } from '../utils/date-utils';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import familyFace from '../assets/family_face_large.png';
import { Delete } from '@material-ui/icons';

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
  setDraftsLoading,
  enqueueSnackbar
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const [families, setFamilies] = useState([]);

  const goToFamily = rowData => {
    //TODO
  };

  const loadFamilies = () => {
    //TODO send information about pagination, family name and organizations
    getFamiliesList(user, 1, null, null)
      .then(response => {
        setFamilies(response.data.content);
      })
      .catch(function(error) {
        setFamilies([]);
        enqueueSnackbar('Error al cargar lista de familias: ' + error.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      });
  };
  useEffect(() => {
    loadFamilies();
  }, []);
  return (
    <div className={classes.familyContainer}>
      <MaterialTable
        options={{
          actionsColumnIndex: 4,
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
          {
            field: 'id',
            Title: 'Avatar',
            render: rowData => (
              <img
                src={familyFace}
                style={{ width: 30, borderRadius: '50%' }}
              />
            )
          },
          { title: 'Family Name', field: 'name' },
          { title: 'Document', field: 'person.identificationNumber' },
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
        data={families}
        actions={[
          {
            icon: Delete,
            tooltip: 'Borrar Familia',
            onClick: (event, rowData) => goToFamily(rowData)
          }
        ]}
        title=""
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(FamilyTable));
