// ------------------------------------------------ Basic Setup for Setting up the Stream  -------------------------------------------- \\\

const APP_ID = "afa463fb93f64fbb9dc55922464e29c9";

const TOKEN = sessionStorage.getItem("token");
const CHANNEL = sessionStorage.getItem("room");
let UID = sessionStorage.getItem("UID");

let NAME = sessionStorage.getItem("name");
// Enable log upload
AgoraRTC.enableLogUpload();
// Set the log output level as INFO
AgoraRTC.setLogLevel(1);

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

console.log(`The Client has been connected: ${client}`);

let localTracks = [];
let remoteUsers = {};


// ------------------------------------------------ Function allows user to join the Stream   -------------------------------------------- \\\

let joinAndDisplayLocalStream = async () => {
  document.getElementById("room-name").innerText = CHANNEL;

  client.on("user-published", handleUserJoined);
  client.on("user-left", handleUserLeft);

  console.log("Starting: ");
  UID = Number(UID);
  console.log(typeof UID);

  try {
    UID = await client.join(APP_ID, CHANNEL, TOKEN, UID);
  } catch (error) {
    console.error(error);
    console.log("Error has ran");
    window.open("/", "_self");
  }

  console.log(`The UID has been Created: ${UID}`);
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  let member = await createMember();

  remoteUsers[UID] = member;

  let player = `<div  class="video-container" id="user-container-${UID}">
                   <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                     <div class="video-player" id="user-${UID}"></div>
                  </div>`;

  let getD = await AgoraRTC.getDevices()
    .then((devices) => {
      function looping(item) {
        console.log(item);
      }
      devices.forEach(looping);
    })
    .catch((e) => {
      console.log("get devices error!", e);
    });

  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);
  localTracks[1].play(`user-${UID}`);
  await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined__a = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }

    let member = await getMember(user);
    if (member) {
      console.log(
        `User: ${member.name} has Join the Stream using ${UID} or ${MemberName} creds`
      );
    }

    console.log("MemberName: 0", MemberName);
    player = `<div  class="video-container" id="user-container-${user.uid}">
        <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
    <div class="video-player" id="user-${user.uid}"></div>
    </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);
    console.log("subscribe video success");

    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === "audio") {
    console.log("subscribe audio success");

    user.audioTrack.play();
  }
};
// ------------------------------------------------ Subscribes the User to the Channel upon joining ----------------------------------------------------- \\\

let handleUserJoined = async (user, mediaType) => {
  let activated = 0;
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }
    let member = await getMember(user);
    player = `<div  class="video-container" id="user-container-${user.uid}">
          <div class="video-player" id="user-${user.uid}"></div>
          <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
      </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);
    user.videoTrack.play(`user-${user.uid}`);
  }
  if (mediaType === "audio") {
    user.audioTrack.play();
  }

  activated += 1;
  console.log("activated: ", activated);
};

// ------------------------------------------------ Remove the User Video from the html ----------------------------------------------------- \\\

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();
};

// ------------------------------------------------ Remove the User from the Stream ----------------------------------------------------- \\\

let leaveAndRemoveLocalStream = async () => {
  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }

  await client.leave();
  window.open("/", "_self");
};

// ------------------------------------------------ Allow User to Toggle the Camera ----------------------------------------------------- \\\

let toggleCamera = async (e) => {
  console.log("TOGGLE CAMERA TRIGGERED");
  if (localTracks[1].enabled) {
    await localTracks[1].setEnabled(false);
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[1].setEnabled(true);
    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
  }
};
// ------------------------------------------------ Allow User to Toggle the Microphone  ----------------------------------------------------- \\\

let toggleMic = async (e) => {
  console.log("TOGGLE MIC TRIGGERED");
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    console.log("The Mic Has been Umuted");
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[0].setMuted(true);
    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
  }
};

// ------------------------------------------------ Create the user upon joining the channel  ----------------------------------------------------- \\\

let createMember = async () => {
  let response = await fetch("/create_member/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: NAME, room_name: CHANNEL, UID: UID }),
  });

  let member = await response.json();
  return member;
};

// ------------------------------------------------ Grabs the Users Information  ----------------------------------------------------- \\\

let getMember = async (user) => {
  let response = await fetch(
    `/get_member/?UID=${user.uid}&room_name=${CHANNEL}`
  );
  let member = await response.json();
  console.log(`Getmember: ${member}`);
  return member;
};

<<<<<<< HEAD

=======
AgoraRTC.onAutoplayFailed = () => {
  const btn = document.createElement("button");
  btn.innerText = "Click me to resume the audio/video playback";
  btn.onClick = () => {
    btn.remove();
  };
  document.body.append(btn);
};
>>>>>>> 2d2115ba7a27040a61d8652ab4f4df478cb7404d

let AutoplayCheck = (e) => {
  console.log(remoteUsers);
  console.log(UID);
  console.log(remoteUsers.UID);

  // if (user1.audioTrack.isPlaying) {
  //     user1.audioTrack.stop();
  //     e.target.innerHTML = "Muted";
  //     console.log("button IF was clicked")
  //     return;
  // }

  // console.log("button was clicked")
  // user1.audioTrack.play();
  // e.target.innerHTML = "Playing";
};
// ------------------------------------------------ Calling the Main Function  ----------------------------------------------------- \\\

joinAndDisplayLocalStream();

// ------------------------------------------------ Assinging Functions to the HTML  ----------------------------------------------------- \\\

document
  .getElementById("leave-btn")
  .addEventListener("click", leaveAndRemoveLocalStream);
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);
document.getElementById("user-audio").addEventListener("click", AutoplayCheck);

// ------------------------------------------------------------------------------------------------------------- \\\
AgoraRTC.onMicrophoneChanged = (info) => {
  console.log("microphone changed!", info.state, info.device);
};

let isAudioAutoplayFailed = false;
AgoraRTC.onAudioAutoplayFailed = () => {
  if (isAudioAutoplayFailed) return;

  isAudioAutoplayFailed = true;
  const btn = document.createElement("button");
  btn.innerText = "Click me to resume the audio playback";
  btn.onClick = () => {
    isAudioAutoplayFailed = false;
    btn.remove();
  };
  document.body.append(btn);
};

// getD()
