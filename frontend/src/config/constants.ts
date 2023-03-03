const { REACT_APP_BACKEND_PORT: BACKEND_PORT, REACT_APP_BACKEND_HOST: BACKEND_HOST, NODE_ENV } = process.env;

export const appEnv = {
  BACKEND_PORT,
  BACKEND_HOST,
  SERVER_API_URL: `http://${BACKEND_HOST}:${BACKEND_PORT}/api`,
  NODE_ENV
};
console.log({appEnv})