const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if wromg type ', async () => {
    const useCasePayload = {
      thread: 1,
      comment: [1],
      reply: {},
      owner: 1,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
      reply: 'reply-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: 'this is reply',
      owner: 'user-123',
    });

    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: 'this is comment',
      owner: 'user-123',
    });

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Title',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));
    mockReplyRepository.findReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));
    mockReplyRepository.verifyReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith(
      useCasePayload.comment
    );
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith(
      useCasePayload.reply
    );
    expect(mockReplyRepository.verifyReply).toHaveBeenCalledWith(
      useCasePayload.reply,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
      useCasePayload.reply
    );
  });
});
