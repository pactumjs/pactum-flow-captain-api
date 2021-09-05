const { request } = require('pactum');

before(() => {
  request.setBaseUrl('http://localhost:3001');
});