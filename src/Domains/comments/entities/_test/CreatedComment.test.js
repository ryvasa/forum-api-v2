const CreatedComment = require('../CreatedComment');

describe('CreatedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'this is content',
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError(
      'CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: { msg: 'none' },
      content: [1, 2, 3],
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError(
      'CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CreatedComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    };

    const createdComment = new CreatedComment(payload);

    expect(createdComment).toBeInstanceOf(CreatedComment);
    expect(createdComment.content).toEqual(payload.content);
    expect(createdComment.owner).toEqual(payload.owner);
    expect(createdComment.thread).toEqual(payload.thread);
  });
});
