const CreateReplyUseCase = require('../../../../Applications/use_case/CreateReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const createReplyUseCase = this._container.getInstance(
      CreateReplyUseCase.name
    );
    const addedReply = await createReplyUseCase.execute({
      content: request.payload.content,
      thread: request.params.threadId,
      comment: request.params.commentId,
      owner: request.auth.credentials.id,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute({
      comment: request.params.commentId,
      thread: request.params.threadId,
      reply: request.params.replyId,
      owner: request.auth.credentials.id,
    });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
