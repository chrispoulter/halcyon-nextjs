DROP TABLE user_roles;
DROP TABLE roles;
DROP TABLE users;
DROP TABLE templates;

CREATE TABLE IF NOT EXISTS templates (
	template_id SERIAL PRIMARY KEY,
	key VARCHAR UNIQUE NOT NULL,
	subject VARCHAR NOT NULL,
	html VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	user_id SERIAL PRIMARY KEY,
	email_address VARCHAR UNIQUE NOT NULL,
	password VARCHAR NULL,
	password_reset_token VARCHAR NULL,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	date_of_birth TIMESTAMP WITH TIME ZONE NOT NULL,
	is_locked_out BOOL NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS roles (
   role_id SERIAL PRIMARY KEY,
   name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO templates (key, subject, html)
VALUES ('RESET_PASSWORD', 'Password Reset // Halcyon', '<html><head><title>Password Reset // Halcyon</title></head><body><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">We have received a request to reset your password.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">In order to complete the process and select a new password pleaseclick here:</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px"><a href="{{ passwordResetUrl }}">Reset your password</a></p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px"><strong>Important</strong>: If you did not request a password reset do not worry. Your account is still secure and your old password will remain active.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">Regards,<br /><strong>Halcyon</strong><br /><a href="{{ siteUrl }}">{{ siteUrl }}</a></p></body></html>')
ON CONFLICT ON CONSTRAINT templates_key_key
DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html
RETURNING *;

INSERT INTO users (email_address, first_name, last_name, date_of_birth)
VALUES ('halcyon@chrispoulter.com', 'System', 'Administrator', '1970-01-01 00:00:00.0000000')
ON CONFLICT ON CONSTRAINT users_email_address_key
DO UPDATE SET email_address = EXCLUDED.email_address, password = EXCLUDED.password, password_reset_token = EXCLUDED.password_reset_token, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth, is_locked_out = EXCLUDED.is_locked_out
RETURNING *;

INSERT INTO roles (name)
VALUES ('SYSTEM_ADMINISTRATOR'), ('USER_ADMINISTRATOR')
ON CONFLICT ON CONSTRAINT roles_name_key DO NOTHING
RETURNING *;
	
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u
INNER JOIN roles r ON r.name = 'SYSTEM_ADMINISTRATOR'
WHERE u.email_address = 'halcyon@chrispoulter.com'
ON CONFLICT ON CONSTRAINT user_roles_pkey DO NOTHING;

SELECT * FROM templates;
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM user_roles;

DELETE FROM users;

SELECT 
	u.*,
 	ARRAY(SELECT r.name FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = u.user_id) AS roles
FROM 
	users u
WHERE 
	(u.email_address || ' ' || u.first_name || ' ' || u.last_name) ILIKE '%' || 'system' || '%'
	
SELECT true AS connected
