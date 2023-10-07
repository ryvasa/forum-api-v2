const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
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
      const newComment = new CreateComment({
        content: 'Dicoding',
        thread: 'thread-123',
        owner: 'user-123456',
      });

      const fakeIdGenerator = () => '123456789abcdef';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const createdThread = await commentRepositoryPostgres.createComment(
        newComment
      );

      const thread = await CommentsTableTestHelper.findCommentById(
        'comment-123456789abcdef'
      );
      expect(createdThread).toStrictEqual(
        new CreatedComment({
          id: 'comment-123456789abcdef',
          content: 'Dicoding',
          owner: 'user-123456',
        })
      );
      expect(thread).toHaveLength(1);
    });
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError if not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = '123';

      await expect(
        commentRepositoryPostgres.findCommentById(comment)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

      await expect(
        commentRepositoryPostgres.findCommentById('comment-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyComment function', () => {
    it('should throw AuthorizationError if not belong to owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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
      const comment = 'comment-123';
      const owner = 'user-1234';

      await expect(
        commentRepositoryPostgres.verifyComment(comment, owner)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if comment is belongs to owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

      await expect(
        commentRepositoryPostgres.verifyComment('comment-12389', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
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
      await CommentTableTestHelper.createComment({
        id: 'comment-123',
        content: 'this is content',
        thread: 'thread-123',
        owner: 'user-123456',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment('comment-123');
      const comment = await CommentTableTestHelper.checkDeletedCommentsById(
        'comment-123'
      );
      expect(comment).toEqual(true);
    });
  });

  describe('getCommentsThread function', () => {
    it('should get comments of thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);
      await CommentsTableTestHelper.createComment(commentPayload);

      const comments = await commentRepositoryPostgres.getCommentsThread({
        thread: threadPayload.id,
      });

      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual(commentPayload.id);
      expect(comments[0].username).toEqual(userPayload.username);
      expect(comments[0].content).toEqual('this is content');
      expect(comments[0].date).toBeDefined();
    });
  });
});
