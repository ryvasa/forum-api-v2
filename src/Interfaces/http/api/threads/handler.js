const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const createThreadUseCase = this._container.getInstance(
      CreateThreadUseCase.name
    );
    const addedThread = await createThreadUseCase.execute({
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThread(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    );
    const useCasePayload = {
      thread: request.params.threadId,
    };
    const { thread } = await getDetailThreadUseCase.execute(useCasePayload);
    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }
}

module.exports = ThreadsHandler;
