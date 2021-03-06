import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import moment from 'moment';
import Fuse from 'fuse.js';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import DeleteDraftModal from './DeleteDraftModal';
import { updateSurvey } from '../redux/actions';
import { getDrafts } from '../api';
import { getDateFormatByLocale } from '../utils/date-utils';
import { SNAPSHOTS_STATUS } from '../redux/reducers';
import { COLORS } from '../theme';
import Grid from '@material-ui/core/Grid';
import { ROLES_NAMES } from '../utils/role-utils';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const useFilterStyles = makeStyles(theme => ({
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  statusFilterContainer: {
    display: 'flex',
    width: '65%',
    justifyContent: 'flex-start'
  },
  sideSpacer: {
    width: theme.spacing(3)
  },
  filterElementContainer: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `4px solid #fff`
  },
  activeFilter: {
    borderBottom: `4px solid ${COLORS.GREEN}`
  },
  statusFilter: {
    fontSize: '13px',
    fontWeight: theme.typography.fontWeightMedium
  },
  familiesFilterContainer: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  familiesFilterInput: {
    paddingTop: '10.5px!important',
    paddingBottom: '10.5px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesLabel: {
    color: '#6A6A6A',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesFilterLabelInput: {
    transform: 'translate(14px, -6px) scale(0.75)!important'
  }
}));
const SnapshotsFilter = ({ familiesFilter, onChangeFilter }) => {
  const classes = useFilterStyles();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className={classes.mainContainer}>
        <div className={classes.familiesFilterContainer}>
          <TextField
            InputProps={{
              classes: {
                input: classes.familiesFilterInput
              }
            }}
            InputLabelProps={{
              classes: {
                root: classes.familiesLabel,
                shrink: classes.familiesFilterLabelInput
              }
            }}
            label={t('views.snapshotsTable.searchFamily')}
            variant="outlined"
            margin="dense"
            value={familiesFilter}
            fullWidth
            onChange={e => onChangeFilter(e.target.value)}
          />
        </div>
      </div>
      <Divider />
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: '100%',
    maxHeight: '50vh'
  },
  listStyle: {
    overflow: 'auto',
    paddingTop: 0,
    paddingBottom: 0
  },
  listItemStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    cursor: 'pointer'
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between'
    }
  },
  nothingToShowStyle: {
    fontSize: '16px',
    width: '100%'
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '30%'
  },
  birthDateContainer: {
    width: '30%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  birthDateStyle: {
    fontSize: '14px',
    color: '#909090'
  },
  daysAgoContainer: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center'
  },
  daysAgoStyle: {
    fontSize: '14px',
    color: '#909090'
  },
  statusContainer: {
    width: '15%',
    display: 'flex',
    justifyContent: 'center'
  },
  statusBox: {
    paddingTop: '3px',
    paddingBottom: '3px',
    width: '90px',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#e0dedc',
    borderRadius: '6px'
  },
  statusLabel: {
    fontSize: '11px',
    color: '#909090'
  },
  deleteContainer: {
    width: '5%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '14px'
  },
  deleteStyle: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#6A6A6A'
  },
  spinnerContainer: {
    width: '100%',
    height: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxStyle: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#6A6A6A',
    marginRight: 14
  }
}));

