import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Delete } from '@material-ui/icons';
import { get } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getDrafts } from '../../../api';
import DeleteDraftModal from '../../../components/DeleteDraftModal';
import { updateSurvey } from '../../../redux/actions';
import { SNAPSHOTS_STATUS } from '../../../redux/reducers';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 12%',
    width: '100%',
    maxHeight: '50vh'
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
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between'
    }
  },
  daysAgoContainer: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center'
  },
  daysAgoStyle: {
    fontSize: 14,
    color: theme.palette.grey.main
  },
  statusLabel: {
    ...theme.overrides.MuiButton.contained,
    paddingTop: 10,
    paddingBottom: 10,
    height: 'fit-content',
    backgroundColor: theme.palette.primary.main
  },
  deleteContainer: {
    width: '5%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 14
  },
  deleteStyle: {
    cursor: 'pointer',
    fontSize: 24,
    color: theme.palette.grey.middle
  },
  spinnerContainer: {
    width: '100%',
    height: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const DraftItem = ({
  user,
  snapshots,
  setSnapshots,
  handleClickOnSnapshot
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [deletingDraft, setDeletingDraft] = useState({
    open: false,
    draft: null
  });

  const loadDraft = () => {
    setLoadingDraft(true);
    getDrafts(user).then(response => {
      let allSnapshots = get(response, 'data.data.getSnapshotDraft', []).map(
        element => {
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
            lifemapNavHistory,
            status: SNAPSHOTS_STATUS.DRAFT
          };
        }
      );
      setSnapshots(allSnapshots.slice(0, 1));
      setLoadingDraft(false);
    });
  };

  useEffect(() => {
    loadDraft();
  }, [user]);

  return (
    <>
      {loadingDraft && (
        <div className={classes.spinnerContainer}>
          <CircularProgress />
        </div>
      )}
      {!loadingDraft && (
        <div className={classes.mainContainer}>
          <DeleteDraftModal
            onClose={() => setDeletingDraft({ open: false, draft: null })}
            open={deletingDraft.open}
            drafts={deletingDraft.draft}
            reloadDrafts={loadDraft}
            type={'single'}
          />

          {snapshots.map(snapshot => {
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
                ? t('views.myProfile.resumeDraft')
                : t('views.snapshotsTable.completed');
            return (
              <div
                key={snapshot.draftId}
                className={classes.listItemStyle}
                onClick={() =>
                  snapshot.status === SNAPSHOTS_STATUS.DRAFT &&
                  handleClickOnSnapshot(snapshot)
                }
              >
                <div className={classes.itemContainer}>
                  <Typography
                    className={classes.statusLabel}
                    variant="subtitle1"
                  >
                    {statusLabel}
                  </Typography>

                  <div className={classes.daysAgoContainer}>
                    <Typography className={classes.daysAgoStyle} variant="h6">
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey };

export default connect(mapStateToProps, mapDispatchToProps)(DraftItem);
