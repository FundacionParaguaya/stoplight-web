import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { updateSurvey } from '../redux/actions';
import { getFamiliesList } from '../api';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import familyFace from '../assets/family_face_large.png';
import { Delete } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: '100%'
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '100%'
  },
  documentLabel: {
    fontSize: '14px',
    color: '#909090',
    textTransform: 'capitalize'
  },

  birthDateStyle: {
    fontSize: '14px',
    color: '#909090'
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
  const dateFormat = getDateFormatByLocale(language);

  const goToFamily = (e, familyId) => {
    window.location.replace(
      `https://${user.env}.povertystoplight.org/#families/${familyId}`
    );
  };

  const renderDocumentType = type => {
    console.log(type);
    type = type
      .replace(/-/gi, ' ')
      .replace(/_/gi, ' ')
      .toLowerCase();
    console.log(type);

    return type;
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
          search: false,
          toolbar: false,
          actionsColumnIndex: 4,
          pageSize: 10,
          rowStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          },
          headerStyle: {
            backgroundColor: '#fff',
            color: '#626262',
            fontSize: '14px'
          },
          searchFieldStyle: {
            backgroundColor: '#fff',
            color: '#626262'
          }
        }}
        columns={[
          //Column Avatar number of members
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

          //Column Family Name
          {
            title: 'Family Name',
            field: 'name',
            render: rowData => (
              <div>
                <Typography
                  className={classes.nameLabelStyle}
                  variant="subtitle1"
                >
                  {rowData.name}
                </Typography>
                <Typography className={classes.birthDateStyle} variant="h6">
                  {rowData.person.birthdate
                    ? `${t('views.snapshotsTable.dob')} ${moment(
                        rowData.person.birthdate
                      ).format(dateFormat)}`
                    : ''}
                </Typography>
              </div>
            )
          },
          //Column Document
          {
            title: 'Document',
            field: 'person.identificationNumber',
            render: rowData => (
              <div>
                <Typography className={classes.documentLabel} variant="h6">
                  {rowData.person.identificationType
                    ? renderDocumentType(rowData.person.identificationType)
                    : ''}
                </Typography>
                <Typography
                  className={classes.nameLabelStyle}
                  variant="subtitle1"
                >
                  {rowData.person.identificationNumber}
                </Typography>
              </div>
            )
          },
          //Column Family Code
          {
            title: 'Family Code',
            field: 'code',
            render: rowData => (
              <Typography className={classes.nameLabelStyle} variant="h6">
                {rowData.code ? rowData.code : ''}
              </Typography>
            )
          }
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
          },
          {
            icon: ArrowForwardIosIcon,
            tooltip: 'Ver Familia',
            onClick: (event, rowData) => goToFamily(event, rowData.familyId)
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
