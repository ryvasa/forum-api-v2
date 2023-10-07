class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, thread } = payload;

    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({ content, owner, thread }) {
    if (!content || !owner || !thread) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof thread !== 'string'
    ) {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
