const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateCommentUseCase = require('../CreateCommentUseCase');

describe('CreateCommentUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    const useCasePayload = {
      content: 'Dicoding',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      owner: useCasePayload.owner,
    });

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Title',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    mockCommentRepository.createComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    const getCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdThread = await getCommentUseCase.execute(useCasePayload);

    expect(createdThread).toStrictEqual(
      new CreatedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.createComment).toBeCalledWith(
      new CreateComment({
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      })
    );
  });
});
