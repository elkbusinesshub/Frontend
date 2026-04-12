import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SOCKET_BASE_URL}`, {
  transports: ['websocket'],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
