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

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when request not contain token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/{threadId}/comments/{commentId}/likes',
        payload: {},
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
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
      const like = await server.inject({
        method: 'PUT',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/likes`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(like.payload);
      expect(like.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
