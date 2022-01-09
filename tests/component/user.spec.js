const pactum = require('pactum');

describe('Create User', () => {

  it('create new user', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1",
        "role": "admin"
      })
      .expectStatus(200);
  });

  it('create new user - password validation failed', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "ad",
        "role": "admin"
      })
      .expectStatus(422)
      .expectJson({
        "message": "password validations failed: The string should have a minimum length of 4 characters,The string should have a minimum of 1 uppercase letter,The string should have a minimum of 1 digit"
      });
  });

  it('create new user without role', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1"
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
      .expectStatus(422);
  });

  it('should fail to create user with non-admin', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{VIEWER_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1",
        "role": "admin"
      })
      .expectStatus(403);
  });

  it('should fail to create user with invalid role', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1",
        "role": "editor"
      })
      .expectStatus(400);
  });

  it('should fail to create user with invalid password', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "welcome",
        "role": "viewer"
      })
      .expectStatus(422);
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
        "password": "Password$1",
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
      .expectJsonLike([
        {
          "username": "admin",
          "email": "admin@localhost",
          "role": "admin",
          "modifiedAt": /\w+/,
          "createdAt": /\w+/
        },
        {
          "username": "viewer",
          "email": "viewer@localhost",
          "role": "viewer",
          "modifiedAt": /\w+/,
          "createdAt": /\w+/
        },
        {
          "username": "scanner",
          "email": "scanner@localhost",
          "role": "scanner",
          "modifiedAt": /\w+/,
          "createdAt": /\w+/
        },
        {
          "username": "user1",
          "email": "",
          "role": "admin",
          "modifiedAt": /\w+/,
          "createdAt": /\w+/
        }
      ]);
  });

});

describe('Update User', () => {

  before(async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1",
        "role": "admin"
      })
      .expectStatus(200);

      await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('user1', 'Password$1')
      .stores('USER_SESSION_TOKEN', 'token')
  });

  after(async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'user1')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200);
  });

  it('update user password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$12"
      })
      .expectStatus(200);
  });

  it('update user role', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "role": "viewer"
      })
      .expectStatus(200);
  });

  it('should fail to update other users password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
      .withJson({
        "username": "viewer",
        "password": "admin"
      })
      .expectStatus(403);
  });

  it('should fail to update non existing users password', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
      .withJson({
        "username": "root",
        "password": "admin"
      })
      .expectStatus(404);
  });

  it('should fail to update non existing users role', async () => {
    await pactum.spec()
      .put('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
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

describe('Delete User', () => {

  before(async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/users')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .withJson({
        "username": "user1",
        "password": "Password$1",
        "role": "admin"
      })
      .expectStatus(200);

      await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('user1', 'Password$1')
      .stores('USER_SESSION_TOKEN', 'token')
  });

  after(async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'user1')
      .withHeaders('x-session-token', '$S{ADMIN_SESSION_TOKEN}')
      .expectStatus(200);
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

  it('should fail to delete own user', async () => {
    await pactum.spec()
      .delete('/api/flow/captain/v1/users/{username}')
      .withPathParams('username', 'user1')
      .withHeaders('x-session-token', '$S{USER_SESSION_TOKEN}')
      .expectStatus(400);
  });

});