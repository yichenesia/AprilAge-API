
exports.up = function(knex, Promise) {
    return knex.raw(`CREATE TABLE \`agingSequence\` 
    (  
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`age\` INT NOT NULL CHECK (age >= 0),
        \`smoking\` FLOAT CHECK (smoking >= 0.0 AND smoking <=1.0) DEFAULT 0.0,
	    \`sunExposure\` FLOAT CHECK (sunExposure >= 0.0 AND sunExposure <=1.0) DEFAULT 0.0,
        \`bmi\` FLOAT CHECK (bmi >= 16.0 AND bmi<=39.0),
        \`bmifunc\` VARCHAR(8) CHECK (bmifunc = 'linear' OR bmifunc = 'constant') DEFAULT 'linear',
        \`multiplier\` FLOAT CHECK (multiplier>= 0.0 AND multiplier <= 1.5) DEFAULT 1.0,
        \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CHECK (\`bmifunc\` = "linear" OR \`bmifunc\` = "constant")
    );
`); 
};

exports.down = function(knex, Promise) {
    return knex.raw("DROP TABLE `agingSequence`");
};
