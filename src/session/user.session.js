import User from '../classes/models/user.class.js';
import { userSessions } from './sessions.js';

export const addUser = (uuid, socket, deviceId, playerId, latency, x, y) => {
  const user = new User(uuid, socket, deviceId, playerId, latency, x, y);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserBydeviceId = (deviceId) => {
  return userSessions.find((user) => user.deviceId === deviceId);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
