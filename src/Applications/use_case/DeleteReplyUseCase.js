/* eslint-disable object-curly-newline */
class DeleteReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._threadRepository.findThreadById(useCasePayload.thread);
    await this._commentRepository.findCommentById(useCasePayload.comment);
    await this._replyRepository.findReplyById(useCasePayload.reply);
    await this._replyRepository.verifyReply(
      useCasePayload.reply,
      useCasePayload.owner
    );
    return this._replyRepository.deleteReply(useCasePayload.reply);
  }

  _validatePayload(payload) {
    const { thread, comment, owner, reply } = payload;

    if (!thread || !comment || !owner || !reply) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (
      typeof thread !== 'string' ||
      typeof comment !== 'string' ||
      typeof owner !== 'string' ||
      typeof reply !== 'string'
    ) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteReplyUseCase;
