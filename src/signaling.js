import SignalingService from "../signalingService";

const service = new SignalingService();

export async function createOffer(peerConnection) {
  await service.initConnection();

  // Get and push the offer description to the server
  const offerDescription = await peerConnection.createOffer();
  await service.setConnectionDescription(offerDescription);
  await peerConnection.setLocalDescription(offerDescription);

  // for each found ice candidate, push it to the server
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("onLocalIceCandidate", "offer");
      service.addCandidate("offer", event.candidate.toJSON());
    }
  };

  // Listen for remote answer
  service.onAnswer(function (data) {
    if (!peerConnection.currentRemoteDescription) {
      console.log("onAnswer", data);
      const answerDescription = new RTCSessionDescription(data);
      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  // if a new answer candidate is added to the server, we add it to the local connection
  service.onAnswerCandidate(function (data) {
    addIceCandidate(peerConnection, data);
  });

  return service.connectionId;
}

export async function answer(peerConnection, connectionId) {
  const { offer: offerDescription, offerCandidates } = await service.initConnection(
    connectionId
  );

  // Set the offer description from the other peer
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offerDescription)
  );

  // Add all existing offer candidates in the connection data
  offerCandidates.forEach((data) => addIceCandidate(peerConnection, data));

  // Get and push the answer description to the server
  const answerDescription = await peerConnection.createAnswer();
  await service.setConnectionDescription(answerDescription);
  await peerConnection.setLocalDescription(answerDescription);

  // for each found ice candidate, push it to the server
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("onLocalIceCandidate", "answer");
      service.addCandidate("answer", event.candidate.toJSON());
    }
  };

  // if a new offer candidate is added to the server, we add it to the local connection
  service.onOfferCandidate(function (data) {
    addIceCandidate(peerConnection, data);
  });
}

function addIceCandidate(peerConnection, data) {
  console.log("onRemoteIceCandidate", data);
  const iceCandidate = new RTCIceCandidate(data);
  peerConnection.addIceCandidate(iceCandidate);
}
