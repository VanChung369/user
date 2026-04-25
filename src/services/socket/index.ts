import io from "socket.io-client";

let socketIo: any;

const getSocketBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API || "";

  if (!apiUrl) {
    return "";
  }

  const normalizedApiUrl = apiUrl.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(normalizedApiUrl)) {
    return normalizedApiUrl;
  }

  return `https://${normalizedApiUrl}`;
};

export default class Socket {
  getInstance = (address: string) => {
    if (socketIo == null) {
      socketIo = io(getSocketBaseUrl(), {
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
        transports: ["websocket"],
        query: {
          address,
        },
      });

      socketIo.on("connect", () => {
        console.log("connect socket...");
      });
      socketIo.on("disconnect", () => {
        console.log("disconnect socket...");
      });
    }
    return socketIo;
  };

  removeInstance = () => {
    socketIo = null;
  };
}
