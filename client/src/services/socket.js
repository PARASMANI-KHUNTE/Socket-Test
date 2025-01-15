import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Change URL for production

export default socket;
