CREATE TABLE users_friend(
  user_id SERIAL NOT NULL,
  friend_id SERIAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users_info (user_id),
  FOREIGN KEY (friend_id) REFERENCES users_info (user_id)
);
