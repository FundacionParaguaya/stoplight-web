import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';
import { Redirect as MockRedirect } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: key => key };
    return Component;
  },
  useTranslation: () => ({ t: key => key, i18n: { language: 'en' } })
}));

jest.mock('notistack', () => ({
  withSnackbar: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: key => key };
    return Component;
  }
}));

jest.mock('react-router-dom', () => {
  return {
    Redirect: jest.fn(() => null)
  };
});

afterEach(() => {
  MockRedirect.mockClear();
  jest.clearAllMocks();
  jest.resetModules();
});
