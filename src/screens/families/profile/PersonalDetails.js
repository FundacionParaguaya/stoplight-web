import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import countries from 'localized-countries';
import moment from 'moment';
import React, { useState } from 'react';
import { Gmaps } from 'react-gmaps';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import familyFaceIcon from '../../../assets/family_face_large.png';
import MarkerIcon from '../../../assets/marker.png';
import { getDateFormatByLocale } from '../../../utils/date-utils';
import { ROLES_NAMES } from '../../../utils/role-utils';
import { getLanguageByCode } from '../../../utils/lang-utils';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingLeft: '12%',
    paddingRight: '12%',
    position: 'relative',
    marginTop: 5,
    marginBottom: 10,
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tabsRoot: {
    width: '100%',
    '& $div > span': {
      backgroundColor: theme.palette.primary.dark,
      height: 4
    },
    '& $div >.MuiTabs-flexContainer': {
      justifyContent: 'space-between'
    }
  },
  tabRoot: {
    minHeight: 50,
    padding: '5px 15px',
    color: theme.typography.h4.color,
    height: 'auto',
    width: 'auto',
    '&.MuiTab-textColorSecondary.Mui-selected': {
      color: theme.typography.h4.color
    },
    '&.MuiTab-textColorSecondary.MuiTab-fullWidth': {
      borderBottom: `1px solid ${theme.palette.grey.quarter}`
    }
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  label: {
    fontFamily: 'Open Sans',
    fontWeight: 500,
    margin: '0px 10px 0px 10px'
  },
  actionIcon: {
    paddingLeft: 18,
    paddingRight: 15
  },
  answer: {
    fontFamily: 'Open Sans',
    color: theme.palette.text.light,
    marginLeft: 10
  },
  memberTitle: {
    marginLeft: 10,
    fontWeight: 500
  },
  markerContainer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    top: '50%'
  },
  markerIcon: {
    height: 30,
    width: 25,
    position: 'absolute',
    userSelect: 'none',
    top: '-43px',
    left: '-17.85px',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none'
  }
}));

const params = { v: '3.exp', key: process.env.REACT_APP_MAP_API_KEY || '' };

