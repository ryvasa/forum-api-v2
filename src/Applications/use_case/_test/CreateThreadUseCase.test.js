const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateThreadUseCase = require('../CreateThreadUseCase');

describe('CreateThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    const useCasePayload = {
      title: 'Dicoding',
      body: 'this is body',
      owner: 'user-123',
    };

    const mosckCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.createThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mosckCreatedThread));

    const getThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await getThreadUseCase.execute(useCasePayload);

    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });
});
