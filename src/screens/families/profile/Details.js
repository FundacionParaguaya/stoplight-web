import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from 'react-sanfona';
import EconomicDetails from './EconomicDetails';
import PersonalDetails from './PersonalDetails';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 15,
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
    marginBottom: 10,
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
    textAlign: 'center',
    fontSize: 20
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    width: '20%'
  },
  item: {
    '& .react-sanfona-item-body': {
      maxHeight: 'none'
    }
  },
  expandedItem: {
    '& .react-sanfona-item-body': {
      maxHeight: 'none!important'
    }
  }
}));

const Details = ({
  primaryParticipant,
  familyMembers,
  latitude,
  longitude,
  economicData,
  membersEconomicData
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openFamilyDetails, setOpenFamilyDetails] = useState(false);
  const [openEconomicDetails, setOpenEconomicDetails] = useState(false);
  const [sanitazedFamilyMembers, setSanitazedFamilyMembers] = useState([]);

  useEffect(() => {
    let cleanfamilyMembers = familyMembers.filter(
      member => !member.firstParticipant && member
    );
    setSanitazedFamilyMembers(cleanfamilyMembers);
  }, [familyMembers]);

  return (
    <Accordion className={classes.container}>
      <AccordionItem
        key={1}
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
          familyMembers={sanitazedFamilyMembers}
          latitude={latitude}
          longitude={longitude}
        />
      </AccordionItem>

      <AccordionItem
        key={2}
        onExpand={() => setOpenEconomicDetails(!openEconomicDetails)}
        onClose={() => setOpenEconomicDetails(!openEconomicDetails)}
        title={
          <div className={classes.advancedContainer}>
            <Typography className={classes.advancedLabel} variant="subtitle1">
              {t('views.familyProfile.economicDetails')}
            </Typography>
            {!openEconomicDetails ? (
              <KeyboardArrowDown className={classes.expandIcon} />
            ) : (
              <KeyboardArrowUp className={classes.expandIcon} />
            )}
          </div>
        }
        className={clsx(
          openEconomicDetails && classes.item,
          openEconomicDetails && classes.expandedItem
        )}
      >
        <EconomicDetails
          economicData={economicData}
          membersEconomicData={membersEconomicData}
        />
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
