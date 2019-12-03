import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { updateSurvey } from '../redux/actions';
import MaterialTable from 'material-table';
import { withSnackbar } from 'notistack';
import familyFace from '../assets/family_face_large.png';
import { Delete } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteFamilyModal from './DeleteFamilyModal';

const useStyles = makeStyles(theme => ({
  familyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: '100%',
    zIndex: 0,
    '& .MuiButtonBase-root:hover': {
      color: '#909090'
    },
    '& .MuiTypography-root': {
      color: '#6A6A6A',
      '&:hover': {
        color: '#909090'
      }
    },
    '& .MuiToolbar-root': {
      backgroundColor: '#fff'
    },
    '& .MuiTableSortLabel-iconDirectionAsc': {
      color: '#909090'
    },
    '& .MuiTableSortLabel-iconDirectionDesc': {
      color: '#909090'
    },
    '& .MuiInputBase-input': {
      padding: '0px 5px'
    }
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
  },
  deleteStyle: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#6A6A6A'
  }
}));

const FamilyTable = ({ user, setFamilies, families, loadFamilies }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const classes = useStyles();
  const [deletingFamily, setDeletingFamily] = useState({
    open: false,
    family: null
  });
  const dateFormat = getDateFormatByLocale(language);

  const goToFamily = (e, familyId) => {
    window.location.replace(
      `https://${user.env}.povertystoplight.org/#families/${familyId}`
    );
  };

  const renderDocumentType = type => {
    type = type
      .replace(/-/gi, ' ')
      .replace(/_/gi, ' ')
      .toLowerCase();

    return type;
  };

  return (
    <div className={classes.familyContainer}>
      <DeleteFamilyModal
        onClose={() => setDeletingFamily({ open: false, family: null })}
        open={deletingFamily.open}
        family={deletingFamily.family}
        reloadFamilies={loadFamilies}
      />
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
            title: t('views.familyList.familyName'),
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
            title: t('views.familyList.document'),
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
            title: t('views.familyList.familyCode'),
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
            labelRowsSelect: ''
          },
          toolbar: {
            nRowsSelected: '{0} row(s) selected',
            searchPlaceholder: t('views.familyList.search')
          },
          header: {
            actions: ''
          },
          body: {
            emptyDataSourceMessage: t('views.familyList.empty')
          }
        }}
        data={families}
        actions={[
          {
            icon: Delete,
            iconProps: {
              color: '#6A6A6A'
            },
            tooltip: 'Borrar Familia',
            onClick: (e, rowData) => {
              e.stopPropagation();
              setDeletingFamily({ open: true, family: rowData.familyId });
            }
          },
          {
            icon: ArrowForwardIosIcon,
            tooltip: 'Ver Familia',
            iconProps: {
              color: '#6A6A6A'
            },
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
