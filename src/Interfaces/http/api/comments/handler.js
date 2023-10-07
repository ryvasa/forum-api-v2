const CreateCommentUseCase = require('../../../../Applications/use_case/CreateCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
  }

  async postCommentHandler(request, h) {
    const createCommentUseCase = this._container.getInstance(
      CreateCommentUseCase.name
    );
    const addedComment = await createCommentUseCase.execute({
      content: request.payload.content,
      thread: request.params.threadId,
      owner: request.auth.credentials.id,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute({
      comment: request.params.commentId,
      thread: request.params.threadId,
      owner: request.auth.credentials.id,
    });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
