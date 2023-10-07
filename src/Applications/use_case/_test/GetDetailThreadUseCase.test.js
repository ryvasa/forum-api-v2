/* eslint-disable arrow-body-style */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Title',
      owner: 'user-123',
    });
    const mockCreatedComments = [
      {
        id: 'comment-123',
        username: 'ryvasa',
        date: '2021-08-08 14.00',
        content: 'this is comment',
        is_delete: 0,
      },
      {
        id: 'comment-456',
        username: 'ryvasa',
        date: '2021-08-08 14.00',
        content: 'deleted comment',
        is_delete: 1,
      },
    ];
    const mockCreatedReplies = [
      {
        id: 'reply-123',
        comment: 'comment-123',
        username: 'ryvasa',
        date: '2021-08-08 14.00',
        content: 'this is reply',
        is_delete: 0,
      },
      {
        id: 'reply-456',
        comment: 'comment-123',
        username: 'ryvasa',
        date: '2021-08-08 14.00',
        content: 'deleted comment',
        is_delete: 1,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.findThreadById = jest.fn(() =>
      Promise.resolve(mockCreatedThread)
    );

    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'Title',
        body: 'this is body',
        date: '2021-08-08 14.00',
        username: 'user1',
      })
    );
    mockCommentRepository.getCommentsThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComments));
    mockReplyRepository.getReplyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReplies));

    mockLikeRepository.getLikeComment = jest.fn(() => {
      return Promise.resolve(1);
    });

    const detailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.findThreadById).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(
      useCasePayload
    );
    expect(mockReplyRepository.getReplyThread).toHaveBeenCalledWith(
      useCasePayload
    );
    expect(mockLikeRepository.getLikeComment).toHaveBeenCalledWith(
      mockCreatedComments[0].id
    );
    expect(mockLikeRepository.getLikeComment).toHaveBeenCalledWith(
      mockCreatedComments[1].id
    );
    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-123',
        title: 'Title',
        body: 'this is body',
        date: '2021-08-08 14.00',
        username: 'user1',
        comments: [
          {
            id: 'comment-123',
            username: 'ryvasa',
            date: '2021-08-08 14.00',
            content: 'this is comment',
            likeCount: 1,
            replies: [
              {
                id: 'reply-123',
                username: 'ryvasa',
                date: '2021-08-08 14.00',
                content: 'this is reply',
              },
              {
                id: 'reply-456',
                username: 'ryvasa',
                date: '2021-08-08 14.00',
                content: '**balasan telah dihapus**',
              },
            ],
          },
          {
            id: 'comment-456',
            username: 'ryvasa',
            date: '2021-08-08 14.00',
            likeCount: 1,
            content: '**komentar telah dihapus**',
            replies: [],
          },
        ],
      },
    });
  });
});
