import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    // fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 100,
    marginTop: 0,
    left: 0,
    right: 0
  },
  indicatorSeparator: {
    alignSelf: 'stretch',
    backgroundColor: 'hsl(0,0%,80%)',
    width: 1,
    boxSizing: 'border-box'
  },
  controlInput: {
    marginTop: 10,
    marginBottom: 10
  },
  itemSelected: {
    fontWeight: 500,
    fontSize: 16,
    whiteSpace: 'pre-wrap'
  },
  itemNotSelected: {
    fontWeight: 400,
    fontSize: 16,
    whiteSpace: 'pre-wrap'
  }
});

const StyledMenuItem = withStyles(() => ({
  root: {
    height: 'auto'
  }
}))(props => <MenuItem {...props} />);

let NoOptionsMessage = ({ t, selectProps }) => (
  <StyledMenuItem component="div">
    <Typography className={selectProps.classes.itemNotSelected}>
      {t('general.noOptionsToShow')}
    </Typography>
  </StyledMenuItem>
);

NoOptionsMessage = withTranslation()(NoOptionsMessage);

const LoadingMessage = props => (
  <Typography
    color="default"
    variant="body2"
    className={props.selectProps.classes.noOptionsMessage}
  >
    Loading
  </Typography>
);

function inputComponent({ inputRef, ...props }) {
  return <div style={{ height: 19 }} ref={inputRef} {...props} />;
}

const Control = props => (
  <TextField
    className={props.selectProps.classes.controlInput}
    variant="filled"
    fullWidth
    value={props.hasValue ? props.getValue()[0].label : ''}
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps
      }
    }}
    {...props.selectProps.textFieldProps}
  />
);

const Option = props => {
  console.log(props);

  return (
    <StyledMenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      {...props.innerProps}
    >
      <Typography
        className={clsx('', {
          [props.selectProps.classes.itemSelected]: props.isSelected,
          [props.selectProps.classes.itemNotSelected]: !props.isSelected
        })}
      >
        {props.children}
      </Typography>
    </StyledMenuItem>
  );
};

const Placeholder = props => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const SingleValue = props => (
  <Typography
    className={props.selectProps.classes.singleValue}
    {...props.innerProps}
    noWrap
    style={{ fontSize: 16 }}
  >
    {props.children}
  </Typography>
);

const ValueContainer = props => (
  <div className={props.selectProps.classes.valueContainer}>
    {props.children}
  </div>
);

const MultiValue = props => (
  <Chip
    tabIndex={-1}
    label={props.children}
    className={clsx(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused
    })}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon {...props.removeProps} />}
  />
);

const Menu = props => (
  <Paper
    square
    className={props.selectProps.classes.paper}
    {...props.innerProps}
  >
    {props.children}
  </Paper>
);

const IndicatorSeparator = props => (
  <span className={props.selectProps.classes.indicatorSeparator} />
);

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  LoadingMessage,
  IndicatorSeparator
};

class IntegrationReactSelect extends React.Component {
  render() {
    const {
      classes,
      theme,
      loadOptions,
      components: propsComponents,
      onChange,
      value,
      name,
      async,
      ...remaining
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit'
        }
      })
    };

    return (
      <NoSsr>
        {async && (
          <AsyncSelect
            classes={classes}
            name={name}
            styles={selectStyles}
            loadOptions={this.props.loadOptions}
            defaultOptions
            components={components}
            value={value}
            onChange={onChange}
            placeholder=""
            {...remaining}
          />
        )}
        {!async && (
          <Select
            classes={classes}
            name={name}
            styles={selectStyles}
            components={components}
            value={value}
            onChange={onChange}
            isSearchable={true}
            {...remaining}
          />
        )}
      </NoSsr>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

IntegrationReactSelect.defaultProps = {
  isClearable: true
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
