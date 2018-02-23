let protocol = 'http';
let apiDomain = '';
let appDomain = '';
export const ENV = process.env.NODE_ENV;
export const { TOTAL_VERSION } = process.env;

switch (ENV) {
  case 'development':
    protocol = 'http';
    apiDomain = `${protocol}://localhost:3000`;
    appDomain = `${protocol}://localhost:5000`;
    break;
  case 'production':
    protocol = 'https';
    apiDomain = `${protocol}://api.ghost-go.com`;
    appDomain = `${protocol}://www.ghost-go.com`;
    break;
  default:
}

export const AUTH0_CONFIG = {
  oidcConformant: true,
  allowShowPassword: true,
  usernameStyle: 'email',
  defaultDatabaseConnection: 'acme',
  prefill: {
    email: 'johnfoo@gmail.com',
  },
  theme: {
    primaryColor: 'black',
    logo: `${protocol}://s3-ap-northeast-1.amazonaws.com/ghost-go/logo2x.png`,
  },
};

export const API_VERSION = 'v1';
const PROTOCOL = protocol;
const API_DOMAIN = apiDomain;
const APP_DOMAIN = appDomain;
export { PROTOCOL, API_DOMAIN, APP_DOMAIN };
