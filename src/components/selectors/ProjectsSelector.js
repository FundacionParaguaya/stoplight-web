import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getProjectsPaginated } from '../../api';
import * as _ from 'lodash';
import Select from 'react-select';
import { selectStyle } from '../../utils/styles-utils';

const ProjectsSelector = ({
  user,
  isMulti,
  withTitle,
  isClearable,
  onChangeProject,
  onBlur,
  projectData
}) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [projectsOptions, setProjectsOptions] = useState([]);
  const label = `${t('views.projectFilter.label')}`;

  useEffect(() => {
    setLoading(true);
    getProjectsPaginated(user, { page: 0 })
      .then(response => {
        const projects = _.get(
          response,
          'data.data.searchProjects.content',
          []
        ).map(project => ({
          label: project.title,
          value: project.id
        }));
        setProjectsOptions(projects);
      })
      .finally(() => setLoading(false));
  }, [user]);
  const allProjectsOption = {
    label: t('views.projectFilter.allProjects'),
    value: 'ALL'
  };
  let projectsToShow =
    projectsOptions.length !== projectData.length && projectsOptions.length > 1
      ? [allProjectsOption, ...projectsOptions]
      : [...projectsOptions];
  if (projectData.some(d => d.value === 'ALL')) {
    projectsToShow = [];
  }

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {label}
      </Typography>
      <div className={classes.selector}>
        <Select
          value={projectData}
          onChange={value => onChangeProject(value, projectsOptions)}
          onBlur={onBlur}
          placeholder={withTitle ? '' : label}
          isLoading={loading}
          loadingMessage={() => t('views.projectFilter.loading')}
          noOptionsMessage={() => t('views.projectFilter.noOption')}
          options={projectsToShow}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={isClearable}
          hideSelectedOptions
          isMulti={isMulti}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start'
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
}));

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(ProjectsSelector);
