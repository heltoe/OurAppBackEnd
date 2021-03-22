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
  croped_photo VARCHAR(150),
  original_photo VARCHAR(150),
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

CREATE TABLE users_chat(
  id SERIAL PRIMARY KEY,
  sendler_id SERIAL NOT NULL,
  recipient_id SERIAL NOT NULL,
  FOREIGN KEY (sendler_id) REFERENCES users_info (user_id),
  FOREIGN KEY (recipient_id) REFERENCES users_info (user_id)
);

CREATE TABLE chat_messages(
  id SERIAL PRIMARY KEY,
  id_chat SERIAL NOT NULL,
  author SERIAL NOT NULL,
  message VARCHAR(250) NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  FOREIGN KEY (author) REFERENCES users_info (user_id),
  FOREIGN KEY (id_chat) REFERENCES users_chat (id)
);

CREATE TABLE chat_files(
  id SERIAL PRIMARY KEY,
  id_message SERIAL NOT NULL,
  source_file VARCHAR(250) NOT NULL,
  FOREIGN KEY (id_chat) REFERENCES chat_messages (id),
)
