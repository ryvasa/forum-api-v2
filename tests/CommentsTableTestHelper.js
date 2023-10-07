/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async createComment({
    id = 'comment-123',
    content = 'dicoding',
    thread = 'thread-321',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, thread, owner],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkDeletedCommentsById(id) {
    const query = {
      text: 'SELECT is_delete FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const isDeleted = result.rows[0].is_delete;
    return isDeleted;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
