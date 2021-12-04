const pactum = require('pactum');

describe('Update User', () => {

  before(async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('admin', 'admin')
      .stores('ADMIN_SESSION_TOKEN', 'token');
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('viewer', 'viewer')
      .stores('VIEWER_SESSION_TOKEN', 'token');
  });

  it('update user password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "admin",
        "password": "admin"
      })
      .expectStatus(200);
  });

  it('update user role', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "admin",
        "role": "admin"
      })
      .expectStatus(200);
  });

  it('should fail to update other users password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "viewer",
        "password": "admin"
      })
      .expectStatus(403);
  });

  it('should fail to update non existing users password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "root",
        "password": "admin"
      })
      .expectStatus(404);
  });

  it('should fail to update non existing users role', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "root",
        "role": "admin"
      })
      .expectStatus(404);
  });

  it('should fail to update users role by a non-admin user', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{VIEWER_SESSION_TOKEN}')
      .withJson({
        "username": "viewer",
        "role": "admin"
      })
      .expectStatus(403);
  });

});