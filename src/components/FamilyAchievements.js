import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Grid } from '@material-ui/core';
import Container from './Container';
import { withSnackbar } from 'notistack';
import iconAchivement from '../assets/imgAch.png';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { COLORS } from '../theme';
import ExpandLess from '@material-ui/icons/ExpandLess';

const styles = theme => ({
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
  },
  iconAchivementFamilyBorder: {
    border: `2px solid ${theme.palette.background.default}`,
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconAchievement: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  achievementsContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: '2rem',
    paddingRight: '12%',
    paddingLeft: '12%',
    paddingBottom: '2rem'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnHeaderContainer: {
    height: 37,
    width: '100%',
    opacity: 1,
    backgroundColor: theme.palette.grey.quarter,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  labelRows: {
    marginRight: 5,
    marginLeft: 5,
    fontSize: 18,
    color: theme.palette.grey.middle
  },
  achievementsTable: {
    width: '100%',
    mixBlendMode: 'normal',
    paddingBotton: '2rem'
  },
  achievementItemHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  indicatorBasicInfoLeft: {
    flex: '1 1 0%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  indicatorBasicInfoRight: {
    flex: '1 1 0%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  achievementTitle: {
    paddingRight: '2rem',
    paddingLeft: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    '&:nth-child(2n - 1)': {
      backgroundColor: theme.palette.background.paper
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  },
  iconStoplight: {
    display: 'inline-block',
    border: '3px solid #FFFFFF',
    borderRadius: '50%',
    minWidth: 28,
    minHeight: 28,
    marginRight: '1rem'
  },
  expandIcon: {
    color: '#626262'
  },
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
  achievementContent: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1rem'
  },
  emptyList: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
    marginBottom: 36
  }
});

const FamilyAchievements = ({ classes, achievements, t }) => {
  const [priorityOpen, setPriorityOpen] = useState();
  return (
    <div>
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconAchivementFamilyBorder}>
          <img
            src={iconAchivement}
            className={classes.iconAchievement}
            alt="Family Achievements"
          />
        </div>
      </Container>
      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">
          {t('views.familyAchievements.achievements')} ·{' '}
          {achievements ? achievements.length : 0}
        </Typography>
        {achievements && achievements.length > 0 ? (
          <div className={classes.achievementsContainer}>
            <div className={classes.columnHeaderContainer}>
              <Typography className={classes.labelRows} variant="subtitle1">
                {t('views.familyAchievements.indicator')}
              </Typography>
            </div>
            <Accordion className={classes.achievementsTable}>
              {achievements ? (
                achievements.map((item, index) => {
                  return (
                    <AccordionItem
                      key={item.indicator}
                      className={classes.achievementTitle}
                      onExpand={() => setPriorityOpen(index)}
                      onClose={() => setPriorityOpen('')}
                      title={
                        <div className={classes.achievementItemHeader}>
                          <div className={classes.indicatorBasicInfoRight}>
                            <div
                              className={classes.iconStoplight}
                              style={{ backgroundColor: COLORS.GREEN }}
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
                          {priorityOpen !== index ? (
                            <ExpandMore className={classes.expandIcon} />
                          ) : (
                            <ExpandLess className={classes.expandIcon} />
                          )}
                        </div>
                      }
                    >
                      <div className={classes.achievementContent}>
                        <Grid container spacing={2}>
                          {/* Action */}
                          <Grid item md={5} sm={5} xs={12}>
                            <Typography variant="subtitle1">
                              {t('views.familyAchievements.action')}
                            </Typography>
                            <Typography variant="subtitle2">
                              {item.action}
                            </Typography>
                          </Grid>

                          {/* Divider*/}
                          <div className={classes.divider}></div>

                          {/* Roadmap */}
                          <Grid item md={5} sm={5} xs={12}>
                            <Typography variant="subtitle1">
                              {t('views.familyAchievements.roadmap')}
                            </Typography>
                            <Typography variant="subtitle2">
                              {item.roadmap}
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
            <Typography variant="h6" className={classes.emptyList}>
              {t('views.familyAchievements.noAchievements')}
            </Typography>
          </Container>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(
      withTranslation()(withSnackbar(FamilyAchievements))
    )
  )
);
