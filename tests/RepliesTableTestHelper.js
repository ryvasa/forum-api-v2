/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async createReply({
    id = 'reply-123',
    content = 'dicoding',
    thread = 'thread-321',
    owner = 'user-123',
    comment = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, thread, owner, comment],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkDeletedRepliesById(id) {
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    const isDeleted = result.rows[0].is_delete;
    return isDeleted;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
