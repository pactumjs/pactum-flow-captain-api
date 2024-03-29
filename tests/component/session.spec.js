const pactum = require('pactum');

describe('Create Session', () => {

  it('create session for admin', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('admin', 'admin')
      .expectStatus(200)
      .expectJsonLike({
        "username": "admin",
        "token": /\w+/
      });
  });

  it('create session for viewer', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('viewer', 'viewer')
      .expectStatus(200)
      .expectJsonLike({
        "username": "viewer",
        "token": /\w+/
      });
  });

  it('create session for scanner', async () => {
    await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('scanner', 'scanner')
      .expectStatus(200)
      .expectJsonLike({
        "username": "scanner",
        "token": /\w+/
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

describe('Read Session', () => {

  let admin_token;
  let viewer_token;

  before(async () => {
    admin_token = await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('admin', 'admin')
      .returns('token');
    
    viewer_token = await pactum.spec()
      .post('/api/flow/captain/v1/session')
      .withAuth('viewer', 'viewer')
      .returns('token');  
  });

  it('get admin session', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/session')
      .withHeaders('x-session-token', admin_token)
      .expectStatus(200)
      .expectJsonLike({
        "__v": 0,
        "email": "admin@localhost",
        "modifiedAt": /\w+/,
        "username": "admin",
        "role": "admin"
      });
  });

  it('get viewer session', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/session')
      .withHeaders('x-session-token', viewer_token)
      .expectStatus(200)
      .expectJsonLike({
        "__v": 0,
        "email": "viewer@localhost",
        "modifiedAt": /\w+/,
        "username": "viewer",
        "role": "viewer"
      });
  });

  it('get session with invalid token', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/session')
      .withHeaders('x-session-token', 'viewer_token')
      .expectStatus(403);
  });

  it('get session with empty token', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/session')
      .withHeaders('x-session-token', '')
      .expectStatus(403);
  });

  it('get session without token', async () => {
    await pactum.spec()
      .get('/api/flow/captain/v1/session')
      .expectStatus(403);
  });

});