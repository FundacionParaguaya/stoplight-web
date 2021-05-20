import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'react-sanfona';
import {
  getInterventionDefinition,
  listInterventionsBySnapshot
} from '../../../api';
import iconIntervention from '../../../assets/imgAch.png';
import Container from '../../../components/Container';
import AddInterventionModal from './AddInterventionModal';
import InterventionTitle from './InterventionTitle';
import InterventionDetailsView from './InterventionDetailsView';
import { ROLES_NAMES } from '../../../utils/role-utils';
import InterventionDeleteModal from '../../interventions/InterventionDeleteModal';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem 0'
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem'
  },
  mainIconContainer: {
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
  mainIcon: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  mainDataContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    paddingBottom: '2rem',
    padding: '0 12%'
  },
  basicInfoText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  interventionsTable: {
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '100%',
    mixBlendMode: 'normal'
  },
  addButton: {
    marginTop: '1rem',
    marginBottom: '2rem'
  },
  interventionTitle: {
    padding: '1.5rem 2rem 0.5rem 2rem',
    marginTop: '1rem',
    borderRadius: 10,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));

const FamilyInterventions = ({
  questions,
  snapshotId,
  enqueueSnackbar,
  closeSnackbar,
  readOnly,
  user
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [definition, setDefinition] = useState();
  const [interventions, setIntervetions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState({});
  const [selectedThread, setSelectedThread] = useState('');
  const [parentIntervention, setParentIntervention] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  useEffect(() => {
    setLoading(true);
    getInterventionDefinition(user, 1)
      .then(response => {
        let definition = response.data.data.retrieveInterventionDefinition;
        setDefinition(definition);
      })
      .catch(e => {
        showErrorMessage(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (definition && snapshotId) {
      let params = '';
      definition.questions.forEach(question => {
        params += `${question.codeName} `;
      });

      listInterventionsBySnapshot(user, snapshotId, params)
        .then(response => {
          let data = response.data.data.interventionsBySnapshot;
          let orginalInterventions = [];
          data.forEach(intervention => {
            if (!intervention.intervention) {
              orginalInterventions.push({
                ...intervention,
                relatedInterventions: []
              });
            } else {
              let inter = intervention;
              let ogId = orginalInterventions.findIndex(
                oi => !!oi.intervention && oi.intervention.id === inter.id
              );
              while (ogId < 0) {
                // eslint-disable-next-line no-loop-func
                inter = data.find(int => int.id === inter.intervention.id);
                // eslint-disable-next-line no-loop-func
                ogId = orginalInterventions.findIndex(
                  // eslint-disable-next-line no-loop-func
                  oi =>
                    (inter.intervention && oi.id === inter.intervention.id) ||
                    oi.id === inter.id
                );
                if (!inter) break;
              }
              if (ogId >= 0)
                orginalInterventions[ogId].relatedInterventions.push(
                  intervention
                );
            }
          });
          setIntervetions(orginalInterventions);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
          showErrorMessage(e.message);
        });
    }
  }, [definition, snapshotId]);

  const showAdministrationOptions = ({ role }) =>
    (role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_FAMILY_USER ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN) &&
    !readOnly;

  const showErrorMessage = message =>
    enqueueSnackbar(message, {
      variant: 'error',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  const showSuccessMessage = message =>
    enqueueSnackbar(message, {
      variant: 'success',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  const afterSubmitDelete = () => {
    const newInterventions = Array.from(interventions);
    let index = newInterventions.findIndex(
      i => i.id === selectedIntervention.id
    );
    if (index >= 0) {
      newInterventions.splice(index, 1);
    } else {
      index = newInterventions.findIndex(
        i =>
          selectedIntervention.intervention &&
          i.id === selectedIntervention.intervention.id
      );
      if (index >= 0) {
        let newRelatedInterventions = Array.from(
          newInterventions[index].relatedInterventions
        );
        const rIndex = newRelatedInterventions.findIndex(
          ri => ri.id === selectedIntervention.id
        );
        if (rIndex >= 0) {
          newRelatedInterventions.splice(rIndex, 1);
        }
        newInterventions[index].relatedInterventions = newRelatedInterventions;
      }
    }
    setSelectedIntervention({});
    setIntervetions(newInterventions);
  };

  const onClose = (updateList, intervention) => {
    setOpenForm(!openForm);
    if (updateList) {
      let newInterventions = Array.from(interventions);
      let index = newInterventions.findIndex(i => i.id === intervention.id);
      if (index >= 0) {
        newInterventions[index] = {
          ...intervention,
          relatedInterventions: newInterventions[index].relatedInterventions
        };
      } else {
        index = newInterventions.findIndex(
          i =>
            intervention.intervention && i.id === intervention.intervention.id
        );
        if (index >= 0) {
          let newRelatedInterventions = Array.from(
            newInterventions[index].relatedInterventions
          );
          let rIndex = newRelatedInterventions.findIndex(
            ri => ri.id === intervention.id
          );
          if (rIndex >= 0) {
            newRelatedInterventions[rIndex] = intervention;
          } else {
            newRelatedInterventions.push(intervention);
          }
          newInterventions[
            index
          ].relatedInterventions = newRelatedInterventions;
        } else {
          newInterventions.push({ ...intervention, relatedInterventions: [] });
        }
      }
      setIntervetions(newInterventions);
    }
    setSelectedIntervention({});
  };

  const handleEdit = intervention => {
    setSelectedIntervention(intervention);
    setOpenForm(true);
  };
  const handleDelete = intervention => {
    setSelectedIntervention(intervention);
    setOpenDeleteModal(true);
  };

  const handleAddRelated = interventionId => {
    setParentIntervention(interventionId);
    setOpenForm(true);
  };

  return (
    <React.Fragment>
      <InterventionDeleteModal
        interventionToDelete={selectedIntervention}
        open={openDeleteModal}
        afterSubmit={afterSubmitDelete}
        toggleModal={toggleDeleteModal}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
      />
      <AddInterventionModal
        open={openForm}
        onClose={onClose}
        definition={definition}
        interventionEdit={selectedIntervention}
        indicators={questions}
        snapshotId={snapshotId}
        intervention={parentIntervention}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
        user={user}
      />
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.mainIconContainer}>
          <img
            src={iconIntervention}
            className={classes.mainIcon}
            alt="Family Intervetnions"
          />
        </div>
      </Container>

      <Container
        className={clsx(classes.mainDataContainer, classes.basicInfoText)}
        style={{ padding: readOnly ? '0' : '0 12%' }}
        variant="fluid"
      >
        <Typography variant="h5">
          {t('views.toolbar.interventions')} · {interventions.length}
        </Typography>

        {loading && <CircularProgress className={classes.loadingContainer} />}

        {interventions.length > 0 && (
          <Accordion className={classes.interventionsTable}>
            {interventions.map((intervention, props) => (
              <React.Fragment key={intervention.id}>
                <AccordionItem
                  duration={500}
                  easing={'ease'}
                  key={intervention.id}
                  className={classes.interventionTitle}
                  expanded={selectedIntervention.id === intervention.id}
                  onExpand={() => setSelectedIntervention(intervention)}
                  onClose={() => setSelectedIntervention({})}
                  title={
                    <div>
                      <InterventionTitle
                        props={props}
                        intervention={intervention}
                        setSelectedIntervention={setSelectedIntervention}
                        indicators={questions}
                        expand={selectedIntervention.id === intervention.id}
                        setSelectedThread={id =>
                          id === selectedThread
                            ? setSelectedThread('')
                            : setSelectedThread(id)
                        }
                        handleAddRelated={handleAddRelated}
                      />
                    </div>
                  }
                >
                  <InterventionDetailsView
                    intervention={intervention}
                    definition={definition}
                    showAdministrationOptions={showAdministrationOptions(user)}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                </AccordionItem>
                {Array.isArray(intervention.relatedInterventions) &&
                  selectedThread === intervention.id &&
                  intervention.relatedInterventions.map(related => (
                    <AccordionItem
                      duration={500}
                      easing={'ease'}
                      key={related.id}
                      className={classes.interventionTitle}
                      expanded={selectedIntervention.id === related.id}
                      onExpand={() => setSelectedIntervention(related)}
                      onClose={() => setSelectedIntervention({})}
                      title={
                        <div>
                          <InterventionTitle
                            intervention={related}
                            indicators={questions}
                            setSelectedIntervention={setSelectedIntervention}
                            expand={selectedIntervention.id === related.id}
                            related
                          />
                        </div>
                      }
                    >
                      <InterventionDetailsView
                        intervention={related}
                        definition={definition}
                        showAdministrationOptions={showAdministrationOptions(
                          user
                        )}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                      />
                    </AccordionItem>
                  ))}
              </React.Fragment>
            ))}
          </Accordion>
        )}

        {interventions.length === 0 && !loading && (
          <Container
            className={classes.basicInfoText}
            variant="fluid"
            style={{ margin: '1rem 0' }}
          >
            <Typography variant="h6">
              {t('views.familyProfile.interventions.noInterventions')}
            </Typography>
          </Container>
        )}

        {showAdministrationOptions(user) && !!definition && (
          <Container className={classes.basicInfoText} variant="fluid">
            <Button
              className={classes.addButton}
              color="primary"
              variant="contained"
              onClick={() => {
                setSelectedIntervention({});
                setOpenForm(true);
              }}
            >
              {t('views.intervention.add')}
            </Button>
          </Container>
        )}
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(FamilyInterventions));
