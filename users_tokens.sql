CREATE TABLE users_tokens(
  user_id SERIAL NOT NULL,
  token_id VARCHAR(150),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
