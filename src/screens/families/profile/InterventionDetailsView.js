import { IconButton, Tooltip, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1)
  },
  divider: {
    flexGrow: 0,
    border: `1px solid ${theme.palette.grey.quarter}`,
    width: 1,
    marginLeft: 10,
    marginRight: 10,
    [theme.breakpoints.down('960')]: {
      visibility: 'hidden',
      width: 0,
      marginLeft: 0,
      marginRight: 0
    }
  },
  adminOptionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 'min-content'
  }
}));

const InterventionDetailsView = ({
  intervention,
  definition,
  showAdministrationOptions,
  handleEdit
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container>
      {Array.isArray(definition.questions) &&
        definition.questions
          .filter(q => !q.coreQuestion)
          .map((question, index) => {
            return (
              <Grid
                key={question.codeName}
                item
                md={5}
                sm={6}
                xs={12}
                className={classes.row}
              >
                <div>
                  <Typography variant="subtitle1">
                    {`${question.shortName}: `}
                  </Typography>
                  {Array.isArray(intervention[question.codeName]) && (
                    <ul>
                      {intervention[question.codeName].map((answer, index) => (
                        <Grid key={index}>
                          <Typography variant="subtitle2">
                            <li>{answer}</li>
                          </Typography>
                        </Grid>
                      ))}
                    </ul>
                  )}
                  {!!intervention[question.codeName] && (
                    <Typography variant="subtitle2">
                      {intervention[question.codeName]}
                    </Typography>
                  )}
                </div>
                {index % 2 === 0 && <div className={classes.divider} />}
              </Grid>
            );
          })}
      <Grid item lg={2} md={2} sm={12} xs={12} container justify="flex-end">
        {showAdministrationOptions && (
          <div className={classes.adminOptionsContainer}>
            <Tooltip
              title={t('views.solutions.form.editButton')}
              style={{ marginRight: 10 }}
            >
              <IconButton
                style={{ color: 'black' }}
                component="span"
                onClick={() => handleEdit(intervention)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={t('views.solutions.form.deleteButton')}
              style={{ marginRight: 8 }}
            >
              <IconButton
                style={{ color: 'black' }}
                component="span"
                onClick={() => {}}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default InterventionDetailsView;
