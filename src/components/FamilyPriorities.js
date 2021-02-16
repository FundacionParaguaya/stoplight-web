import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Button, Grid } from '@material-ui/core';
import Container from '../components/Container';
import { withSnackbar } from 'notistack';
import iconPriority from '../assets/icon_priority.png';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import {
  getMonthFormatByLocale,
  getDateFormatByLocale
} from '../utils/date-utils';
import moment from 'moment';
import { COLORS } from '../theme';
import { ROLES_NAMES } from '../utils/role-utils';
import { useWindowSize } from '../utils/hooks-helpers';

const FamilyPriorities = ({
  classes,
  familyId,
  stoplightSkipped,
  questions,
  priorities,
  user,
  fullWidth = false,
  t,
  i18n: { language },
  history
}) => {
  const dateFormat = getMonthFormatByLocale(language);
  const fullDateFormat = getDateFormatByLocale(language);
  const windowSize = useWindowSize();
  const showReviewDate = windowSize.width > 600;
  const [priorityOpen, setPriorityOpen] = useState();

  const getColor = stopligh => {
    if (stopligh === 2) {
      return COLORS.YELLOW;
    } else {
      return COLORS.RED;
    }
  };

  const showAdministrationOptions = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN
    );
  };

  const handleAddPriority = e => {
    history.push({
      pathname: `/priorities/${familyId}`,
      state: { questions: questions }
    });
  };

  return (
    <React.Fragment>
      {/* Header */}
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconBaiconFamilyBorder}>
          <img
            src={iconPriority}
            className={classes.iconFamily}
            alt="Family Member"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">
          {t('views.familyPriorities.priorities')} ·{' '}
          {priorities ? priorities.length : 0}
        </Typography>
      </Container>
      {priorities && priorities.length > 0 ? (
        <div
          style={{
            paddingRight: fullWidth ? 0 : '12%',
            paddingLeft: fullWidth ? 0 : '12%'
          }}
          className={classes.prioritiesContainer}
        >
          <div className={classes.columnHeaderContainer}>
            <Typography className={classes.labelRows} variant="subtitle1">
              {t('views.familyPriorities.indicator')}
            </Typography>

            {showReviewDate && (
              <Typography className={classes.labelRows} variant="subtitle1">
                {t('views.familyPriorities.review')}
              </Typography>
            )}
          </div>
          <Accordion className={classes.priorityTable}>
            {priorities ? (
              priorities.map((item, index) => {
                return (
                  <AccordionItem
                    key={item.reviewDate}
                    onExpand={() => setPriorityOpen(index)}
                    onClose={() => setPriorityOpen('')}
                    className={classes.priorityTitle}
                    title={
                      <div className={classes.priorityItemHeader}>
                        {/* Indicator Info*/}
                        <div className={classes.indicatorBasicInfoRight}>
                          <div
                            className={classes.iconStoplight}
                            style={{ backgroundColor: getColor(item.color) }}
                          >
                            {' '}
                          </div>
                          <Typography
                            className={classes.labelRows}
                            variant="subtitle1"
                          >
                            {item.indicator}
                          </Typography>
                        </div>

                        {/* Date*/}
                        {showReviewDate && (
                          <div className={classes.indicatorBasicInfoLeft}>
                            <div className={classes.dateContainer}>
                              <div className={classes.monthContainer}>
                                <Typography className={classes.labelMonth}>
                                  {item.reviewDate
                                    ? `${moment
                                        .unix(item.reviewDate)
                                        .format(dateFormat)}`
                                    : ''}
                                </Typography>
                              </div>

                              <div className={classes.yearContainer}>
                                <Typography className={classes.labelRows}>
                                  {item.reviewDate
                                    ? `${moment
                                        .unix(item.reviewDate)
                                        .format('YYYY')}`
                                    : ''}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        )}
                        {priorityOpen !== index ? (
                          <ExpandMore className={classes.expandIcon} />
                        ) : (
                          <ExpandLess className={classes.expandIcon} />
                        )}
                      </div>
                    }
                  >
                    {/* Priority Details*/}
                    <div className={classes.priorityContent}>
                      <Grid container spacing={2}>
                        {!showReviewDate && (
                          <Grid
                            item
                            md={12}
                            sm={12}
                            xs={12}
                            container
                            alignItems="center"
                          >
                            <Typography
                              variant="subtitle1"
                              style={{ marginRight: 5 }}
                            >
                              {t('views.familyPriorities.review')}:
                            </Typography>
                            <Typography variant="subtitle2">
                              {item.updatedAt
                                ? `${moment
                                    .unix(item.reviewDate)
                                    .format(fullDateFormat)}`
                                : ''}
                            </Typography>
                          </Grid>
                        )}

                        {/* Created At*/}
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          container
                          alignItems="center"
                        >
                          <Typography
                            variant="subtitle1"
                            style={{ marginRight: 5 }}
                          >
                            {t('views.familyPriorities.updatedAt')}:
                          </Typography>
                          <Typography variant="subtitle2">
                            {item.updatedAt
                              ? `${moment
                                  .unix(item.updatedAt)
                                  .format(fullDateFormat)}`
                              : ''}
                          </Typography>
                        </Grid>

                        {/* Month*/}
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          container
                          alignItems="center"
                        >
                          <Typography
                            variant="subtitle1"
                            style={{ marginRight: 5 }}
                          >
                            {t('views.familyPriorities.months')}:
                          </Typography>
                          <Typography variant="subtitle2">
                            {item.months}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        {/* Why Information*/}
                        <Grid item md={5} sm={12} xs={12}>
                          <Typography variant="subtitle1">
                            {t('views.lifemap.whyDontYouHaveIt')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {item.reason}
                          </Typography>
                        </Grid>

                        {/* Divider*/}
                        <div className={classes.divider} />

                        {/* What Information*/}
                        <Grid item md={5} sm={12} xs={12}>
                          <Typography variant="subtitle1">
                            {t('views.lifemap.whatWillYouDoToGetIt')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {item.action}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </AccordionItem>
                );
              })
            ) : (
              <div>Loading</div>
            )}
          </Accordion>
        </div>
      ) : (
        <Container className={classes.basicInfoText} variant="fluid">
          <Typography variant="h6" style={{ padding: '1rem' }}>
            {t('views.familyPriorities.noPriorities')}
          </Typography>
        </Container>
      )}

      {showAdministrationOptions(user) && !stoplightSkipped && (
        <Container
          className={classes.basicInfoText}
          variant="fluid"
          style={{ paddingBottom: '2rem' }}
        >
          <Button variant="contained" onClick={handleAddPriority}>
            {t('views.familyPriorities.addPriority')}
          </Button>
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = theme => ({
  divider: {
    flexGrow: 0,
    border: `1px solid ${theme.palette.grey.quarter}`,
    width: 3,
    marginLeft: 30,
    marginRight: 30,
    [theme.breakpoints.down('660')]: {
      visibility: 'hidden'
    }
  },
  monthInfoContainer: {
    marginBottom: '2rem',
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(2)
    }
  },
  createdAtContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2)
  },
  monthContainer: {
    padding: '0.3rem'
  },
  yearContainer: {
    background: '#F3F4F6',
    borderLeft: '1px solid #DCDEE3',
    boxSizing: 'border-box',
    borderRadius: '2px',
    padding: '0.3rem'
  },
  dateContainer: {
    display: 'flex',
    background: '#FFFFFF',
    border: '1px solid #DCDEE3',
    boxSizing: 'border-box',
    borderRadius: '2px',
    marginRight: '2rem'
  },
  expandIcon: { color: '#626262' },

  priorityItemHeader: {
    display: 'flex',
    alignItems: 'Center'
  },

  indicatorBasicInfoRight: {
    flex: '1 1 0%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  indicatorBasicInfoLeft: {
    flex: '1 1 0%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  priorityContent: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1rem'
  },

  iconStoplight: {
    display: 'inline-block',
    border: '3px solid #FFFFFF',
    borderRadius: '50%',
    minWidth: 28,
    minHeight: 28,
    marginRight: '1rem',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
      marginLeft: theme.spacing(3.5)
    }
  },

  priorityTitle: {
    paddingRight: '2rem',
    paddingLeft: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    '&:nth-child(2n - 1)': {
      backgroundColor: '#F3F4F6'
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  },
  priorityTable: {
    width: '100%',
    mixBlendMode: 'normal',
    //opacity: '0.5',
    paddingBotton: '2rem'
  },
  labelRows: {
    marginRight: 5,
    marginLeft: 5,
    fontSize: 18,
    color: '#6A6A6A'
  },
  labelMonth: {
    marginRight: 5,
    marginLeft: 5,
    fontSize: 18,
    color: '#626262',
    fontWeight: 500
  },

  columnHeaderContainer: {
    height: 37,
    width: '100%',
    opacity: 1,
    backgroundColor: '#DCDEE3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  prioritiesContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
    //position: 'relative'
  },

  administratorContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: '2%',
    marginBottom: '2%',
    paddingRight: '12%',
    paddingLeft: '12%',
    paddingTop: '2%'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },

  iconBaiconFamilyBorder: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconFamily: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withSnackbar(FamilyPriorities)))
  )
);
