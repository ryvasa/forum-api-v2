const DetailComment = require('../DetailComment');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should remap comments data correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
          is_delete: 0,
        },
        {
          id: 'comment-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          is_delete: 1,
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2021-08-08T07:22:33.555Z',
        content: 'this is content',
      },
      {
        id: 'comment-456',
        username: 'user2',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
      },
    ];

    expect(comments).toEqual(expectedComment);
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
        },
        {
          id: 'comment-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    expect(comments).toEqual(payload.comments);
  });

  it('should remap deleted comments correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
          is_delete: 1,
        },
        {
          id: 'comment-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: 'another comment',
          is_delete: 0,
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2021-08-08T07:22:33.555Z',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-456',
        username: 'user2',
        date: '2021-08-08T07:26:21.338Z',
        content: 'another comment',
      },
    ];

    expect(comments).toEqual(expectedComment);
  });
});
