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
import moment from 'moment';
import Fuse from 'fuse.js';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { updateSurvey } from '../redux/actions';
import { getDrafts } from '../api';
import { getDateFormatByLocale } from '../utils/date-utils';
import { SNAPSHOTS_STATUS } from '../redux/reducers';
import { COLORS } from '../theme';
import Grid from '@material-ui/core/Grid';

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
  const reloadDrafts = useCallback(() => {
    setSnapshots([]);
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
  return (
    <>
      {loadingSnapshots && (
        <div className={classes.spinnerContainer}>
          <CircularProgress />
        </div>
      )}
      {!loadingSnapshots && (
        <div className={classes.mainContainer}>
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
                      <div className={classes.deleteContainer}>
                        <Delete
                          className={classes.deleteStyle}
                          onClick={e => {
                            e.stopPropagation();
                            setDeletingDraft({ open: true, draft: snapshot });
                          }}
                        />
                      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FamilyTable);
