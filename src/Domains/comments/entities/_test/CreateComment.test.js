const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
    };

    expect(() => new CreateComment(payload)).toThrowError(
      'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: [1, 2, 3],
      owner: 'user-123',
      thread: { msg: 'none' },
    };

    expect(() => new CreateComment(payload)).toThrowError(
      'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CreateComment entities correctly', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
      thread: 'thread-123',
    };

    const createComment = new CreateComment(payload);

    expect(createComment).toBeInstanceOf(CreateComment);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.owner).toEqual(payload.owner);
    expect(createComment.thread).toEqual(payload.thread);
  });
});
