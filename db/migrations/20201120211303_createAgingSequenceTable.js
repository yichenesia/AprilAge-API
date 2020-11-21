
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE \`agingSequence\` 
    (  
        \`id\` INT NOT NULL AUTO_INCREMENT, 
        \`smoking\` INT DEFAULT 0.0,
	    \`sunExposure\` INT DEFAULT 0.0,
        \`bmi\` INT,
        \`bmifunc\` VARCHAR(8) DEFAULT "linear",
        \`multiplier\` INT DEFAULT 1.0,
        \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CHECK (\`bmifunc\` = "linear" OR \`bmifunc\` = "constant")
    );
`); 
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE `agingSequence`");
};
