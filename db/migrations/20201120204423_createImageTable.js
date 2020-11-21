
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE \`image\` 
        (  
            \`id\` INT NOT NULL AUTO_INCREMENT, 
            \`uri\` VARCHAR(255) NOT NULL,
            \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        );
    `);  
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE `image`");
};
