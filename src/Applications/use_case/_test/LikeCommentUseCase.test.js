const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    const useCasePayload = {
      content: 'Dicoding',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockCreatedComment = new CreatedComment({
      id: useCasePayload.comment,
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      owner: useCasePayload.owner,
    });

    const mockCreatedThread = new CreatedThread({
      id: useCasePayload.thread,
      title: 'Title',
      owner: useCasePayload.owner,
    });
    const mockCreatedLike = {
      id: 'like-123',
      owner: useCasePayload.owner,
      comment: useCasePayload.comment,
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));
    mockLikeRepository.verifyLiked = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.like = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.comment
    );
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      comment: useCasePayload.comment,
      owner: useCasePayload.owner,
    });
    expect(mockLikeRepository.like).toBeCalledWith({
      comment: mockCreatedLike.comment,
      owner: mockCreatedLike.owner,
    });
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    const useCasePayload = {
      content: 'Dicoding',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockCreatedComment = new CreatedComment({
      id: useCasePayload.comment,
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      owner: useCasePayload.owner,
    });

    const mockCreatedThread = new CreatedThread({
      id: useCasePayload.thread,
      title: 'Title',
      owner: useCasePayload.owner,
    });
    const mockCreatedLike = {
      id: 'like-123',
      owner: useCasePayload.owner,
      comment: useCasePayload.comment,
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));
    mockLikeRepository.verifyLiked = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.unlike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.comment
    );
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      comment: useCasePayload.comment,
      owner: useCasePayload.owner,
    });
    expect(mockLikeRepository.unlike).toBeCalledWith({
      comment: mockCreatedLike.comment,
      owner: mockCreatedLike.owner,
    });
  });
});
