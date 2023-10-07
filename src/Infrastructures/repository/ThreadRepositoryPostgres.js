const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new CreatedThread({ ...result.rows[0] });
  }

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread not found');
    }
    return new CreatedThread({ ...result.rows[0] });
  }

  async getDetailThread(id) {
    const query = {
      text: 'SELECT t.id, title, body, t.created_at as date, username FROM threads AS t LEFT JOIN users AS u ON u.id = t.owner WHERE t.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread not found');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
