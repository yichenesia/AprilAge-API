
exports.up = function(knex, Promise) {
    return knex.raw(`CREATE TABLE \`agingDocument\` 
    (  
        \`id\` INT NOT NULL AUTO_INCREMENT, 
        \`userID\` INT NOT NULL,
        \`status\` VARCHAR(15),
        \`isSample\` BOOLEAN,
        \`originalImage\` INT,
        \`gender\` VARCHAR(6),
	    \`name\` VARCHAR(255),
	    \`age\` INT, 
        \`ethnicity\` VARCHAR(255),
        \`height\` INT,
        \`weight\` INT , 
        \`measurement\` VARCHAR(10),
        \`bounds\` VARCHAR(40),
        \`created_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`userID\`) REFERENCES users(\`id\`)
            ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (\`originalImage\`) REFERENCES image(\`id\`)
		    ON UPDATE CASCADE ON DELETE CASCADE
    );
`);  
};

exports.down = function(knex, Promise) {
    return knex.raw("DROP TABLE `agingDocument`");
};
