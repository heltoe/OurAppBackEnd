CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(150) NOT NULL,
  repassword VARCHAR(150),
  role VARCHAR(10) NOT NULL
);

CREATE TABLE users_tokens(
  user_id SERIAL NOT NULL,
  token_id VARCHAR(150),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE users_info(
  user_id SERIAL UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender VARCHAR(6) NOT NULL,
  birth_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  photo VARCHAR(150),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE users_friendship(
  user_id SERIAL NOT NULL,
  friend_ship_id SERIAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users_info (user_id),
  FOREIGN KEY (friend_ship_id) REFERENCES users_info (user_id)
);

CREATE TABLE users_friend(
  user_id SERIAL NOT NULL,
  friend_id SERIAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users_info (user_id),
  FOREIGN KEY (friend_id) REFERENCES users_info (user_id)
);
