const { REACT_APP_BACKEND_PORT: BACKEND_PORT, REACT_APP_BACKEND_HOST: BACKEND_HOST, NODE_ENV } = process.env;


const SERVER_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

export const appEnv = {
  BACKEND_PORT,
  BACKEND_HOST,
  SERVER_URL,
  SERVER_API_URL: `${SERVER_URL}/api`,
  NODE_ENV,
  TOKEN_LABEL: 'authentication_token',
  APP_DATE_FORMAT: 'HH:mm - DD/MM/YY'

};
console.log({appEnv})