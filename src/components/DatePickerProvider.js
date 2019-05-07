import React from 'react';
import { withTranslation } from 'react-i18next';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/es';

const DatePickerProvider = ({ i18n: { language }, children }) => {
  moment.locale(language);
  return (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
      locale={language}
      moment={moment}
    >
      {children}
    </MuiPickersUtilsProvider>
  );
};

export default withTranslation()(DatePickerProvider);
