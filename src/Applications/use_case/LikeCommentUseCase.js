const CreateLike = require('../../Domains/likes/entities/CreateLike');

class LikeCommentUseCase {
  constructor({ commentRepository, threadRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.findThreadById(useCasePayload.thread);
    await this._commentRepository.findCommentById(useCasePayload.comment);
    const createLike = new CreateLike(useCasePayload);
    const likedComment = await this._likeRepository.verifyLiked(createLike);
    if (likedComment) {
      await this._likeRepository.unlike(createLike);
    } else {
      await this._likeRepository.like(createLike);
    }
  }
}

module.exports = LikeCommentUseCase;
