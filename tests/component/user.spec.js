const pactum = require('pactum');

describe('Update User', () => {

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

describe('Create User', () => {

  it('create new user', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "password",
        "role": "admin"
      })
      .expectStatus(200);
  });

  it('create new user without role', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "password"
      })
      .expectStatus(200);
    await pactum.spec()
      .get('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200)
      .expectJsonLike([
        {
          "username": "user1",
          "role": "viewer"
        }
      ]);
  });

  it('create new user without role and password', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1"
      })
      .expectStatus(200);
    await pactum.spec()
      .get('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200)
      .expectJsonLike([
        {
          "username": "user1",
          "role": "viewer"
        }
      ]);
  });

  it('should fail to create user with non-admin', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{VIEWER_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "password",
        "role": "admin"
      })
      .expectStatus(403);
  });

  afterEach(async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'user1')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200);
  })

});

describe('Fetch User', () => {

  before(async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "password",
        "role": "admin"
      })
      .expectStatus(200);
  });

  after(async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'user1')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200);
  });

  it('get all users', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200)
      .expectJson([
        {
          "username": "admin",
          "role": "admin"
        },
        {
          "username": "viewer",
          "role": "viewer"
        },
        {
          "username": "scanner",
          "role": "scanner"
        },
        {
          "username": "user1",
          "role": "admin"
        }
      ]);
  });

});

describe('Delete User', () => {

  it('should fail to delete own user', async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'admin')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(400);
  });

  it('should fail to delete a user with non-admin', async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'admin')
      .withHeaders('x-session-token', '$S{VIEWER_SESSION_TOKEN}')
      .expectStatus(403);
  });

  // TODO - fail for non-existing users
  it('should not fail to delete non existing user', async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'root')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200);
  });

});