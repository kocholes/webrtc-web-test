import * as Signaling from "./signaling";
import * as Stats from "./stats";
import * as Phone from "./3Dphone";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
let peerConnection;
let dataChannel;
let pingStartTimestamp;

// HTML elements
const startOfferBtn = document.getElementById("startOfferBtn");
const connectBtn = document.getElementById("connectBtn");
const channelId = document.getElementById("channelId");
const messageText = document.getElementById("messageText");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const sendPingBtn = document.getElementById("sendPingBtn");
const incomingMessages = document.getElementById("incomingMessages");
const disconnectBtn = document.getElementById("disconnectBtn");
const statsContainer = document.getElementById("statsContainer");
const phone = document.querySelector("#phone img");
const phone3D = document.getElementById('phone3D'); 
const cameraPosX = document.getElementById("cameraPosX");
const cameraPosY = document.getElementById("cameraPosY");
const cameraPosZ = document.getElementById("cameraPosZ");
const rollDegrees = document.getElementById("rollDegrees");
const pitchDegrees = document.getElementById("pitchDegrees");

Phone.init(phone3D)
  .then(() => {
    const cameraPos = [parseInt(cameraPosX.value), parseInt(cameraPosY.value), parseInt(cameraPosZ.value)];
    Phone.render(undefined, cameraPos);
  });

// Inputs events
startOfferBtn.onclick = handleStartOfferBtnClick;
sendPingBtn.onclick = () => sendPing();

// Handlers
async function handleStartOfferBtnClick() {
  peerConnection = new RTCPeerConnection(servers);
  peerConnection.onconnectionstatechange = (event) => {
    console.log("Peer Connection - State change", event);
  }
  dataChannel = peerConnection.createDataChannel("mainChannel");
  initChannelEvents();
  channelId.value = await Signaling.createOffer(peerConnection);
  Stats.initStats(peerConnection, statsContainer)
  connectBtn.disabled = true;
}

// Answer
connectBtn.onclick = async () => {
  peerConnection = new RTCPeerConnection(servers);
  peerConnection.addEventListener("datachannel", (event) => {
    console.info("onDataChannel", event);
    dataChannel = event.channel;
    initChannelEvents();
  });
  await Signaling.answer(peerConnection, channelId.value);
  Stats.initStats(peerConnection, statsContainer)
  startOfferBtn.disabled = true;
};

// Send message
sendMessageBtn.onclick = async () => {
  const message = messageText.value;
  if (message) {
    sendMessage(message);
  }
};

// Disconnect
disconnectBtn.onclick = async () => {
  if (dataChannel) {
    dataChannel.close();
    connectBtn.disabled = false;
    startOfferBtn.disabled = false;
  }
};

// Channel events
function initChannelEvents() {
  dataChannel.addEventListener("open", (event) => {
    console.log("Channel opened!", event);
    messageText.disabled = false;
    sendMessageBtn.disabled = false;
    sendPingBtn.disabled = false;
    disconnectBtn.disabled = false;
  });

  dataChannel.addEventListener("close", (event) => {
    console.log("Channel closed!", event);
    messageText.disabled = true;
    sendMessageBtn.disabled = true;
    sendPingBtn.disabled = true;
    disconnectBtn.disabled = true;
  });

  dataChannel.addEventListener("error", (event) => {
    console.log("Channel Error", event);
  });

  dataChannel.addEventListener("message", async (event) => {
    console.log("Channel Message", event)
    const [msgType, data] = event.data.split("|");
    
    switch(msgType) {
      case 'msg':
        incomingMessages.innerText = `Remote: ${data}`;
        break;
      case 'rot':
        const position = data.split(",");
        const cameraPos = [parseInt(cameraPosX.value), parseInt(cameraPosY.value), parseInt(cameraPosZ.value)];
        Phone.render(position, cameraPos);
        rollDegrees.innerText = `${parseInt(position[0] * 180 / Math.PI)} dg`;
        pitchDegrees.innerText = `${parseInt(position[1] * 180 / Math.PI) + 90} dg`;
        break;
      case 'ping': {
          if(data === 'request') {
            // Send the ping response
            sendPing(true);
          }
          else {
            // Calculate the round trip time
            console.info('RTT:', Date.now() - pingStartTimestamp);
            const propagationTime = parseInt((Date.now() - pingStartTimestamp) / 2);
            incomingMessages.innerText = `Propagation relay: ${propagationTime}ms`;
          }
        }
        break;
    }
  });
}

function sendMessage(message) {
  dataChannel.send(`msg|${message}`);
  messageText.value = "";
  incomingMessages.innerText += "Local: " + message + "\n";
}

function sendPing(isResponse = false) {
  if(!isResponse) {
    pingStartTimestamp = Date.now();
  }
  dataChannel.send(`ping|${isResponse ? 'response' : 'request'}`);
}

