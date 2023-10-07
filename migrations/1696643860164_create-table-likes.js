exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    comment: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
