const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
    };

    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'abc',
      owner: [1, 2, 3],
    };

    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      body: 'abc',
      owner: 'user-123',
    };

    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.TITLE_LIMIT_CHAR'
    );
  });

  it('should create CreateThread object correctly', () => {
    const payload = {
      title: 'dicoding',
      body: 'abc',
      owner: 'user-123',
    };

    const { title, body, owner } = new CreateThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
