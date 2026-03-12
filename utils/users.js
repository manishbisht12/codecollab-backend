const users = [];

export const addUser = ({ socketId, username, roomId }) => {
  const index = users.findIndex(user => user.socketId === socketId);
  if (index !== -1) {
    users[index] = { socketId, username, roomId };
    return users[index];
  }

  const user = { socketId, username, roomId };
  users.push(user);
  return user;
};

export const removeUser = (socketId) => {

  const index = users.findIndex(
    user => user.socketId === socketId
  );

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

};

export const getUser = (socketId) => {

  return users.find(
    user => user.socketId === socketId
  );

};

export const getUsersInRoom = (roomId) => {

  return users.filter(
    user => user.roomId === roomId
  );

};