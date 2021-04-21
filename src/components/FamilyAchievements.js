import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Grid, Button } from '@material-ui/core';
import Container from './Container';
import { withSnackbar } from 'notistack';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { Delete, Edit } from '@material-ui/icons';
import { COLORS } from '../theme';
import { ROLES_NAMES } from '../utils/role-utils';
import iconAchivement from '../assets/imgAch.png';
import EditAchievementModal from '../screens/families/edit/EditAchievementModal';
import DeleteAchievementModal from '../screens/families/edit/DeleteAchievementModal';

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
    alignItems: 'center',
    paddingRight: 8
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
    marginRight: '1rem',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
      marginLeft: theme.spacing(3.5)
    }
  },
  expandIcon: {
    color: '#626262'
  },
  divider: {
    flexGrow: 0,
    border: `1px solid ${theme.palette.grey.quarter}`,
    width: 3,
    marginLeft: 10,
    marginRight: 10,
    [theme.breakpoints.down('960')]: {
      visibility: 'hidden',
      width: 0,
      marginLeft: 0,
      marginRight: 0
    }
  },
  achievementContent: {
    paddingLeft: '2rem',
    paddingTop: '1.5rem',
    paddingBottom: '1rem'
  },
  emptyList: {
    paddingTop: '1rem',
    paddingBottom: '1rem'
  }
});

const FamilyAchievements = ({
  classes,
  familyId,
  user,
  stoplightSkipped,
  questions,
  achievements,
  readOnly,
  fullWidth = false,
  t,
  history
}) => {
  const showAdministrationOptions = ({ role }) => {
    return (
      (role === ROLES_NAMES.ROLE_SURVEY_USER ||
        role === ROLES_NAMES.ROLE_FAMILY_USER ||
        role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN) &&
      !readOnly
    );
  };

  const handleAddAchievement = () => {
    history.push({
      pathname: `/achievements/${familyId}`,
      state: { questions, achievementList }
    });
  };
  const [achievementList, setAchievementList] = useState([]);
  const [priorityOpen, setPriorityOpen] = useState();
  const [selectedAchievement, setSelectedAchievement] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const removeAchievement = achievementId => {
    const newAchievements = achievementList.filter(
      achievement => achievement.id !== achievementId
    );
    setAchievementList(newAchievements);
  };

  const replaceAchievement = achievement => {
    const index = achievementList.findIndex(x => x.id === achievement.id);
    const newAchievements = Array.from(achievementList);
    newAchievements[index] = achievement;
    setAchievementList(newAchievements);
  };

  useEffect(() => {
    setAchievementList(achievements ? achievements : []);
  }, [achievements]);

  return (
    <div>
      <DeleteAchievementModal
        achievementToDelete={selectedAchievement}
        open={openDeleteModal}
        afterSubmit={() => {
          removeAchievement(selectedAchievement.id);
        }}
        toggleModal={() => setOpenDeleteModal(!openDeleteModal)}
      />
      <EditAchievementModal
        achievementToEdit={selectedAchievement}
        open={openEditModal}
        afterSubmit={replaceAchievement}
        toggleModal={() => setOpenEditModal(!openEditModal)}
      />
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
          {achievementList ? achievementList.length : 0}
        </Typography>
        {achievementList && achievementList.length > 0 ? (
          <div
            style={{
              paddingRight: fullWidth ? 0 : '12%',
              paddingLeft: fullWidth ? 0 : '12%'
            }}
            className={classes.achievementsContainer}
          >
            <div className={classes.columnHeaderContainer}>
              <Typography className={classes.labelRows} variant="subtitle1">
                {t('views.familyAchievements.indicator')}
              </Typography>
            </div>
            <Accordion className={classes.achievementsTable}>
              {!!achievementList ? (
                achievementList.map((item, index) => {
                  return (
                    <AccordionItem
                      key={item.indicator}
                      className={classes.achievementTitle}
                      expanded={
                        selectedAchievement
                          ? selectedAchievement.id === item.id
                          : false
                      }
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
                          <Grid item md={5} sm={12} xs={12}>
                            <Typography variant="subtitle1">
                              {t('views.familyAchievements.action')}
                            </Typography>
                            <Typography variant="subtitle2">
                              {item.action}
                            </Typography>
                          </Grid>

                          {/* Roadmap */}
                          <Grid item md={5} sm={12} xs={12}>
                            <div
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              {/* Divider */}
                              <div className={classes.divider} />
                              <div>
                                <Typography variant="subtitle1">
                                  {t('views.familyAchievements.roadmap')}
                                </Typography>
                                <Typography variant="subtitle2">
                                  {item.roadmap}
                                </Typography>
                              </div>
                            </div>
                          </Grid>

                          <Grid
                            item
                            lg={2}
                            md={2}
                            sm={12}
                            xs={12}
                            container
                            justify="flex-end"
                          >
                            {showAdministrationOptions(user) && (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  height: 'min-content'
                                }}
                              >
                                <Tooltip
                                  title={t('views.solutions.form.editButton')}
                                  style={{ marginRight: 10 }}
                                >
                                  <IconButton
                                    style={{ color: 'black' }}
                                    component="span"
                                    onClick={() => {
                                      setSelectedAchievement(item);
                                      setOpenEditModal(true);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  title={t('views.solutions.form.deleteButton')}
                                  style={{ marginRight: 8 }}
                                >
                                  <IconButton
                                    style={{ color: 'black' }}
                                    component="span"
                                    onClick={() => {
                                      setSelectedAchievement(item);
                                      setOpenDeleteModal(true);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            )}
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

        {showAdministrationOptions(user) && !stoplightSkipped && (
          <Container
            className={classes.basicInfoText}
            variant="fluid"
            style={{ paddingBottom: '2rem' }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddAchievement}
            >
              {t('views.familyAchievements.addAchievement')}
            </Button>
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
