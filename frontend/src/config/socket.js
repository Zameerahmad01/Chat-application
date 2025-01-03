import Socket from "socket.io-client";

let socketInstance = null;
export const initializeSocket = (projectId) => {
  socketInstance = Socket("localhost:5001", {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  // Error handling for socket connection
  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  console.log("socketInstance", socketInstance);
  //   console.log(localStorage.getItem("token"));
  return socketInstance;
};

export const receiveMessage = (EventName, cb) => {
  socketInstance.on(EventName, cb);
};
export const sendMessage = (EventName, cb) => {
  socketInstance.emit(EventName, cb);
};
