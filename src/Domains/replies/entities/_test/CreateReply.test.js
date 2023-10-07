const CreateReply = require('../CreateReply');

describe('CreateReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
    };

    expect(() => new CreateReply(payload)).toThrowError(
      'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: [1, 2, 3],
      owner: 'user-123',
      thread: { msg: 'none' },
      comment: 123,
    };

    expect(() => new CreateReply(payload)).toThrowError(
      'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CreateReply entities correctly', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const createReply = new CreateReply(payload);

    expect(createReply).toBeInstanceOf(CreateReply);
    expect(createReply.content).toEqual(payload.content);
    expect(createReply.owner).toEqual(payload.owner);
    expect(createReply.thread).toEqual(payload.thread);
    expect(createReply.comment).toEqual(payload.comment);
  });
});
