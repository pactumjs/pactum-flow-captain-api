const pactum = require('pactum');

before(async () => {
  pactum.request.setBaseUrl('http://localhost:3001');
  await setAuthTokens();
});

async function setAuthTokens() {
  await pactum.spec()
    .post('/api/flow/captain/v1/session')
    .withAuth('admin', 'admin')
    .stores('ADMIN_SESSION_TOKEN', 'token');
  await pactum.spec()
    .post('/api/flow/captain/v1/session')
    .withAuth('viewer', 'viewer')
    .stores('VIEWER_SESSION_TOKEN', 'token');
}