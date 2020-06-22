import React, { useState, useReducer, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, CircularProgress, IconButton } from '@material-ui/core/';
import { withTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withLayout from '../components/withLayout';
import reportBanner from '../assets/reports_banner.png';
import Container from '../components/Container';
import BottomSpacer from '../components/BottomSpacer';
import ReportsFilter from './reports/ReportsFilters';
import AdvancedReportsFilters from './reports/AdvancedReportFilters';
import { Accordion, AccordionItem } from 'react-sanfona';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { searchRecords, downloadReports, downloadSemaforito } from '../api';
import ReportsTable from './reports/ReportsTable';
import { ROLES_NAMES } from '../utils/role-utils';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 40,
    paddingRight: 40
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 230
  },
  reportTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2,
    paddingTop: 100
  },
  reportImage: {
    display: 'block',
    height: 240,
    right: 10,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  filtersConatiner: {
    opacity: 1,
    backgroundColor: '#f3f4f687',
    padding: 20,
    width: 400
  },
  mainBody: {
    display: 'flex',
    backgroundColor: theme.palette.background.default
  },
  advancedContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    height: 40,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
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
    textAlign: 'center'
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    width: '20%'
  },
  buttonContainerForm: {
    display: 'flex',
    marginTop: 20,
    justifyContent: 'space-evenly'
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
  }
});

