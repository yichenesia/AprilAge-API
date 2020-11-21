
-- # DELETE Entries
SET FOREIGN_KEY_CHECKS=0;

DELETE FROM entries;
DELETE FROM jwt_tokens;
DELETE FROM users;
DELETE FROM image;
DELETE FROM agingDocument;
DELETE FROM agingSequence;
DELETE FROM agingResult;
DELETE FROM agedImage;

SET FOREIGN_KEY_CHECKS=1;  
