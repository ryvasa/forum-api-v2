/* eslint-disable object-curly-newline */

const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(replyComment) {
    const { content, thread, owner, comment } = replyComment;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, thread, owner, comment',
      values: [id, content, thread, owner, comment],
    };

    const result = await this._pool.query(query);
    return new CreatedReply({ ...result.rows[0] });
  }

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply not found');
    }
  }

  async verifyReply(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You cannot delete other people reply.');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getReplyThread({ thread }) {
    const query = {
      text: 'SELECT r.id, u.username, r.created_at as date, r.content, r.is_delete, r.comment FROM replies AS r LEFT JOIN users AS u ON u.id = r.owner WHERE thread = $1 ORDER BY r.created_at ASC',

      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
