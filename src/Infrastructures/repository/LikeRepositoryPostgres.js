const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async like({ owner, comment }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, owner, comment],
    };

    await this._pool.query(query);
  }

  async verifyLiked({ owner, comment }) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment = $2',
      values: [owner, comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async unlike({ owner, comment }) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment = $2',
      values: [owner, comment],
    };

    await this._pool.query(query);
  }

  async getLikeComment(comment) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE comment = $1',
      values: [comment],
    };

    const { rows } = await this._pool.query(query);

    return Number(rows[0].count);
  }
}

module.exports = LikeRepositoryPostgres;
