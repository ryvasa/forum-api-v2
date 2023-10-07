const CreateReply = require('../../Domains/replies/entities/CreateReply');

class CreateReplyUseCase {
  constructor({
    commentRepository,
    threadRepository,
    replyRepository,
    authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    await this._threadRepository.findThreadById(useCasePayload.thread);
    await this._commentRepository.findCommentById(useCasePayload.comment);
    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.createReply(createReply);
  }
}

module.exports = CreateReplyUseCase;
