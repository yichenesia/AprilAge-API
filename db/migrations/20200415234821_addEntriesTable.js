
exports.up = function(knex, Promise) {
    return knex.raw(`CREATE TABLE \`entries\` 
        (  
            \`id\` INT NOT NULL AUTO_INCREMENT, 
            \`user_id\` INT NOT NULL, 
            \`name\` VARCHAR(255) NULL,
            \`text\` TEXT NULL,
            \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        );
    `);
};

exports.down = function(knex, Promise) {
    return knex.raw(`DROP TABLE \`entries\``);
};
