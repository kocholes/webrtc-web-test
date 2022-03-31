import { io } from "socket.io-client";
const SERVER_URL = "http://localhost:3010";

export default class SignalingService {
  constructor() {
    this.socket = io(SERVER_URL);
    this.connectionId;
  }

  async initConnection(connectionId) {
    return new Promise((resolve, reject) => {
      try {
        this.socket.emit("initConnection", connectionId, (response) => {
          if (response.status === 200) {
            const { data } = response;
            this.connectionId = data.connectionId;
            resolve(data);
          }
          reject();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async setConnectionDescription(description) {
    const { type, sdp } = description;
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "connectionDescription",
        this.connectionId,
        { type, sdp },
        (response) => {
          if (response.status === 200) {
            resolve();
          }
          reject();
        }
      );
    });
  }

  addCandidate(type, candidate) {
    this.socket.emit("candidate",
      this.connectionId,
      type,
      candidate,
    );
  }

  onAnswer(callback) {
    this.socket.on("answer", (data) => {
      callback(data);
    });
  }

  onOfferCandidate(callback) {
    this.socket.on("offerCandidate", callback);
  }

  onAnswerCandidate(callback) {
    this.socket.on("answerCandidate", callback);
  }
}
