import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../components/withLayout';
import { CircularProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import { getArticleById } from '../../api';
import { useParams } from 'react-router';
import * as _ from 'lodash';
import moment from 'moment';
import { getDateFormatByLocale } from '../../utils/date-utils';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Tooltip from '@material-ui/core/Tooltip';
import NavigationBar from '../../components/NavigationBar';
import { ROLES_NAMES } from '../../utils/role-utils';
import ConfirmationModal from '../../components/ConfirmationModal';
import { deleteArticleById } from '../../api';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },
  loadingContainer: {
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 35,
    paddingBottom: 35
  },
  headerMetaText: {
    color: theme.palette.background.default,
    fontWeight: 600
  },
  headerMetaWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  bodyContainer: {},
  sectionContainer: {
    maxWidth: '100%',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  detailContainer: {
    padding: 60,
    backgroundColor: theme.palette.background.default
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  description: {
    color: theme.palette.grey.main
  },
  content: {
    maxWidth: '100%',
    width: 900,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  navigationContainer: {
    paddingTop: 20,
    paddingBottom: 20
  },
  createdAt: {
    color: '#626262'
  },
  createdAtSub: {
    color: theme.palette.text.light
  },
  actionIcon: {
    padding: 0,
    paddingBottom: 6,
    color: theme.palette.grey.middle,
    width: 30
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'flex-end'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'flex-end'
    }
  }
});

const ArticleView = ({
  classes,
  user,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [openConfirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const dateFormat = getDateFormatByLocale(language);

  const showButtons = ({ role }) =>
    role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

  const toggleConfirmationModal = () =>
    setConfirmationModal(!openConfirmationModal);

  const confirmDeleteAction = () => {
    setLoading(true);
    deleteArticleById(user, id)
      .then(() => {
        enqueueSnackbar(t('views.support.delete.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push('/support');
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.support.delete.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .finally(() => setLoading(false));
  };

  const canShow = ({ role }, published) =>
    role === ROLES_NAMES.ROLE_ROOT ||
    role === ROLES_NAMES.ROLE_PS_TEAM ||
    published;

  useEffect(() => {
    setLoading(true);
    getArticleById(user, id)
      .then(response => {
        const data = _.get(response, 'data.data.getArticleById', {});
        if (!canShow(user, data.published)) throw new Error();
        setArticle(data);
      })
      .catch(() => {
        enqueueSnackbar(t('views.support.form.userNotAllowed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push(`/support`);
      })
      .finally(() => setLoading(false));
  }, []);

  const collection = article.collection
    ? article.collection.toLowerCase()
    : null;

  const navigationOptions = [
    { label: t('views.support.allCollections'), link: '/support' },
    { label: collection, link: `/collection/${collection}` },
    { label: t('views.support.article'), link: `/article/${id}` }
  ];
  return (
    <div className={classes.mainContainer}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.titleContainer}>
        <Container variant="stretch">
          <div className={classes.content}>
            <div className={classes.headerMetaWrapper}>
              <Typography variant="h6" className={classes.headerMetaText}>
                {t('views.support.metaTitle')}
              </Typography>
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.sectionContainer}>
        <div className={classes.navigationContainer}>
          <NavigationBar options={navigationOptions} />
        </div>

        <div className={classes.detailContainer}>
          <Typography variant="h4" className={classes.label}>
            {article.title}
          </Typography>
          <Typography
            variant="h6"
            className={clsx(classes.label, classes.description)}
          >
            {article.description}
          </Typography>
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid
              item
              lg={9}
              md={9}
              sm={9}
              xs={12}
              container
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Typography variant="subtitle2" className={classes.createdAt}>
                <span className={classes.createdAtSub}>
                  {t('views.support.createdAt')}
                </span>{' '}
                {moment(article.createdAt).format(dateFormat)}
              </Typography>
            </Grid>
            <Grid
              item
              lg={3}
              md={3}
              sm={3}
              xs={12}
              container
              style={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
              }}
            >
              {showButtons(user) && (
                <div className={classes.actionButtons}>
                  <Tooltip title={t('views.support.deleteButton')}>
                    <IconButton
                      color="inherit"
                      onClick={toggleConfirmationModal}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('views.support.editButton')}>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        history.push(`/articles/edit/${id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </Grid>
          </Grid>

          <div className={classes.buttonsContainer}></div>
          <div
            id="content"
            className={classes.defaultContentRich}
            dangerouslySetInnerHTML={{ __html: article.contentRich }}
          ></div>
        </div>
      </div>
      <ConfirmationModal
        title={t('views.support.delete.confirmTitle')}
        subtitle={t('views.support.delete.confirmText')}
        cancelButtonText={t('general.no')}
        continueButtonText={t('general.yes')}
        onClose={toggleConfirmationModal}
        disabledFacilitator={loading}
        open={openConfirmationModal}
        confirmAction={confirmDeleteAction}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(
  connect(mapStateToProps)(withSnackbar(withLayout(ArticleView)))
);
