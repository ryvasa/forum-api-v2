class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._threadRepository.findThreadById(useCasePayload.thread);
    await this._commentRepository.findCommentById(useCasePayload.comment);
    await this._commentRepository.verifyComment(
      useCasePayload.comment,
      useCasePayload.owner
    );
    return this._commentRepository.deleteComment(useCasePayload.comment);
  }

  _validatePayload(payload) {
    const { thread, comment, owner } = payload;

    if (!thread || !comment || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (
      typeof thread !== 'string' ||
      typeof comment !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
