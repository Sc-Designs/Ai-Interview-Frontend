import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("⚠️ Connection error:", err.message);
    });

    // Send keep-alive pings every 20s
    setInterval(() => {
      if (socketInstance?.connected) {
        socketInstance.emit("pingCheck");
      }
    }, 20000);

    socketInstance.on("pongCheck", () => {
      console.log("📡 Server is alive");
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
  if (socketInstance) {
    socketInstance.off(event, callback);
  }
};

export const resetSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const getSocketInstance = () => socketInstance;
