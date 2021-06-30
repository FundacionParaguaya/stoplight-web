import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../components/TextInput';
import { COLORS } from '../../theme';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.grey,
    margin: theme.spacing(3),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    minHeight: 57,
    borderRadius: 4
  },
  label: {
    marginBottom: theme.spacing(1)
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  optionContainer: {
    marginLeft: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  deleteIcon: {
    height: 'min-content',
    color: 'red',
    opacity: '50%',
    padding: 4,
    marginLeft: 4,
    '&:hover': {
      opacity: '100%'
    }
  },
  addOptionContainer: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  icon: {
    width: 30,
    color: COLORS.MEDIUM_GREY
  },
  checkboxContainer: {
    order: 3,
    display: 'flex',
    alignItems: 'center',
    marginTop: 25
  },
  economicCheckboxesContainer: {
    display: 'initial',
    order: 4,
    marginTop: 0
  },
  greyDot: {
    textDecoration: 'none',
    height: '9px',
    width: '10px',
    backgroundColor: theme.palette.grey.middle,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(1)
  }
}));

export const EditQuestion = ({
  itemRef,
  draggableProps,
  question,
  updateQuestion,
  afterSubmit = () => {}
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { questionText, shortName } = question;

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <Grid container>
        <Grid container spacing={4} className={classes.label}>
          <Grid item md={5} sm={5} xs={10} style={{ order: 1 }}>
            <TextInput
              label={t('views.surveyBuilder.question')}
              value={questionText}
              onChange={e => {
                updateQuestion({ ...question, questionText: e.target.value });
              }}
            />
          </Grid>
          {isEconomic && (
            <Grid item md={5} sm={5} xs={10} style={{ order: 2 }}>
              <TextInput
                label={t('views.surveyBuilder.shortName')}
                value={shortName}
                onChange={e => {
                  updateQuestion({ ...question, shortName: e.target.value });
                }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => afterSubmit()}
        >
          {t('general.done')}
        </Button>
      </div>
    </div>
  );
};

export default EditQuestion;
