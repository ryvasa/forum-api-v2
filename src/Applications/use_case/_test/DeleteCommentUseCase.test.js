const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if wromg type ', async () => {
    const useCasePayload = {
      thread: 1,
      comment: 1,
      owner: 1,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Title',
      owner: 'user-123',
    });

    const mockCreatedComment = new CreatedComment({
      id: 'commnt-123',
      content: 'this is comment',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));

    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith(
      useCasePayload.comment
    );
    expect(mockCommentRepository.verifyComment).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
  });
});
