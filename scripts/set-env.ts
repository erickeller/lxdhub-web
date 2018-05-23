import { writeFile } from 'fs';
import { argv } from 'yargs';

require('dotenv').config();

const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;

const API_URL = process.env.API_URL;
const API_URL_DEFAULT = 'http://localhost:3000';

const LOGGING_URL = process.env.LOGGING_URL;
const LOGGING_URL_DEFAULT = `${API_URL || API_URL_DEFAULT}/api/v1/log`;

// Warn user if no environment variables are set
if (!LOGGING_URL) {
    console
        .warn(`Environment variable LOGGING_URL was not set. Taking default ${LOGGING_URL_DEFAULT} instead`);
}

if (!API_URL) {
    console
        .warn(`Environment variable API_URL was not set. Taking default ${API_URL_DEFAULT} instead`);
}

// Generate environment.ts file
const envConfigFile = `
export const environment = {
  production: ${isProd},
  apiUrl: '${API_URL || API_URL_DEFAULT}',
  loggingUrl: '${LOGGING_URL || LOGGING_URL_DEFAULT}'
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`Output generated at ${targetPath}`);
});
