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