const SnapshotsTable = ({
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
  // Type can be 'single' or 'multi' for the case of delete one draft or for the case of deleting multiple drafts
  const [deletingDrafts, setDeletingDrafts] = useState({
    open: false,
    drafts: null,
    type: null
  });
  const [selectedSnapShots, setSelectedSnapshots] = useState([]);
  const reloadDrafts = useCallback(() => {
    setSnapshots([]);
    setSelectedSnapshots([]);
    setLoadingSnapshots(true);
    Promise.all([
      getDrafts(user).then(response => {
        setDraftsNumber(response.data.data.getSnapshotDraft.length);
        return get(response, 'data.data.getSnapshotDraft', []).map(element => {
          const el = { ...element };
          // Mapping keys for family data
          const familyData = { ...el.familyDataDTO };
          familyData.familyMembersList = el.familyDataDTO.familyMemberDTOList;
          delete el.familyDataDTO;
          delete familyData.familyMemberDTOList;
          // Mapping keys for priorities and achievements
          const achievements = el.snapshotStoplightAchievements;
          delete el.snapshotStoplightAchievements;
          const priorities = el.snapshotStoplightPriorities;
          delete el.snapshotStoplightPriorities;
          // Parsing state data from navigation history
          const { lifemapNavHistory: serializedLifemapNavHistory = [] } = el;
          const lifemapNavHistory = serializedLifemapNavHistory.map(nh => ({
            ...nh,
            state: nh.state ? JSON.parse(nh.state) : null
          }));
          return {
            ...el,
            familyData,
            achievements,
            priorities,
            lifemapNavHistory
          };
        });
      }),
      // TODO here we should include snapshots already taken
      Promise.resolve([])
    ])
      .then(([drafts, prevSnapshots]) => {
        const consolidated = [
          ...drafts.map(d => ({ ...d, status: SNAPSHOTS_STATUS.DRAFT })),
          ...prevSnapshots.map(d => ({
            ...d,
            status: SNAPSHOTS_STATUS.COMPLETED
          }))
        ];
        // console.log(consolidated);
        setSnapshots(consolidated);
        setLoadingSnapshots(false);
      })
      .finally(() => setDraftsLoading(false));
  }, [user, setDraftsNumber]);
  useEffect(() => {
    reloadDrafts();
  }, [user, reloadDrafts]);

  const filteredSnapshots = useMemo(() => {
    let filtered = snapshots;
    if (familiesFilter) {
      // Filter by family name or lastName using fuzzy search
      const fuseOptions = {
        shouldSort: true,
        threshold: 0.45,
        tokenize: true,
        keys: [
          'familyData.familyMembersList.firstName',
          'familyData.familyMembersList.lastName'
        ]
      };
      const fuse = new Fuse(filtered, fuseOptions);
      filtered = fuse.search(familiesFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    return filtered;
  }, [snapshots, familiesFilter, statusFilter]);

  const onChangeFamilyFilter = value => {
    setSelectedSnapshots([]);
    setFamiliesFilter(value);
  };

  const onSelect = (snap, action) => {
    let newSelectedSnapShots;
    switch (action) {
      case 'ADD':
        newSelectedSnapShots = [...selectedSnapShots, snap];
        setSelectedSnapshots(newSelectedSnapShots);
        break;
      case 'REMOVE':
        newSelectedSnapShots = selectedSnapShots.filter(
          selected => selected.draftId !== snap.draftId
        );
        setSelectedSnapshots(newSelectedSnapShots);
        break;
      case 'ADD_ALL':
        setSelectedSnapshots(snap);
        break;
      case 'REMOVE_ALL':
        setSelectedSnapshots([]);
        break;
      default:
        setSelectedSnapshots([]);
    }
  };

  const showSelectionCheckbox = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN
    );
  };

  return (
    <>
      {loadingSnapshots && (
        <div className={classes.spinnerContainer}>
          <CircularProgress />
        </div>
      )}
      {!loadingSnapshots && (
        <div className={classes.mainContainer}>
          <DeleteDraftModal
            onClose={() =>
              setDeletingDrafts({ open: false, drafts: null, type: null })
            }
            open={deletingDrafts.open}
            drafts={deletingDrafts.drafts}
            reloadDrafts={reloadDrafts}
            type={deletingDrafts.type}
          />
          <Typography variant="h5">
            {t('views.snapshotsTable.title')}
          </Typography>
          <Grid justify="center" container>
            <Grid
              direction="row"
              justify="flex-start"
              alignItems="center"
              item
              container
              md={8}
              sm={12}
              xs={12}
            >
              {showSelectionCheckbox(user) &&
                filteredSnapshots.length > 0 &&
                filteredSnapshots.length === selectedSnapShots.length && (
                  <CheckBoxIcon
                    className={classes.checkboxStyle}
                    onClick={() => onSelect([], 'REMOVE_ALL')}
                  />
                )}
              {showSelectionCheckbox(user) &&
                selectedSnapShots.length > 0 &&
                selectedSnapShots.length !== filteredSnapshots.length && (
                  <IndeterminateCheckBoxIcon
                    className={classes.checkboxStyle}
                    onClick={() => onSelect([], 'REMOVE_ALL')}
                  />
                )}
              {showSelectionCheckbox(user) &&
                filteredSnapshots.length > 0 &&
                selectedSnapShots.length === 0 && (
                  <CheckBoxOutlineBlankIcon
                    className={classes.checkboxStyle}
                    onClick={() => onSelect(filteredSnapshots, 'ADD_ALL')}
                  />
                )}
            </Grid>

            <Grid
              item
              className={classes.toolbarContainer}
              md={4}
              sm={12}
              xs={12}
            >
              <Grid container item md={2} sm={2} xs={2} alignItems="flex-end">
                {selectedSnapShots.length > 0 && (
                  <Tooltip title={t('views.snapshotsTable.deleteAll')}>
                    <IconButton
                      color="inherit"
                      component="span"
                      onClick={() =>
                        setDeletingDrafts({
                          open: true,
                          drafts: selectedSnapShots.map(snap => {
                            return snap.draftId;
                          }),
                          type: 'multi'
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>

              <Grid item md={10} sm={10} xs={10}>
                <SnapshotsFilter
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  familiesFilter={familiesFilter}
                  onChangeFilter={onChangeFamilyFilter}
                />
              </Grid>
            </Grid>
          </Grid>

          <List
            className={`${classes.listStyle} visible-scrollbar visible-scrollbar-thumb`}
          >
            {filteredSnapshots.length === 0 && (
              <ListItem className={classes.listItemStyle}>
                <div className={classes.itemContainer}>
                  <Typography
                    className={classes.nothingToShowStyle}
                    variant="subtitle1"
                  >
                    {!loadingSnapshots &&
                      snapshots.length === 0 &&
                      t('views.snapshotsTable.noSnapshotsAvailable')}
                    {!loadingSnapshots &&
                      snapshots.length !== 0 &&
                      t('views.snapshotsTable.noMatchFilters')}
                    {loadingSnapshots &&
                      t('views.snapshotsTable.loadingSnapshots')}
                  </Typography>
                </div>
              </ListItem>
            )}
            {filteredSnapshots.map((snapshot, index) => {
              const birthDate = get(
                snapshot,
                'familyData.familyMembersList[0].birthDate',
                null
              );
              const createdDaysAgo = moment().diff(
                moment.unix(snapshot.snapshotDraftDate),
                'days'
              );
              let daysAgoLabel = t('views.snapshotsTable.today');
              if (createdDaysAgo === 1) {
                daysAgoLabel = t('views.snapshotsTable.dayAgo');
              } else if (createdDaysAgo > 1) {
                daysAgoLabel = t('views.snapshotsTable.daysAgo').replace(
                  '$dd',
                  createdDaysAgo
                );
              }
              const statusLabel =
                snapshot.status === SNAPSHOTS_STATUS.DRAFT
                  ? t('views.snapshotsTable.draft')
                  : t('views.snapshotsTable.completed');

              return (
                <React.Fragment key={snapshot.draftId}>
                  <ListItem
                    className={classes.listItemStyle}
                    onClick={() =>
                      snapshot.status === SNAPSHOTS_STATUS.DRAFT &&
                      handleClickOnSnapshot(snapshot)
                    }
                  >
                    <div className={classes.itemContainer}>
                      {showSelectionCheckbox(user) && (
                        <>
                          {selectedSnapShots.find(
                            selected => selected.draftId === snapshot.draftId
                          ) ? (
                            <CheckBoxIcon
                              className={classes.checkboxStyle}
                              onClick={e => {
                                e.stopPropagation();
                                onSelect(snapshot, 'REMOVE');
                              }}
                            />
                          ) : (
                            <CheckBoxOutlineBlankIcon
                              className={classes.checkboxStyle}
                              onClick={e => {
                                e.stopPropagation();
                                onSelect(snapshot, 'ADD');
                              }}
                            />
                          )}
                        </>
                      )}

                      <Typography
                        className={classes.nameLabelStyle}
                        variant="subtitle1"
                      >{`${get(
                        snapshot,
                        'familyData.familyMembersList[0].firstName'
                      )} ${get(
                        snapshot,
                        'familyData.familyMembersList[0].lastName'
                      )}`}</Typography>
                      <div className={classes.birthDateContainer}>
                        <Typography
                          className={classes.birthDateStyle}
                          variant="h6"
                        >
                          {birthDate
                            ? `${t('views.snapshotsTable.dob')} ${moment
                                .unix(birthDate)
                                .format(dateFormat)}`
                            : ''}
                        </Typography>
                      </div>
                      <div className={classes.statusContainer}>
                        <div className={classes.statusBox}>
                          <Typography
                            className={classes.statusLabel}
                            variant="subtitle1"
                          >
                            {statusLabel}
                          </Typography>
                        </div>
                      </div>
                      <div className={classes.daysAgoContainer}>
                        <Typography
                          className={classes.daysAgoStyle}
                          variant="h6"
                        >
                          {daysAgoLabel}
                        </Typography>
                      </div>
                      <Tooltip title={t('views.snapshotsTable.delete')}>
                        <IconButton
                          style={{ color: 'black' }}
                          component="span"
                          onClick={e => {
                            e.stopPropagation();
                            setDeletingDrafts({
                              open: true,
                              drafts: snapshot,
                              type: 'single'
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {index !== filteredSnapshots.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey };

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotsTable);
