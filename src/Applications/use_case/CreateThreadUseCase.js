const CreateThread = require('../../Domains/threads/entities/CreateThread');

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createThread = new CreateThread(useCasePayload);
    return this._threadRepository.createThread(createThread);
  }
}

module.exports = CreateThreadUseCase;
