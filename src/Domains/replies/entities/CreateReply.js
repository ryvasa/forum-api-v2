/* eslint-disable object-curly-newline */
class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, thread, comment } = payload;

    this.content = content;
    this.thread = thread;
    this.owner = owner;
    this.comment = comment;
  }

  _verifyPayload({ content, owner, thread, comment }) {
    if (!content || !owner || !thread || !comment) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof thread !== 'string' ||
      typeof comment !== 'string'
    ) {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReply;
