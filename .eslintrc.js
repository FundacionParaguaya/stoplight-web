module.exports = {
  extends: ['react-app', 'plugin:import/errors', 'plugin:import/warnings'],
  plugins: ['import'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}
