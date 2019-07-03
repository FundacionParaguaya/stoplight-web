import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowForwardIos, SwapCalls } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { get } from 'lodash';
import { updateSurvey, updateDraft } from '../redux/actions';
import { getDateFormatByLocale } from '../utils/date-utils';
import { SNAPSHOTS_STATUS } from '../redux/reducers';
import { COLORS } from '../theme';

const useFilterStyles = makeStyles(theme => ({
  mainContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  statusFilterContainer: {
    display: 'flex',
    width: '70%',
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
    width: '30%'
  }
}));
const SnapshotsFilter = ({
  statusFilter,
  setStatusFilter,
  familiesFilter,
  setFamiliesFilter
}) => {
  const classes = useFilterStyles();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className={classes.mainContainer}>
        <div className={classes.statusFilterContainer}>
          <div
            className={`${classes.filterElementContainer} ${
              classes.activeFilter
            }`}
          >
            <Typography variant="h6" className={classes.statusFilter}>
              {t('views.snapshotsTable.all')}
            </Typography>
          </div>
          <div className={classes.sideSpacer} />
          <div className={classes.filterElementContainer}>
            <Typography variant="h6" className={classes.statusFilter}>
              {t('views.snapshotsTable.drafts')}
            </Typography>
          </div>
          <div className={classes.sideSpacer} />
          <div className={classes.filterElementContainer}>
            <Typography variant="h6" className={classes.statusFilter}>
              {t('views.snapshotsTable.completed')}
            </Typography>
          </div>
        </div>
        <div className={classes.familiesFilterContainer} />
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
    width: '100%'
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
    paddingBottom: theme.spacing(2)
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  retakeContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '5%'
  },
  retakeIcon: {
    transform: 'rotate(90deg)',
    fontSize: '20px',
    color: '#909090'
  },
  nameLabelStyle: {
    fontSize: '14px',
    width: '30%'
  },
  birthDateContainer: {
    width: '25%',
    display: 'flex',
    justifyContent: 'center'
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
  forwardArrowContainer: {
    width: '5%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  forwardArrowStyle: {
    fontSize: '16px',
    color: '#909090'
  }
}));

const SnapshotsTable = ({ snapshots = [] }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const dateFormat = getDateFormatByLocale(language);
  const classes = useStyles();
  return (
    <div className={classes.mainContainer}>
      <Typography variant="h5">{t('views.snapshotsTable.title')}</Typography>
      <SnapshotsFilter />
      <List className={classes.listStyle}>
        {snapshots.map((snapshot, index) => {
          const birthDate = get(
            snapshot,
            'familyData.familyMembersList[0].birthDate',
            null
          );
          const createdDaysAgo = moment().diff(snapshot.created, 'days');
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
              <ListItem className={classes.listItemStyle}>
                <div className={classes.itemContainer}>
                  <div className={classes.retakeContainer}>
                    <SwapCalls className={classes.retakeIcon} />
                  </div>
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
                    <Typography className={classes.birthDateStyle} variant="h6">
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
                    <Typography className={classes.daysAgoStyle} variant="h6">
                      {daysAgoLabel}
                    </Typography>
                  </div>
                  <div className={classes.forwardArrowContainer}>
                    <ArrowForwardIos className={classes.forwardArrowStyle} />
                  </div>
                </div>
              </ListItem>
              {index !== snapshots.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

const mapStateToProps = ({ snapshots }) => ({ snapshots });

const mapDispatchToProps = { updateSurvey, updateDraft };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapshotsTable);
