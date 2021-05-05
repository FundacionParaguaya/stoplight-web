import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import {
  getInterventionDefinition,
  listInterventionsQuestions,
  addOrUpdadteInterventionDefinition
} from '../../api';
import interventionBanner from '../../assets/reports_banner.png';
import Container from '../../components/Container';
import ExitModal from '../../components/ExitModal';
import InputWithFormik from '../../components/InputWithFormik';
import QuestionItem from '../../components/QuestionItem';
import OrganizationSelector from '../../components/selectors/OrganizationSelector';
import withLayout from '../../components/withLayout';
import { COLORS } from '../../theme';
import { move, reorder } from '../../utils/array-utils';
import InterventionQuestion from './InterventionQuestion';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default
  },
  dragContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2)
  },
  loadingContainer: {
    zIndex: 100,
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
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175,
    marginBottom: '2rem'
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  interventionImage: {
    display: 'block',
    height: 175,
    right: 0,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  alert: {
    '& .MuiAlert-message': {
      marginLeft: theme.spacing(1),
      fontSize: 15
    }
  },
  nameField: {
    marginBottom: 10,
    marginTop: 10,
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  },
  itemList: {
    backgroundColor: COLORS.LIGHT_GREY,
    border: '2px',
    width: '30vw',
    marginBottom: theme.spacing(1)
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '16px 0'
  }
}));

