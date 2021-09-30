# pactum-flow-captain-api

Backend security service for pactum flow server.

## Get Started

To get started, install the following softwares

- Node.js
- Docker

### Installation

### Running Server

Run the below command to start the server

```sh
docker compose up -d
```

- Server runs on port `3001`
- Mongo DB runs on port `4001`

Navigate to http://localhost:3001/api/flow/captain/v1/ for accessing swagger page.

### Running Tests

Run the below command to run API component tests.

```
npm run test
```