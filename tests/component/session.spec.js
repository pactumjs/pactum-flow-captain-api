const pactum = require('pactum');

describe('Create Session', () => {

  it('create session for admin ', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('admin', 'admin')
      .expectStatus(200)
      .expectJsonLike({
        "username": "admin",
        "sessionToken": /\w+/
      });
  });

  it('create session for viewer ', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('viewer', 'viewer')
      .expectStatus(200)
      .expectJsonLike({
        "username": "viewer",
        "sessionToken": /\w+/
      });
  });

  it('create session for valid user and invalid password', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('viewer', 'abc')
      .expectStatus(401)
      .expectJsonLike({
        "message": "Invalid Authentication Credentials"
      });
  });

  it('create session for invalid user', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('abc', 'viewer')
      .expectStatus(401)
      .expectJsonLike({
        "message": "Invalid Authentication Credentials"
      });
  });

});