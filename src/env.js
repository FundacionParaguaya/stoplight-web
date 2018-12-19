// const prod = {
//   api: 'https://platform.backend.povertystoplight.org',
//   oauth: 'https://platform.backend.povertystoplight.org/oauth'
// }
//
// const test = {
//   api: 'https://testing.backend.povertystoplight.org',
//   oauth: 'https://testing.backend.povertystoplight.org/oauth'
// }
//
// const config = process.env.NODE_ENV === 'production' ? prod : test
//
// export default {
//   token: 'YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=',
//   ...config
// }

const prod = {
  api: 'https://platform.backend.povertystoplight.org',
  oauth: 'https://platform.backend.povertystoplight.org/oauth',
  token: 'YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=',
  name: 'prod'
}

const demo = {
  api: 'https://demo.backend.povertystoplight.org',
  oauth: 'https://demo.backend.povertystoplight.org/oauth',
  token: 'YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=',
  name: 'demo'
}

const test = {
  api: 'https://testing.backend.povertystoplight.org',
  oauth: 'https://testing.backend.povertystoplight.org/oauth',
  token: 'YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=',
  name: 'test'
}

export { prod, demo, test }

export default { prod, demo, test }
