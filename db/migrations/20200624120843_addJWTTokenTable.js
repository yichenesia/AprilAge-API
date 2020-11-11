exports.up = function(knex, Promise) {
  return knex.raw(`CREATE TABLE \`jwt_tokens\` 
      (  
          \`user_id\` INT NOT NULL,
          \`refresh_token\` TEXT NULL DEFAULT NULL,
          \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`user_id\`)
      );
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw("DROP TABLE `jwt_tokens`");
};
