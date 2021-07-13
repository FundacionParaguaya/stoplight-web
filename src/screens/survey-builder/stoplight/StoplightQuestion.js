import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS, theme } from '../../../theme';
import imagePlaceholder from '../../../assets/grey_isologo.png';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    margin: '1rem',
    padding: '1rem',
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.background.grey
    }
  },
  container: {
    minHeight: 60,
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    width: 20,
    marginRight: theme.spacing(1)
  },
  radio: {
    '& $span': {
      color: `${theme.palette.grey.middle} !important`
    }
  },
  button: {
    width: 'fit-content',
    padding: '0 16px',
    backgroundColor: COLORS.MEDIUM_GREY,
    marginRight: 2,
    marginLeft: 2,
    marginBottom: 6
  }
}));

const StoplightQuestion = ({
  itemRef,
  draggableProps,
  order,
  question,
  setSelectedQuestion = () => {},
  setSurveyQuestion = () => {},
  handleDelete
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [hovering, setHovering] = useState(false);

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.mainContainer}
      onMouseEnter={() => {
        setSurveyQuestion();
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={classes.container}>
        <Typography variant="h6" style={{ margin: '0 1rem 1rem 0' }}>
          {`${order}. ${question.questionText} ${question.required ? '*' : ''}`}
        </Typography>
        <div style={{ minWidth: 100 }}>
          {hovering && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => setSelectedQuestion(question.codeName)}
            >
              <Edit className={classes.icon} /> {t('general.edit')}
            </Button>
          )}

          {hovering && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => handleDelete()}
            >
              {t('general.delete')}
            </Button>
          )}
        </div>
      </div>
      <Grid container spacing={4}>
        {question.stoplightColors.map(color => (
          <ColorPreview
            key={color.value}
            url={color.url}
            value={color.value}
            description={color.description}
          />
        ))}
      </Grid>
    </div>
  );
};

export default StoplightQuestion;

const colorPreviewStyle = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  color: {
    padding: theme.spacing(0.5),
    width: 125,
    height: 25,
    textAlign: 'center',
    fontWeight: 400,
    borderRadius: '4px 4px 0 0'
  },
  img: {
    minHeight: 125,
    height: 125,
    minWidth: 125,
    width: 125,
    borderRadius: '0 0 4px 4px'
  },
  description: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: '1px solid #E0E0E0',
    wordBreak: 'break-word',
    height: '100%'
  }
}));

const labels = {
  '1': 'RED',
  '2': 'YELLOW',
  '3': 'GREEN'
};

const ColorPreview = ({ url, value, description }) => {
  const classes = colorPreviewStyle();
  const { t } = useTranslation();

  const colorLabel = labels[value];

  return (
    <Grid item md={4} className={classes.container}>
      <Typography
        variant="subtitle1"
        className={classes.color}
        style={{
          backgroundColor: COLORS[colorLabel],
          color:
            value === 2
              ? theme.palette.text.primary
              : theme.palette.text.secondary
        }}
      >
        {t(`views.surveyBuilder.stoplight.${colorLabel}`)}
      </Typography>
      <img
        alt={value}
        src={url ? url : imagePlaceholder}
        className={classes.img}
      />
      {description && (
        <Typography variant="subtitle1" className={classes.description}>
          {description}
        </Typography>
      )}
    </Grid>
  );
};
