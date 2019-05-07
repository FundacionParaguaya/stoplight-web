import * as _ from 'lodash';

const getErrorLabelForPath = (path, touched, errors, t) =>
  _.get(touched, path) && _.get(errors, path) && t(_.get(errors, path));
const pathHasError = (path, touched, errors) =>
  !!(_.get(touched, path) && _.get(errors, path));

export { getErrorLabelForPath, pathHasError };
