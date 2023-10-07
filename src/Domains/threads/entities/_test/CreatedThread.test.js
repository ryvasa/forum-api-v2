const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'dicoding',
      owner: {},
    };

    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create createdThread object correctly', () => {
    const payload = {
      id: 'user-123',
      title: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    const createdThread = new CreatedThread(payload);

    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
