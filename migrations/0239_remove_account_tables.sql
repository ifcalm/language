-- Account registration has been retired. Learning progress stays in the browser.
-- Drop dependent tables before users; do not touch public learning content.
DROP TABLE IF EXISTS auth_sessions;
DROP TABLE IF EXISTS auth_identities;
DROP TABLE IF EXISTS auth_oauth_states;
DROP TABLE IF EXISTS email_login_codes;
DROP TABLE IF EXISTS users;
