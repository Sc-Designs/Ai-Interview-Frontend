import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) {
    console.error("⚠️ Socket not initialized yet");
    return;
  }
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) {
    console.warn("⚠️ Socket not initialized yet");
    return;
  }
  socketInstance.emit(eventName, data);
};

export const removeListener = (event, callback) => {
  socketInstance.off(event, callback);
};

export const resetSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};


export const getSocketInstance = () => socketInstance;
