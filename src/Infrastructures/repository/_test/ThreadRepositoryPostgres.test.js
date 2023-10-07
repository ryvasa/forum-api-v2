const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123456',
        username: 'Siapa',
      });

      const newThread = new CreateThread({
        title: 'Dicoding',
        body: 'this is body',
        owner: 'user-123456',
      });

      const fakeIdGenerator = () => '123456789abcdef';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const createdThread = await threadRepositoryPostgres.createThread(
        newThread
      );

      const thread = await ThreadsTableTestHelper.findThreadById(
        'thread-123456789abcdef'
      );
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: 'thread-123456789abcdef',
          title: 'Dicoding',
          owner: 'user-123456',
        })
      );
      expect(thread).toHaveLength(1);
    });
  });
  describe('findThreadBtId function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = '123';

      await expect(
        threadRepositoryPostgres.findThreadById(threadId)
      ).rejects.toThrow(NotFoundError);
    });
    it('should return thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123456',
        username: 'Siapa',
      });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        owner: 'user-123456',
        title: 'Title',
        body: 'this is body',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );
      expect(thread).toStrictEqual(
        new CreatedThread({
          id: 'thread-123',
          title: 'Title',
          owner: 'user-123456',
        })
      );
    });
  });
  describe('getDetailThread function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = '123';

      await expect(
        threadRepositoryPostgres.getDetailThread(threadId)
      ).rejects.toThrow(NotFoundError);
    });
    it('should return thread correctly', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const userPayload = { id: 'user-123', username: 'user1' };
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah judul thread',
        body: 'sebuah thread',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);

      const thread = await threadRepositoryPostgres.getDetailThread(
        'thread-123'
      );
      expect(thread.id).toEqual(threadPayload.id);
      expect(thread.title).toEqual(threadPayload.title);
      expect(thread.body).toEqual(threadPayload.body);
      expect(thread.username).toEqual(userPayload.username);
    });
  });
});
