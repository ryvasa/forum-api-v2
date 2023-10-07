const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    );
    await likeCommentUseCase.execute({
      thread: request.params.threadId,
      comment: request.params.commentId,
      owner: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
