import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getProjectsByOrganization } from '../../api';
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
  projectData,
  organizationData,
  stacked,
  noDropdownArrow,
  renderIfOptions
}) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [projectsOptions, setProjectsOptions] = useState([]);
  const label = `${t('views.projectFilter.label')}${isMulti ? 's' : ''}`;

  useEffect(() => {
    setLoading(true);

    const orgId =
      (isMulti &&
        !!organizationData &&
        organizationData.length > 0 &&
        organizationData.map(o => o.value)) ||
      (!isMulti && !!organizationData && [organizationData.value]) ||
      (!!user.organization && !!user.organization.id && [user.organization.id]);

    getProjectsByOrganization(user, orgId ? orgId : [])
      .then(response => {
        const projects = _.get(
          response,
          'data.data.projectsByOrganization',
          []
        ).map(project => ({
          label: project.title,
          value: project.id
        }));
        setProjectsOptions(projects);
      })
      .finally(() => setLoading(false));
  }, [user, organizationData]);

  const allProjectsOption = {
    label: t('views.projectFilter.allProjects'),
    value: 'ALL'
  };
  let projectsToShow = [];
  if (isMulti) {
    projectsToShow =
      projectsOptions.length !== projectData.length &&
      projectsOptions.length > 1
        ? [allProjectsOption, ...projectsOptions]
        : [...projectsOptions];
    if (projectData.some(d => d.value === 'ALL')) {
      projectsToShow = [];
    }
  } else {
    projectsToShow = [...projectsOptions];
  }

  const conditionalComponents = noDropdownArrow
    ? {
        DropdownIndicator: () => <div />,
        IndicatorSeparator: () => <div />
      }
    : null;

  return (
    <div className={stacked ? classes.stackedContainer : classes.container}>
      {((renderIfOptions && projectsToShow.length) || !renderIfOptions) && (
        <>
          <Typography
            variant="subtitle1"
            className={stacked ? classes.stackedLabel : classes.label}
          >
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
              components={conditionalComponents}
              isMulti={isMulti}
            />
          </div>
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  label: {
    marginBottom: 5,
    marginRight: 10,
    fontSize: 14
  },
  selector: {
    width: '100%'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  stackedContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  stackedLabel: {
    marginBottom: 5,
    fontSize: 14
  }
}));

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(ProjectsSelector);
