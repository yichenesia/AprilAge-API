exports.up = function(knex, Promise) {
  return knex.raw(`CREATE TABLE \`users\` 
      (  
          \`id\` INT NOT NULL AUTO_INCREMENT, 
          \`role\` VARCHAR(25) NULL,
          \`email\` VARCHAR(255) NOT NULL UNIQUE,
          \`first_name\` VARCHAR(255) NULL,
          \`last_name\` VARCHAR(255) NULL,
          \`salt\` VARCHAR(255) NULL,
          \`hashed_password\` VARCHAR(255) NULL,
          \`reset_key\` VARCHAR(255) NULL,
          \`last_user_activity\` DATETIME NULL,
          \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          INDEX \`role\` (\`role\` ASC)
      );
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw("DROP TABLE `users`");
};
