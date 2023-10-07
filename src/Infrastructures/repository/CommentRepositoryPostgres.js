/* eslint-disable object-curly-newline */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, thread, owner',
      values: [id, content, thread, owner],
    };

    const result = await this._pool.query(query);
    return new CreatedComment({ ...result.rows[0] });
  }

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Comment not found');
    }
  }

  async verifyComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You cannot delete other people comment.');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsThread({ thread }) {
    const query = {
      text: 'SELECT c.id, u.username, c.created_at as date, c.content, c.is_delete FROM comments AS c LEFT JOIN users AS u ON u.id = c.owner WHERE thread = $1 ORDER BY c.created_at ASC',

      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