const InterventionForm = ({
  enqueueSnackbar,
  closeSnackbar,
  user,
  history
}) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  let { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(true);
  const [coreQuestions, setCoreQuestions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [retrivedDefinition, setRetrivedDefinition] = useState();

  const getList = id => (id === 'droppable' ? items : selectedItems);

  const fieldIsRequired = 'validation.fieldIsRequired';

  //Validation criterias
  const validationSchema = Yup.object({
    name: Yup.string().required(fieldIsRequired)
  });

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

  useEffect(() => {
    listInterventionsQuestions(user, language)
      .then(response => {
        let questions = response.data.data.interventionPresetQuestions;
        let mainQuestions = questions.filter(q => q.coreQuestion);
        let itemQuestions = questions.filter(q => !q.coreQuestion);
        itemQuestions = itemQuestions.map(question => {
          return {
            ...question,
            options: [{ value: 'value', text: '' }]
          };
        });

        if (!!id) {
          getInterventionDefinition(user, id)
            .then(response => {
              const definition =
                response.data.data.retrieveInterventionDefinition;
              setRetrivedDefinition(definition);
              let newItems = Array.from(itemQuestions);
              const questions = definition.questions.filter(
                q => !q.coreQuestion
              );
              questions.forEach(q => {
                let index = newItems.findIndex(
                  item => q.codeName === item.codeName
                );
                newItems.splice(index, 1);
                if (hasOptions(q.answerType)) {
                  const otherOptionIndex = q.options.findIndex(
                    o => o.otherOption
                  );
                  if (otherOptionIndex >= 0) {
                    q.options.splice(otherOptionIndex, 1);
                    q.otherOption = true;
                  }
                }
              });
              setItems(newItems);
              setSelectedItems(questions);
            })
            .catch(e => showErrorMessage(e.message));
        } else {
          setItems(itemQuestions);
        }
        setCoreQuestions(mainQuestions);
        setLoading(false);
      })
      .catch(e => {
        showErrorMessage(e.message);
        setLoading(false);
      });
  }, []);

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === 'droppable2') {
        setSelectedItems(items);
      } else {
        setItems(items);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(result.droppable);
      setSelectedItems(result.droppable2);
    }
  };

  const updateQuestion = (index, question) => {
    let newSelectedItems = Array.from(selectedItems);
    newSelectedItems[index] = question;
    setSelectedItems(newSelectedItems);
  };

  const hasOptions = answerType =>
    answerType === 'select' ||
    answerType === 'radio' ||
    answerType === 'checkbox';

  const onSave = values => {
    setLoading(true);
    let questions = Array.from(selectedItems);
    questions = questions.map(q => {
      let question = JSON.parse(JSON.stringify(q));
      if (question.otherOption) {
        question.options.push({ value: '', text: 'Other', otherOption: true });
      }
      delete question.otherOption;
      if (hasOptions(question.answerType)) {
        question.options = question.options.filter(o => !!o.text);
      } else {
        delete question.options;
      }

      return question;
    });
    const hasErrors = questions.some(
      question =>
        hasOptions(questions.answerType) && question.options.length === 0
    );

    let orgs = values.organizations.map(o => o.value);
    let finalQuestions = [...coreQuestions, ...questions].map((q, index) => {
      q.orderNumber = index + 1;
      q.required = !!q.required;
      return q;
    });
    let interventionDefinition = {
      id: values.id,
      title: values.name,
      description: values.name,
      active: true,
      questions: finalQuestions
    };

    hasErrors &&
      showErrorMessage(t('views.intervention.definition.validationError'));

    !hasErrors &&
      addOrUpdadteInterventionDefinition(user, interventionDefinition, orgs)
        .then(() => {
          showSuccessMessage(t('views.intervention.definition.save.success'));
          setLoading(false);
          history.push(`/interventions`);
        })
        .catch(e => {
          showErrorMessage(t('views.intervention.definition.save.error'));
          setLoading(false);
        });
  };

  return (
    <Container variant="stretch" className={classes.mainContainer}>
      <ExitModal
        open={openExitModal}
        onDissmiss={() => setOpenExitModal(false)}
        onClose={() => history.push(`/interventions`)}
      />
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <Typography variant="h4">
            {t('views.intervention.definition.title')}
          </Typography>
          <Typography variant="h6" style={{ color: 'grey' }}>
            {t('views.intervention.definition.subtitle')}
          </Typography>
        </div>
        <img
          src={interventionBanner}
          alt="Intervention Banner"
          className={classes.interventionImage}
        />
      </div>

      {isEdit && (
        <Alert severity="warning" className={classes.alert}>
          {t('views.intervention.definition.warning')}
        </Alert>
      )}

      <Formik
        initialValues={{
          id: (!!retrivedDefinition && retrivedDefinition.id) || null,
          name: (!!retrivedDefinition && retrivedDefinition.title) || '',
          organizations:
            (!!retrivedDefinition && retrivedDefinition.organizations) || []
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={values => {
          onSave(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form noValidate autoComplete={'off'}>
            {loading && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
            <InputWithFormik
              label={t('views.intervention.definition.name')}
              name="name"
              required
              className={classes.nameField}
            />

            <Typography variant="h5">
              {t('views.intervention.definition.coreQuestions')}
            </Typography>

            {coreQuestions.map(question => (
              <QuestionItem
                key={question.codeName}
                question={question.shortName}
                answerType={question.answerType}
              />
            ))}

            <Typography variant="h5" style={{ margin: '16px 0' }}>
              {t('views.intervention.definition.questionsTitle')}
            </Typography>
            <div className={classes.dragContainer}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.itemList}
                    >
                      {items.map((item, index) => (
                        <Draggable
                          key={item.codeName}
                          draggableId={item.codeName}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <QuestionItem
                              itemRef={provided.innerRef}
                              draggableProps={{
                                ...provided.draggableProps,
                                ...provided.dragHandleProps
                              }}
                              question={item.shortName}
                              answerType={item.answerType}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.itemList}
                    >
                      {selectedItems.map((selectedItem, index) => (
                        <Draggable
                          key={selectedItem.codeName}
                          draggableId={selectedItem.codeName}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <InterventionQuestion
                              itemRef={provided.innerRef}
                              draggableProps={{
                                ...provided.draggableProps,
                                ...provided.dragHandleProps
                              }}
                              question={selectedItem}
                              updateQuestion={question =>
                                updateQuestion(index, question)
                              }
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {!isEdit && (
              <OrganizationSelector
                title="Choose Organizations"
                data={values.organizations}
                onChange={value => {
                  setFieldValue('organizations', value);
                }}
                isMulti
                isClearable
                maxMenuHeight="120"
              />
            )}
            <div className={classes.buttonContainerForm}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenExitModal(true)}
                disabled={loading}
              >
                {t('general.cancel')}
              </Button>

              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {t('general.save')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  connect(mapStateToProps)(withLayout(withSnackbar(InterventionForm)))
);
