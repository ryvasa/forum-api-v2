const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.findThreadById(useCasePayload.thread);
    const createComment = new CreateComment(useCasePayload);
    return this._commentRepository.createComment(createComment);
  }
}

module.exports = CreateCommentUseCase;