const PersonalDetails = ({
  primaryParticipant,
  familyMembers,
  latitude,
  longitude,
  user,
  history,
  readOnly
}) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const dateFormat = getDateFormatByLocale(language);
  const lang = getLanguageByCode(language);
  const countryOptions = countries(
    require(`localized-countries/data/${lang}`)
  ).array();
  const { familyId } = useParams();

  const [value, setValue] = useState(1);

  const getCountryByCode = code => {
    return (
      !!code && countryOptions.find(country => country.code === code).label
    );
  };

  const handleChange = (event, value) => {
    setValue(value);
  };

  const showEditButtons = ({ role }) =>
    (role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER) &&
    !readOnly;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: classes.tabsRoot }}
        >
          <Tab
            key={1}
            classes={{ root: classes.tabRoot }}
            label={
              <Typography variant="h6" className={classes.tabTitle}>
                {t('views.primaryParticipant')}
              </Typography>
            }
            value={1}
          />
          <Tab
            key={2}
            classes={{ root: classes.tabRoot }}
            label={
              <Typography variant="h6" className={classes.tabTitle}>
                {t('views.familyMembers')}
              </Typography>
            }
            value={2}
          />
          <Tab
            key={3}
            classes={{ root: classes.tabRoot }}
            label={
              <Typography variant="h6" className={classes.tabTitle}>
                {t('views.location.title')}
              </Typography>
            }
            value={3}
          />
        </Tabs>

        {value === 1 && (
          <Grid container>
            {showEditButtons(user) && (
              <Grid
                item
                md={12}
                container
                justify="flex-end"
                style={{ height: 30 }}
              >
                <Tooltip
                  title={t('views.solutions.form.editButton')}
                  style={{ paddingTop: 4 }}
                >
                  <IconButton
                    style={{ color: 'black' }}
                    component="span"
                    onClick={() => {
                      history.push(`/family/${familyId}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.firstName')}:`}
              </Typography>
              <Typography
                variant="h6"
                className={classes.answer}
                style={{ textTransform: 'capitalize' }}
              >
                {primaryParticipant.firstName}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.documentType')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {primaryParticipant.documentTypeText}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.lastName')}:`}
              </Typography>
              <Typography
                variant="h6"
                className={classes.answer}
                style={{ textTransform: 'capitalize' }}
              >
                {primaryParticipant.lastName}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.documentNumber')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {primaryParticipant.documentNumber}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.gender')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {primaryParticipant.genderText}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.countryOfBirth')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {getCountryByCode(primaryParticipant.birthCountry)}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.dateOfBirth')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {moment
                  .unix(primaryParticipant.birthDate)
                  .utc(true)
                  .format(dateFormat)}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.email')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {primaryParticipant.email}
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6" className={classes.label}>
                {`${t('views.family.phone')}:`}
              </Typography>
              <Typography variant="h6" className={classes.answer}>
                {!!primaryParticipant.phoneNumber &&
                  `+${primaryParticipant.phoneCode}-${primaryParticipant.phoneNumber}`}
              </Typography>
            </Grid>
          </Grid>
        )}

        {value === 2 && (
          <Grid container>
            {familyMembers.length > 0 ? (
              <React.Fragment>
                {showEditButtons(user) && (
                  <Grid
                    item
                    md={12}
                    container
                    justify="flex-end"
                    style={{ height: 30 }}
                  >
                    <Tooltip
                      title={t('views.solutions.form.editButton')}
                      style={{ paddingTop: 4 }}
                    >
                      <IconButton
                        style={{ color: 'black' }}
                        component="span"
                        onClick={() => {
                          history.push(`/family/${familyId}/edit-members`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
                {familyMembers.map((member, index) => (
                  <Grid
                    item
                    container
                    md={6}
                    sm={6}
                    xs={12}
                    spacing={2}
                    key={index}
                    style={{ marginTop: 10 }}
                  >
                    <Grid item container md={12}>
                      <img alt="" height={30} width={30} src={familyFaceIcon} />
                      <Typography variant="h6" className={classes.memberTitle}>
                        {t('views.family.familyMember')} {index + 2}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="h6" className={classes.label}>
                        {`${t('views.family.firstName')}:`}
                      </Typography>
                      <Typography variant="h6" className={classes.answer}>
                        {member.firstName}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="h6" className={classes.label}>
                        {`${t('views.family.gender')}:`}
                      </Typography>
                      <Typography variant="h6" className={classes.answer}>
                        {member.genderText}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="h6" className={classes.label}>
                        {`${t('views.family.dateOfBirth')}:`}
                      </Typography>
                      <Typography variant="h6" className={classes.answer}>
                        {!!member.birthDate &&
                          moment
                            .unix(member.birthDate)
                            .utc(true)
                            .format(dateFormat)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </React.Fragment>
            ) : (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: 250 }}
              >
                <Typography variant="h6" className={classes.memberTitle}>
                  {t('views.familyProfile.noMember')}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {value === 3 && (
          <React.Fragment>
            {showEditButtons(user) && (
              <Grid
                container
                spacing={2}
                justify="flex-end"
                style={{ margin: '0px 0px 5px 0px' }}
              >
                <Tooltip title={t('views.solutions.form.editButton')}>
                  <IconButton
                    style={{ color: 'black' }}
                    component="span"
                    onClick={() => {
                      history.push(
                        `/family/${familyId}/edit-location/${latitude}/${longitude}`
                      );
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ margin: '0px 0px 5px 0px' }}
            >
              <Gmaps
                height="240px"
                width="100%"
                lat={latitude}
                lng={longitude}
                zoom={16}
                maxZoom={!!user.hub && user.hub.zoomLimit === true ? 13 : ''}
                minZoom={2}
                loadingMessage={t('views.location.mapLoading')}
                params={params}
                disableDefaultUI
                draggable={false}
                scrollwheel={false}
                clickableIcons={false}
                disableDoubleClickZoom={true}
                zoomControl={true}
              >
                <div className={classes.markerContainer}>
                  <img src={MarkerIcon} className={classes.markerIcon} alt="" />
                </div>
              </Gmaps>
            </Grid>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(PersonalDetails);