const Reports = ({ classes, t, user, enqueueSnackbar, closeSnackbar }) => {
  const [filterInput, setFilterInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      hub: {},
      organizations: [],
      survey: {},
      fromDate: null,
      toDate: null,
      includeRetake: false,
      // Advanced filters
      facilitators: [],
      indicator: [],
      colors: []
    }
  );

  const tableRef = useRef();
  const [hideColumns, setHideColumns] = useState(true);
  const [resetPagination, setResetPagination] = useState();
  const [totalRows, setTotalRow] = useState(0);
  const [totalFamilies, setTotalFamilies] = useState(0);
  const [allowSearch, setAllowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ display: false, touched: false });

  useEffect(() => {
    setAllowSearch(!!filterInput.survey && !!filterInput.survey.value);
    setError({
      display: !filterInput.survey || !filterInput.survey.value,
      touched: error.touched
    });
  }, [filterInput.survey]);

  const filtersPreProcessing = filters => {
    //Pre-processing filters values
    let hubs = !!filters.hub && !!filters.hub.value ? [filters.hub] : [];
    hubs = hubs.map(h => h.value);
    const orgs = filters.organizations.map(o => o.value);
    const stoplightFilters = filters.colors.map(c => {
      let values = [];
      c.values.green && values.push('3');
      c.values.yellow && values.push('2');
      c.values.red && values.push('1');
      return {
        codeName: c.codename,
        values
      };
    });

    const survey = !!filters.survey ? filters.survey : {};
    const surveyUsers = filters.facilitators.map(f => f.value);

    return {
      ...filters,
      survey,
      hubs,
      orgs,
      surveyUsers,
      stoplightFilters
    };
  };

  const loadFamilies = query => {
    let page = query ? query.page : 0;

    if (resetPagination) {
      page = 0;
      setResetPagination(false);
    }

    if (allowSearch) {
      const orderDirection = query ? query.orderDirection : '';
      const sortBy = query && query.orderBy ? query.orderBy.field : '';

      const sanitazedFilters = filtersPreProcessing(filterInput);

      return searchRecords(user, {
        ...sanitazedFilters,
        page,
        sortBy,
        orderDirection
      })
        .then(response => {
          setTotalRow(response.data.data.searchSnapshots.totalElements);
          const totalFamilies = !!response.data.data.searchSnapshots
            .additionalData
            ? response.data.data.searchSnapshots.additionalData.distinctFamilies
            : 0;
          setTotalFamilies(totalFamilies);
          setHideColumns(false);
          return {
            data: response.data.data.searchSnapshots.content,
            page: page,
            totalCount: response.data.data.searchSnapshots.totalElements
          };
        })
        .catch(e => {
          console.log(e);
          enqueueSnackbar(t('views.report.buttons.somethingWrong'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        });
    } else {
      return Promise.all([]).then(() => {
        setTotalRow(0);
        setTotalFamilies(0);
        setHideColumns(true);
        return {
          data: [],
          page: 0,
          totalCount: 0
        };
      });
    }
  };

  const showSemaforitoButton = ({ role }, totalRows) =>
    (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM) &&
    totalRows === 0;

  const handleDownloadReport = user => {
    setLoading(true);
    enqueueSnackbar(t('views.report.buttons.pleaseWait'), {
      variant: 'success',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });
    const sanitazedFilters = filtersPreProcessing(filterInput);
    downloadReports(user, sanitazedFilters)
      .then(response => {
        let blob = new Blob([response.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        let url = window.URL.createObjectURL(blob);
        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', 'Surveys.xlsx');
        tempLink.click();
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.report.buttons.somethingWrong'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  const handleDownloadSemaforito = user => {
    setLoading(true);
    enqueueSnackbar(t('views.report.buttons.pleaseWait'), {
      variant: 'success',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });
    const sanitazedFilters = filtersPreProcessing(filterInput);
    downloadSemaforito(user, sanitazedFilters)
      .then(response => {
        let blob = new Blob([response.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        let url = window.URL.createObjectURL(blob);
        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', 'Surveys-Semaforito.xlsx');
        tempLink.click();
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.report.buttons.somethingWrong'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  const onChangeFilterValue = filter => {
    setResetPagination(true);
    setFilterInput(filter);
  };

  return (
    <div className={classes.mainContainer}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.titleContainer}>
        <div className={classes.reportTitle}>
          <Typography variant="h4">{t('views.toolbar.reports')}</Typography>
        </div>
        <img src={reportBanner} alt="Reports" className={classes.reportImage} />
      </div>
      <div className={classes.mainBody}>
        <div className={classes.filtersConatiner}>
          <ReportsFilter
            hubData={filterInput.hub}
            organizationsData={filterInput.organizations}
            surveyData={filterInput.survey}
            from={filterInput.fromDate}
            to={filterInput.toDate}
            includeRetake={filterInput.includeRetake}
            onChangeHub={hub =>
              onChangeFilterValue({ hub, organizations: [], survey: {} })
            }
            onChangeOrganization={organizations =>
              onChangeFilterValue({ organizations, survey: {} })
            }
            onChangeSurvey={survey => onChangeFilterValue({ survey })}
            onFromDateChanged={fromDate => onChangeFilterValue({ fromDate })}
            onToDateChanged={toDate => onChangeFilterValue({ toDate })}
            toggleIncludeRetake={() =>
              onChangeFilterValue({ includeRetake: !filterInput.includeRetake })
            }
            error={error}
          />
          <Accordion>
            <AccordionItem
              title={
                <div className={classes.advancedContainer}>
                  <Typography
                    className={classes.advancedLabel}
                    variant="subtitle1"
                  >
                    {t('views.report.filters.advancedOptions')}
                  </Typography>
                  <ExpandMore className={classes.expandIcon} />
                </div>
              }
            >
              <AdvancedReportsFilters
                facilitatorsData={filterInput.facilitators}
                survey={filterInput.survey}
                indicator={filterInput.indicator}
                colorsData={filterInput.colors}
                onChangeFacilitator={facilitators => {
                  onChangeFilterValue({ facilitators });
                }}
                onChangeIndicator={indicator => {
                  onChangeFilterValue({ indicator });
                }}
                onChangeColors={colors => onChangeFilterValue({ colors })}
              />
            </AccordionItem>
          </Accordion>
          <Container variant="fluid" className={classes.buttonContainerForm}>
            <Button
              variant="outlined"
              onClick={() => {
                setAllowSearch(false);
                setFilterInput({
                  hub: {},
                  organizations: [],
                  survey: null,
                  fromDate: null,
                  toDate: null,
                  includeRetake: false,
                  facilitators: [],
                  indicator: [],
                  colors: []
                });
              }}
            >
              {t('views.report.buttons.resetFilters')}
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setError({ display: error.display, touched: true });
                tableRef.current.onQueryChange();
              }}
            >
              {t('views.report.buttons.applyFilters')}
            </Button>
          </Container>
          <Container
            variant="fluid"
            className={classes.buttonContainerForm}
            style={{ marginTop: 90 }}
          >
            {showSemaforitoButton(user, totalRows) ? (
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => {
                  handleDownloadSemaforito(user);
                }}
              >
                {t('views.report.buttons.downloadSemaforito')}
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => {
                  handleDownloadReport(user);
                }}
              >
                {t('views.report.buttons.downloadReport')}
              </Button>
            )}
          </Container>
        </div>
        <div style={{ width: 'calc((100% - 400px))' }}>
          <ReportsTable
            tableRef={tableRef}
            loadFamilies={loadFamilies}
            numberOfRows={totalRows}
            allowSearch={allowSearch}
            totalFamilies={totalFamilies}
            hideColumns={hideColumns}
          />
        </div>
      </div>

      <BottomSpacer />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(
      withTranslation()(withSnackbar(withLayout(Reports)))
    )
  )
);
