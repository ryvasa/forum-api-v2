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

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 400 when request payload not contain needed property', async () => {
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
          title: 'Tile',
          body: 'this is body',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: {
          content: 'this is coment',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(reply.payload);
      expect(reply.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Cannot create a new reply because the required property is missing'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
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
          title: 'Tile',
          body: 'this is body',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: {
          content: 'this is comment',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: {
          content: 123,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(reply.payload);
      expect(reply.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Content must be a string');
    });

    it('should response 401 when request not contain token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'this is content',
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should response 201 and persisted reply', async () => {
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
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: {
          content: 'this is reply',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(reply.payload);
      expect(reply.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when request not contain token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        payload: {},
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should response 403 where owner and login user not match', async () => {
      const server = await createServer(container);

      const requestUserPayload = [
        {
          username: 'user1',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
        {
          username: 'user2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      ];
      const user1Response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload[0],
      });
      const user2Response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestUserPayload[1],
      });

      const login1Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: user1Response.result.data.addedUser.username,
          password: requestUserPayload[0].password,
        },
      });
      const login2Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: user2Response.result.data.addedUser.username,
          password: requestUserPayload[1].password,
        },
      });
      const token1 = login1Response.result.data.accessToken;
      const token2 = login2Response.result.data.accessToken;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
        },
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: {
          content: 'This is comment',
        },
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: {
          content: 'This is reply',
        },
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });
      const deletedReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });

      const responseJson = JSON.parse(deletedReply.payload);
      expect(deletedReply.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'You cannot delete other people reply.'
      );
    });
    it('should response 200 and is_delete to true comment', async () => {
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
          content: 'This is comment',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: {
          content: 'This is reply',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const deletedReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(deletedReply.payload);
      expect(deletedReply.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
