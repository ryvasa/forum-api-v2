const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CreateLike = require('../../../Domains/likes/entities/CreateLike');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createLike function', () => {
    it('should persist new like ', async () => {
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
        content: 'Dicoding',
        thread: 'thread-123',
        owner: 'user-123456',
      });

      const newLike = new CreateLike({
        owner: 'user-123456',
        comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123456789abcdef';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await likeRepositoryPostgres.like(newLike);
      const likes = await LikeTableTestHelper.findLikeByOwnerAndComment(
        'user-123456',
        'comment-123'
      );
      expect(likes).toHaveLength(1);
    });
  });

  describe('verifyLiked function', () => {
    it('should return false if not available', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = { owner: '123', comment: '123' };

      const likedComment = await likeRepositoryPostgres.verifyLiked(payload);

      expect(likedComment).toEqual(false);
    });

    it('should return true if avaible', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = { owner: 'user-123', comment: 'comment-123' };

      await UsersTableTestHelper.addUser({
        id: payload.owner,
        username: 'ryan',
      });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        body: 'this is body',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.createComment({
        id: payload.comment,
        content: 'this is comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      await LikeTableTestHelper.like({
        id: 'like-123',
        ...payload,
      });
      const likedComment = await likeRepositoryPostgres.verifyLiked(payload);

      expect(likedComment).toEqual(true);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      const payload = { owner: 'user-123', comment: 'comment-123' };

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
      await LikeTableTestHelper.like({
        id: 'like-123',
        owner: 'user-123456',
        comment: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.unlike(payload);
      const liked = await LikeTableTestHelper.findLikeByOwnerAndComment(
        payload
      );
      expect(liked).toHaveLength(0);
    });
  });

  describe('getLikeComment function', () => {
    it('should get like of comment', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
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
      const likePayload = {
        id: 'like-123',
        owner: userPayload.id,
        comment: commentPayload.id,
      };

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);
      await CommentsTableTestHelper.createComment(commentPayload);
      await LikeTableTestHelper.like(likePayload);

      const likeCount = await likeRepositoryPostgres.getLikeComment(
        likePayload.comment
      );

      expect(Number.isInteger(likeCount)).toBe(true);
      expect(likeCount).toBeDefined();
      expect(likeCount).toEqual(1);
    });
  });
});
