
exports.up = function(knex, Promise) {
    return knex.raw(`CREATE TABLE \`agingDocument\` 
    (  
        \`id\` INT NOT NULL AUTO_INCREMENT, 
        \`userID\` INT NOT NULL,
        \`status\` VARCHAR(15) CHECK (status= 'uploaded' OR status= 'aging_pending' OR status='aging_pending' OR status='aging_failed') NOT NULL,
        \`isSample\` BOOLEAN NOT NULL,
        \`originalImage\` INT,
        \`gender\` VARCHAR(6) CHECK (gender = 'male' OR gender = 'female') NOT NULL,
	    \`name\` VARCHAR(255),
	    \`age\` INT CHECK (age >= 6 and age <=65) NOT NULL, 
        \`ethnicity\` VARCHAR(255) CHECK (ethnicity = 'Caucasian' OR ethnicity = 'Asian' OR ethnicity = 'African' OR ethnicity = 'Latino-Hispanic' OR ethnicity = 'South-Asian') DEFAULT 'Caucasian',
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
