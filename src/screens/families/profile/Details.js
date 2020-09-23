import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from 'react-sanfona';
import PersonalDetails from './PersonalDetails';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '10px 12% 10px 12%',
    backgroundColor: theme.palette.background.default
  },
  advancedContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    borderRadius: 2,
    border: `1.5px solid ${theme.palette.grey.quarter}`,
    '&:hover': {
      border: `1.5px solid ${theme.palette.primary.main}`
    }
  },
  advancedLabel: {
    color: theme.palette.primary.dark,
    width: '80%',
    paddingLeft: '20%',
    textAlign: 'center'
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    width: '20%'
  }
}));

const Details = ({
  primaryParticipant,
  familyMembers,
  latitude,
  longitude
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openFamilyDetails, setOpenFamilyDetails] = useState(false);

  return (
    <Accordion className={classes.container}>
      <AccordionItem
        onExpand={() => setOpenFamilyDetails(!openFamilyDetails)}
        onClose={() => setOpenFamilyDetails(!openFamilyDetails)}
        title={
          <div className={classes.advancedContainer}>
            <Typography className={classes.advancedLabel} variant="subtitle1">
              {t('views.familyProfile.familyDetails')}
            </Typography>
            {!openFamilyDetails ? (
              <KeyboardArrowDown className={classes.expandIcon} />
            ) : (
              <KeyboardArrowUp className={classes.expandIcon} />
            )}
          </div>
        }
      >
        <PersonalDetails
          primaryParticipant={primaryParticipant}
          familyMembers={familyMembers}
          latitude={latitude}
          longitude={longitude}
        />
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
