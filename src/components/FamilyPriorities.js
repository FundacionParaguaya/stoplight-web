import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import { withSnackbar } from 'notistack';
import * as _ from 'lodash';
import iconPriority from '../assets/icon_priority.png';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
const FamilyPriorities = ({ classes, user, t, i18n: { language } }) => {
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
        <Typography variant="h5">Priorities · 5</Typography>
      </Container>

      <div className={classes.prioritiesContainer}>
        <div className={classes.columnHeaderContainer}>
          <Typography className={classes.labelRows} variant="subtitle1">
            Indicator
          </Typography>

          <Typography className={classes.labelRows} variant="subtitle1">
            Review Date
          </Typography>
        </div>
        <Accordion className={classes.priorityTable}>
          {[1, 2, 3, 4, 5].map(item => {
            return (
              <AccordionItem
                className={classes.priorityTitle}
                expanded={item === 1}
                title={
                  <div className={classes.priorityItemHeader}>
                    {/* Indicator Info*/}
                    <div className={classes.indicatorBasicInfoRight}>
                      <div className={classes.iconStoplight}> </div>
                      <Typography
                        className={classes.labelRows}
                        variant="subtitle1"
                      >
                        {`Eating a Nutritious Diet ${item}`}
                      </Typography>
                    </div>

                    {/* Date*/}
                    <div className={classes.indicatorBasicInfoLeft}>
                      {/* TODO Conditional question to show expandMore */}
                      <div className={classes.dateContainer}>
                        <div className={classes.monthContainer}>
                          <Typography className={classes.labelMonth}>
                            Enero 15
                          </Typography>
                        </div>

                        <div className={classes.yearContainer}>
                          <Typography className={classes.labelRows}>
                            2020
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
                    {`Months required · ${item}`}
                  </div>

                  <div className={classes.prioritiesDetailContainer}>
                    {/* Why Information*/}
                    <div>
                      <Typography className={classes.labelDetailInfo}>
                        {`Why info ${item} question?`}
                      </Typography>
                      <Typography className={classes.labelDetailInfo}>
                        Lorem ipsum this is a placeholder text. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna
                        aliqua.
                      </Typography>
                    </div>

                    {/* Divider*/}
                    <div className={classes.divider}></div>

                    {/* What Information*/}
                    <div>
                      <Typography className={classes.labelDetailInfo}>
                        {`What will you do to get it?`}
                      </Typography>
                      <Typography className={classes.labelDetailInfo}>
                        Lorem ipsum this is a placeholder text. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna
                        aliqua.
                      </Typography>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

const styles = theme => ({
  prioritiesDetailContainer: {
    display: 'flex'
  },
  divider: {
    border: '1px solid #DCDEE3',
    width: 3,
    marginLeft: 30,
    marginRight: 30
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
    backgroundColor: '#E1504D',
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
