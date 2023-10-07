const CreatedReply = require('../CreatedReply');

describe('CreatedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
    };

    expect(() => new CreatedReply(payload)).toThrowError(
      'CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: { msg: 'none' },
      content: [1, 2, 3],
      owner: 'user-123',
    };

    expect(() => new CreatedReply(payload)).toThrowError(
      'CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CreatedReply entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    };

    const createdReply = new CreatedReply(payload);

    expect(createdReply).toBeInstanceOf(CreatedReply);
    expect(createdReply.content).toEqual(payload.content);
    expect(createdReply.owner).toEqual(payload.owner);
    expect(createdReply.thread).toEqual(payload.thread);
  });
});
