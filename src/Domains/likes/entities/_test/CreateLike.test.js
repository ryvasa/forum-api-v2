const CreateLike = require('../CreateLike');

describe('CreateLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      owner: 'user-123',
    };

    expect(() => new CreateLike(payload)).toThrowError(
      'CREATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      comment: { msg: 'none' },
      owner: 'user-123',
    };

    expect(() => new CreateLike(payload)).toThrowError(
      'CREATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CreateLike entities correctly', () => {
    const payload = {
      comment: 'comment-123',
      owner: 'user-123',
    };

    const createLike = new CreateLike(payload);

    expect(createLike).toBeInstanceOf(CreateLike);
    expect(createLike.owner).toEqual(payload.owner);
    expect(createLike.comment).toEqual(payload.comment);
  });
});
