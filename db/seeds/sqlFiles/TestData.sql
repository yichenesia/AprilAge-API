
-- Add Test User
INSERT INTO users (id, role, email, first_name, last_name, salt, hashed_password, reset_key, last_user_activity, created_at, updated_at)
VALUES 
('1',NULL,'admin@example.com',NULL,NULL,'cyOi7wnX/0z0q9Sls9Ltbw==','5ltU0OmrofWmn8mQanGR8RAO11p3akJTxmy0d+DVg+ahpmEaZwnnH9Z1qYGkipd2b34eZ9BKOsNcMnJguleY+A==',NULL,NULL,'2020-08-19 14:20:10','2020-08-19 14:20:10');


-- Add Test Entries
INSERT INTO entries (id, user_id, name, text, created_at, updated_at)
VALUES
('1', '1', 'New Entry 1', 'Wowowow', '2020-08-06 00:08:29', '2020-08-06 00:08:29');

-- Add Test Image
INSERT INTO image (id, uri, created_at, updated_at)
VALUES
('1', 's3://uoft-terraform.ollon.ca/sokka.jpg', '2020-11-21 20:20:14', '2020-11-21 20:20:14');

-- Add Test Aging Document
INSERT INTO agingDocument (id, userID, status, isSample, originalImage, gender, name, age, ethnicity, created_at, updated_at)
VALUES
('1', '1', 'aging_pending', '0', '1', 'male', 'Josh', 19, 'Asian','2020-11-20 20:20:14', '2020-11-20 20:20:14');

-- Add Test Aging Sequence
INSERT INTO agingSequence (id, age, smoking, sunExposure, bmifunc, multiplier, created_at, updated_at)
VALUES
('1', '75', '0.0', '0.0', 'linear', '1.0', '2020-11-20 20:20:14', '2020-11-20 20:20:14');

-- Add Test Aging Result
INSERT INTO agingResult (id, sequenceType, sequenceID, agingDocument, created_at, updated_at)
VALUES
('1', 'Max72', '1', '1', '2020-11-20 20:20:14', '2020-11-20 20:20:14');

-- Add Test Aged Image
INSERT INTO agedImage (id, uri, age, created_at, updated_at)
VALUES
('1', 's3://uoft-terraform.ollon.ca/sokka.jpg', '19', '2020-11-20 20:20:14', '2020-11-20 20:20:14');