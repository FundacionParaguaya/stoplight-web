import React from 'react';
import { withTranslation } from 'react-i18next';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const removePeriod = str => str.replace('.', '');
moment.updateLocale('es', {
  months: [...moment.months().map(month => capitalize(month))],
  monthsShort: [
    ...moment.monthsShort().map(month => removePeriod(capitalize(month)))
  ],
  weekdaysShort: [
    ...moment.weekdaysShort().map(day => removePeriod(capitalize(day)))
  ],
  weekdaysMin: [...moment.weekdaysMin().map(day => capitalize(day))]
});
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
