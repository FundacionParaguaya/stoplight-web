import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Button } from '@material-ui/core';
import Container from '../components/Container';
import { withSnackbar } from 'notistack';
import iconPriority from '../assets/icon_priority.png';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { getPrioritiesByFamily } from '../api';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { getMonthFormatByLocale } from '../utils/date-utils';
import moment from 'moment';
import { COLORS } from '../theme';

const FamilyPriorities = ({
  classes,
  familyId,
  questions,
  user,
  t,
  i18n: { language },
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const [priorities, setPriorities] = useState([]);

  const dateFormat = getMonthFormatByLocale(language);

  const getColor = stopligh => {
    if (stopligh === 2) {
      return COLORS.YELLOW;
    } else {
      return COLORS.RED;
    }
  };

  const handleAddPriority = (e, familyId) => {
    history.push(`/priorities`);
  };

  const loadPriorities = familyId => {
    //Call api

    getPrioritiesByFamily(user, Number(familyId))
      .then(response => {
        setPriorities(response.data.data.prioritiesByFamily);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.familyPriorities.errorLoading'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };
  useEffect(() => {
    loadPriorities(familyId);
  }, [familyId]);

  return (
    <div>
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
        <div className={classes.prioritiesContainer}>
          <div className={classes.columnHeaderContainer}>
            <Typography className={classes.labelRows} variant="subtitle1">
              {t('views.familyPriorities.indicator')}
            </Typography>

            <Typography className={classes.labelRows} variant="subtitle1">
              {t('views.familyPriorities.review')}
            </Typography>
          </div>
          <Accordion className={classes.priorityTable}>
            {priorities ? (
              priorities.map(item => {
                return (
                  <AccordionItem
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
                        <div className={classes.indicatorBasicInfoLeft}>
                          {/* TODO Conditional question to show expandMore */}
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
                          <ExpandMore className={classes.expandIcon} />
                        </div>
                      </div>
                    }
                  >
                    {/* Priority Details*/}
                    <div className={classes.priorityContent}>
                      {/* Month*/}
                      <div className={classes.monthInfoContainer}>
                        {t('views.familyPriorities.months')} · {item.months}
                      </div>

                      <div className={classes.prioritiesDetailContainer}>
                        {/* Why Information*/}
                        <div className={classes.whyWhatDetailInfo}>
                          <Typography className={classes.labelTitleDetailInfo}>
                            {t('views.lifemap.whyDontYouHaveIt')}
                          </Typography>
                          <Typography className={classes.labelDetailInfo}>
                            {item.reason}
                          </Typography>
                        </div>

                        {/* Divider*/}
                        <div className={classes.divider}></div>

                        {/* What Information*/}
                        <div className={classes.whyWhatDetailInfo}>
                          <Typography className={classes.labelTitleDetailInfo}>
                            {t('views.lifemap.whatWillYouDoToGetIt')}
                          </Typography>
                          <Typography className={classes.labelDetailInfo}>
                            {item.action}
                          </Typography>
                        </div>
                      </div>
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
          <Typography
            variant="h6"
            style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
          >
            {t('views.familyPriorities.noPriorities')}
          </Typography>
        </Container>
      )}

      <Container
        className={classes.basicInfoText}
        variant="fluid"
        style={{ paddingBottom: '2rem' }}
      >
        <Button variant="contained" onClick={handleAddPriority}>
          Agregar Prioridad
        </Button>
      </Container>
    </div>
  );
};

const styles = theme => ({
  whyWhatDetailInfo: {
    flexGrow: 1
  },
  prioritiesDetailContainer: {
    display: 'flex'
  },
  divider: {
    flexGrow: 0,
    border: '1px solid #DCDEE3',
    width: 3,
    marginLeft: 30,
    marginRight: 30
  },
  labelTitleDetailInfo: {
    fontSize: 16,
    color: '#6A6A6A',
    paddingBottom: '1rem'
  },
  labelDetailInfo: {
    fontSize: 16,
    color: '#1C212F',
    paddingBottom: '1rem'
  },
  monthInfoContainer: {
    fontSize: 16,
    color: '#6A6A6A',
    marginBottom: '2rem'
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
    //backgroundColor: '#E1504D',
    minWidth: 28,
    minHeight: 28,
    marginRight: '1rem'
  },

  priorityTitle: {
    paddingRight: '2rem',
    paddingLeft: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    '&:nth-child(2n - 1)': {
      backgroundColor: '#F3F4F6'
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
    paddingRight: '12%',
    paddingLeft: '12%',
    paddingBottom: '2rem'
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9,
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
    alignItems: 'center'
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
