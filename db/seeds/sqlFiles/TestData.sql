
-- Add Test User
INSERT INTO users (id, role, email, first_name, last_name, salt, hashed_password, reset_key, last_user_activity, created_at, updated_at)
VALUES 
('1',NULL,'admin@example.com',NULL,NULL,'cyOi7wnX/0z0q9Sls9Ltbw==','5ltU0OmrofWmn8mQanGR8RAO11p3akJTxmy0d+DVg+ahpmEaZwnnH9Z1qYGkipd2b34eZ9BKOsNcMnJguleY+A==',NULL,NULL,'2020-08-19 14:20:10','2020-08-19 14:20:10');


-- Add Test Entries
INSERT INTO entries (id, user_id, name, text, created_at, updated_at)
VALUES
('1', '1', 'New Entry 1', 'Wowowow', '2020-08-06 00:08:29', '2020-08-06 00:08:29')


