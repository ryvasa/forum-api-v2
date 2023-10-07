const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      replies: {},
    };

    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create DetailReply object correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
        },
        {
          id: 'reply-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: '**balasan telah dihapus**',
        },
      ],
    };

    const { replies } = new DetailReply(payload);

    expect(replies).toEqual(payload.replies);
  });
  it('should remap reply data correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
          is_delete: 0,
        },
        {
          id: 'reply-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: '**balasan telah dihapus**',
          is_delete: 1,
        },
      ],
    };

    const { replies } = new DetailReply(payload);

    const expectedReply = [
      {
        id: 'reply-123',
        username: 'user1',
        date: '2021-08-08T07:22:33.555Z',
        content: 'this is content',
      },
      {
        id: 'reply-456',
        username: 'user2',
        date: '2021-08-08T07:26:21.338Z',
        content: '**balasan telah dihapus**',
      },
    ];

    expect(replies).toEqual(expectedReply);
  });

  it('should remap deleted replies correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123',
          username: 'user1',
          date: '2021-08-08T07:22:33.555Z',
          content: 'this is content',
          is_delete: 1,
        },
        {
          id: 'reply-456',
          username: 'user2',
          date: '2021-08-08T07:26:21.338Z',
          content: 'another comment',
          is_delete: 0,
        },
      ],
    };

    const { replies } = new DetailReply(payload);

    const expectedReply = [
      {
        id: 'reply-123',
        username: 'user1',
        date: '2021-08-08T07:22:33.555Z',
        content: '**balasan telah dihapus**',
      },
      {
        id: 'reply-456',
        username: 'user2',
        date: '2021-08-08T07:26:21.338Z',
        content: 'another comment',
      },
    ];

    expect(replies).toEqual(expectedReply);
  });
});
