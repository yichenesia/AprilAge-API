
exports.up = function(knex, Promise) {
    return knex.raw(`CREATE TABLE \`agingResult\` 
    (  
        \`id\` INT NOT NULL AUTO_INCREMENT, 
        \`sequenceType\` VARCHAR(5) CHECK (sequenceType = 'Max72' OR sequenceType = 'Rel40') NOT NULL,
	    \`sequenceID\` INT,
	    \`agingDocument\` INT,
        \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`sequenceID\`) REFERENCES agingSequence(\`id\`)
            ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (\`agingDocument\`) REFERENCES agingDocument(\`id\`)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CHECK (\`sequenceType\` = "Max72" OR \`sequenceType\` = "Rel40")
    );
`); 
};

exports.down = function(knex, Promise) {
    return knex.raw("DROP TABLE `agingResult`");
};
