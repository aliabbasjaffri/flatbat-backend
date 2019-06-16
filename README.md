# Flatbat Backend

## Prerequisites

- This project is compatible with node `v12.4.0` and npm `6.9.0`.
- This project uses mongodb instance as database.
- For ease of setup, please launch mongodb instance via docker-compose.
- This project is compatible with docker version 18.09.2 and docker-compose version 1.23.2.

## Installation

- Run `npm run build` to create the dist folder.
- To resolve lint errors, run `npm run lint-fix`.
- Run `docker-compose up` to launch mongodb instance.
- For development environment, run `npm run devstart`, otherwise run `npm run start`.
- The application is served at `http://localhost:3000`.