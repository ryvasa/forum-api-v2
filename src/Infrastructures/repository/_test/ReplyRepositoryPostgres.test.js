const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123456',
        username: 'User1',
      });
      await ThreadTableTestHelper.createThread({
        id: 'thread-123',
        body: 'this is content',
        owner: 'user-123456',
        title: 'Title',
      });
      await CommentsTableTestHelper.createComment({
        id: 'comment-123',
        content: 'Dicoding',
        thread: 'thread-123',
        owner: 'user-123456',
      });
      const newReply = new CreateReply({
        content: 'Dicoding',
        thread: 'thread-123',
        owner: 'user-123456',
        comment: 'comment-123',
      });
      const fakeIdGenerator = () => '123456789abcdef';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const createdReply = await replyRepositoryPostgres.createReply(newReply);

      const reply = await ReplyTableTestHelper.findReplyById(
        'reply-123456789abcdef'
      );
      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: 'reply-123456789abcdef',
          content: 'Dicoding',
          owner: 'user-123456',
        })
      );
      expect(reply).toHaveLength(1);
    });
  });

  describe('findReplyById function', () => {
    it('should throw NotFoundError if not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = '123';

      await expect(
        replyRepositoryPostgres.findReplyById(reply)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ryan',
      });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        body: 'this is body',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.createComment({
        id: 'comment-123',
        content: 'this is comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      await ReplyTableTestHelper.createReply({
        id: 'reply-123',
        content: 'this is comment',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      await expect(
        replyRepositoryPostgres.findReplyById('reply-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReply function', () => {
    it('should throw AuthorizationError if not belong to owner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user1',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-1234',
        username: 'user2',
      });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        body: 'this is body',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.createComment({
        id: 'comment-123',
        content: 'this is comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      await ReplyTableTestHelper.createReply({
        id: 'reply-123',
        comment: 'comment-123',
        content: 'this is comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const reply = 'reply-123';
      const owner = 'user-1234';

      await expect(
        replyRepositoryPostgres.verifyReply(reply, owner)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if reply is belongs to owner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user46',
      });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-1238',
        body: 'this is body',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.createComment({
        id: 'comment-12389',
        content: 'this is comment',
        thread: 'thread-1238',
        owner: 'user-123',
      });
      await ReplyTableTestHelper.createReply({
        id: 'reply-123',
        comment: 'comment-12389',
        content: 'this is comment',
        thread: 'thread-1238',
        owner: 'user-123',
      });

      await expect(
        replyRepositoryPostgres.verifyReply('reply-123', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deletereply function', () => {
    it('should delete reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123456',
        username: 'Siapa',
      });
      await ThreadTableTestHelper.createThread({
        id: 'thread-123',
        body: 'this is content',
        owner: 'user-123456',
        title: 'Title',
      });
      await CommentsTableTestHelper.createComment({
        id: 'comment-123',
        content: 'this is content',
        thread: 'thread-123',
        owner: 'user-123456',
      });

      await ReplyTableTestHelper.createReply({
        id: 'reply-123',
        comment: 'comment-123',
        content: 'this is content',
        thread: 'thread-123',
        owner: 'user-123456',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-123');
      const reply = await ReplyTableTestHelper.checkDeletedRepliesById(
        'reply-123'
      );
      expect(reply).toEqual(true);
    });
  });

  describe('getCommentsThread function', () => {
    it('should get comments of thread', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const userPayload = { id: 'user-123', username: 'ryos' };
      const threadPayload = {
        id: 'thread-123',
        title: 'Title',
        body: 'this is body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        content: 'this is content',
        thread: threadPayload.id,
        owner: userPayload.id,
      };

      const replyPayload = {
        id: 'reply-123',
        comment: commentPayload.id,
        content: 'this is content',
        thread: threadPayload.id,
        owner: userPayload.id,
      };

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);
      await CommentsTableTestHelper.createComment(commentPayload);
      await ReplyTableTestHelper.createReply(replyPayload);

      const replies = await replyRepositoryPostgres.getReplyThread({
        thread: threadPayload.id,
      });

      expect(Array.isArray(replies)).toBe(true);
      expect(replies[0].id).toEqual(replyPayload.id);
      expect(replies[0].username).toEqual(userPayload.username);
      expect(replies[0].content).toEqual('this is content');
      expect(replies[0].date).toBeDefined();
    });
  });
});
