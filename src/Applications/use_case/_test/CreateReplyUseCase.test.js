const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateReplyUseCase = require('../CreateReplyUseCase');

describe('CreateReplyUseCase', () => {
  it('should orchestrating the create reply action correctly', async () => {
    const useCasePayload = {
      content: 'Dicoding',
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Title',
      owner: 'user-123',
    });
    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: 'this is comment',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.findThreadById = jest.fn(() =>
      Promise.resolve(mockCreatedThread)
    );
    mockCommentRepository.findCommentById = jest.fn(() =>
      Promise.resolve(mockCreatedComment)
    );
    mockReplyRepository.createReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    const createReplyUseCase = new CreateReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
    });

    const createdReply = await createReplyUseCase.execute(useCasePayload);

    expect(createdReply).toStrictEqual(
      new CreatedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.comment
    );
    expect(mockReplyRepository.createReply).toBeCalledWith(
      new CreateReply({
        comment: useCasePayload.comment,
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      })
    );
  });
});
