import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Define the socket instance but don't connect automatically immediately
const socket = io(SOCKET_URL, {
  autoConnect: false, 
});

// Call this function when the user successfully logs in or the app initializes
export const connectSocket = () => {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    // Pass the JWT token so the backend socket server can authenticate this connection
    socket.auth = { token };
  }
  
  socket.connect();
};

// Call this function when the user logs out
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
