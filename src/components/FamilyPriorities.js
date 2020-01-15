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
                title={`Item ${item}`}
                expanded={item === 1}
              >
                <div className={classes.priorityContent}>
                  {`Item ${item} content`}
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
  priorityContent: {},

  priorityTitle: {
    paddingRight: '2rem',
    paddingLeft: '2rem',
    paddingTop: '1rem',
    paddingBotton: '1rem',
    '&:nth-child(2n - 1)': {
      backgroundColor: '#F3F4F6'
    }
  },
  priorityTable: {
    width: '100%',
    mixBlendMode: 'normal',
    opacity: '0.5',
    paddingBotton: '2rem'
  },
  labelRows: {
    marginRight: 10,
    marginLeft: 10,
    fontSize: 16,
    height: 20,
    color: '#6A6A6A'
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
