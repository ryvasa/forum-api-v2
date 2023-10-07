const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };

      const server = await createServer(container);

      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userResponse.result.data.addedUser.username,
          password: requestUserPayload.password,
        },
      });

      const token = loginResponse.result.data.accessToken;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'Dicoding Indonesia',
      };
      const server = await createServer(container);

      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userResponse.result.data.addedUser.username,
          password: requestUserPayload.password,
        },
      });

      const token = loginResponse.result.data.accessToken;
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Cannot create a new thread because the required property is missing'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 123,
        body: true,
      };
      const server = await createServer(container);

      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userResponse.result.data.addedUser.username,
          password: requestUserPayload.password,
        },
      });

      const token = loginResponse.result.data.accessToken;
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Title and body must be strings');
    });

    it('should response 400 when title more than 50 character', async () => {
      const requestPayload = {
        title:
          'smkahdgywqurhiehfjndnfjhauhfyutysayifwnkdjwoiquoyruqytuqirwjpoiqjdkakjdkayufiuequ',
        body: 'this is body',
      };
      const server = await createServer(container);

      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userResponse.result.data.addedUser.username,
          password: requestUserPayload.password,
        },
      });

      const token = loginResponse.result.data.accessToken;
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Cannot create a new thread because the title character exceeds the limit'
      );
    });

    it('should response 401 when request not contain token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when request not avaible threads', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/123',
        payload: {},
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
    });
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);

      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userResponse.result.data.addedUser.username,
          password: requestUserPayload.password,
        },
      });

      const token = loginResponse.result.data.accessToken;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: {
          content: 'This is content',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(comment.payload);
      expect(comment.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
    it('should response 200 and return detail thread', async () => {
      const loginPayload = {
        username: 'user1',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'Unknown User1',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'this is body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadResponse.data.addedThread.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(
        threadResponse.data.addedThread.id
      );
      expect(responseJson.data.thread.title).toEqual('Title');
      expect(responseJson.data.thread.body).toEqual('this is body');
      expect(responseJson.data.thread.username).toEqual('user1');
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
    });
  });
});
