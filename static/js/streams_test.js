`
Testing
FIle
For
Debugging
Not used in Development
`;

// const AgoraRTC_N4140 = require("../assets/AgoraRTC_N-4.14.0");

const APP_ID = "afa463fb93f64fbb9dc55922464e29c9";
// // use for auth
// const TOKEN =
//   "007eJxTYNBsWie1Mv7/9BX7J9/Y83hpdvPVrSESMWqCc7uOZnpKv/mgwJCYlmhiZpyWZGmcZmaSlpRkmZJsamppZGRiZpJqZJls+dVdN7lkpl6yq2gKAyMQsgAxiM8EJpnBJAuUzE3MzGNgAACFYCbR";
// const CHANNEL = "main";
// let UID;
// console.log("Stream.js is connected");

const TOKEN = sessionStorage.getItem("token");
const CHANNEL = sessionStorage.getItem("room");
let UID = sessionStorage.getItem("UID");

let NAME = sessionStorage.getItem("name");

let userlist = [];
let yes = true;

/* Creates a local client object for managing a call.  codec is vp8 and default channel profile is rtc


VP8

 VP8 (Video Compression Format or Video Compression Specification) is a specification for encoding and
 decoding high definition video as either a file or a bitstream for viewing

RTC

 Real time communication, RTC, is a term used to describe any type of live telecommunications that take
 place with no transmission delays. It’s virtually instant with little to no delay.
 It is used for a one-on-one call or a group call where all users in the channel can converse freely.
 */
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

console.log(`The Client has been connected: ${client}`);
// localTrack is the abstract interface that defines local audio and video tracks and can be used for playing and publishing audio and video.

let localTracks = []; //  store local audio and video tracks for remote users (when ask permission for audio & Video)
let remoteUsers = {};
let MemberName;

let joinAndDisplayLocalStream = async () => {
  document.getElementById("room-name").innerText = CHANNEL;

  client.on("user-published", handleUserJoined); //listen to publish event we need a function to respond
  // client.on("user-published", adduser);
  // client.on("user-left", handleUserLeft);
  console.log("Starting: ");
  UID = Number(UID);
  console.log(typeof UID);

  try {
    // if this dont work send back to homepage
    UID = await client.join(APP_ID, CHANNEL, TOKEN, UID);
  } catch (error) {
    console.error(error);
    console.log("Error has ran");
    window.open("/", "_self");
  } // https://docs.agora.io/en/All/API%20Reference/web_ng/interfaces/iagorartcclient.html#join

  console.log(`The UID has been Created: ${UID}`);
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(); // Creates an audio track from the audio sampled by a microphone and a video track from the video captured by a camera.
  let member = await createMember();
  MemberName = member.name;
  console.log("member: ", member);
  // console.log("MemberName: 0", MemberName);
  // userlist.push(member.name);
  // console.log(userlist);
  // userlisth3 = `<h3 id="replace">Users: ${userlist} </h3>`;
  // AllUsers.push(member.name);
  // document.getElementById("mapp").innerHTML = userlist;

  // document
  //   .getElementById("room-name")
  //   .insertAdjacentHTML("beforeend", userlisth3);
  // shows the video player
  let player = `<div  class="video-container" id="user-container-${UID}">
                   <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                     <div class="video-player" id="user-${UID}"></div>
                  </div>`;

  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);
  localTracks[1].play(`user-${UID}`); // play video
  await client.publish([localTracks[0], localTracks[1]]); // how other users can have access, Publishes local audio and/or video tracks to a channel.
  // console.log(localTracks[1].isPlaying, localTracks[0].isPlaying);
};

let handleUserJoined__a = async (user, mediaType) => {
  remoteUsers[user.uid] = user; //add  user

  await client.subscribe(user, mediaType); // Subscribes to the audio and/or video tracks of a remote user.

  if (mediaType === "video") {
    // make sure it dosent already exist (refreshing) and  build a video player and display
    let player = document.getElementById(`user-container-${user.uid}`); //check if it exist
    if (player != null) {
      player.remove(); // remove then build then display
    }

    let member = await getMember(user);
    // if (member) {
    //   console.log(
    //     `User: ${member.name} has Join the Stream using ${UID} or ${MemberName} creds`
    //   );
    // }
    // if (!(UID in userlist)) {
    //   userlist.push(UID);
    // }
    // console.log("MemberName: 0", MemberName);
    player = `<div  class="video-container" id="user-container-${user.uid}">
        <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
    <div class="video-player" id="user-${user.uid}"></div>
    </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);
    console.log("subscribe video success");

    user.videoTrack.play(`user-${user.uid}`);
    // console.log("Video Playing at : ", user.videoTrack);
  }

  if (mediaType === "audio") {
    console.log("subscribe audio success");

    user.audioTrack.play();
    // console.log("audio is played at : ", user.audioTrack);
  }
};

let handleUserJoined = async (user, mediaType) => {
  console.log("The Current mediaTypee: ", mediaType);
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  // await client.subscribe(user, "audio");
  // await client.subscribe(user, "video");
  // If the subscribed track is an audio track
  if (mediaType === "audio") {
    const audioTrack = user.audioTrack;
    // Play the audio
    audioTrack.play();
  } else {
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
    const videoTrack = user.videoTrack;
    // Play the video
    videoTrack.play(`user-${user.uid}`);
  }

  // remoteUsers[user.uid] = user;
  // await client.subscribe(user, mediaType);
  // if (mediaType === "video") {
  //   let player = document.getElementById(`user-container-${user.uid}`);
  //   if (player != null) {
  //     player.remove();
  //   }
  //   let member = await getMember(user);
  //   player = `<div  class="video-container" id="user-container-${user.uid}">
  //         <div class="video-player" id="user-${user.uid}"></div>
  //         <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
  //     </div>`;
  //   document
  //     .getElementById("video-streams")
  //     .insertAdjacentHTML("beforeend", player);
  //   user.videoTrack.play(`user-${user.uid}`);
  // }
  // if (mediaType === "audio") {
  //   user.audioTrack.play();
  // }
  // console.log("activated");
};

let adduser = async (user) => {
  // if (mediaType === "audio") {
  let member = await getMember(user);

  if (yes) {
    userlist.push(member.name);
    console.log(`userlist has been called: ${userlist}`);
    document.getElementById("mapp").innerHTML = userlist;
    yes = false;
  }
  // }
};
let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove(); // remove user from doms
};

let leaveAndRemoveLocalStream = async () => {
  for (let i = 0; localTracks.length > i; i++) {
    // remove Both local tracks
    localTracks[i].stop(); // Stops playing the media track.
    localTracks[i].close(); // Closes a local track and releases the audio and video resources that it occupies.
  }

  await client.leave(); // Leaves a channel.
  //This is somewhat of an issue because if user leaves without actaull pressing leave button, it will not trigger
  // deleteMember();
  window.open("/", "_self"); // send to home page
};

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

let toggleMic = async (e) => {
  console.log("TOGGLE MIC TRIGGERED");
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[0].setMuted(true);
    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
  }
};

let createMember = async () => {
  let response = await fetch("/create_member/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ name: NAME, room_name: CHANNEL, UID: UID }),
  });

  let member = await response.json();
  return member;
};
let getMember = async (user) => {
  let response = await fetch(
    `/get_member/?UID=${user.uid}&room_name=${CHANNEL}`
  );
  let member = await response.json();
  print(`Getmember: ${member}`);
  return member;
};

const AllUsers = [];

joinAndDisplayLocalStream();

console.log("AllUsers: ", AllUsers);
// let joinAndDisplayLocalStream = async () => {

//     localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

// }

// let handleUserJoined = async (user, mediaType) => {
//     remoteUsers[user.uid] = user
//     await client.subscribe(user, mediaType)

// }

// let deleteMember = async () => {
//     let response = await fetch('/delete_member/', {
//         method:'POST',
//         headers: {
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
//     })
//     let member = await response.json()
// }

// window.addEventListener("beforeunload",deleteMember);

// joinAndDisplayLocalStream()

document
  .getElementById("leave-btn")
  .addEventListener("click", leaveAndRemoveLocalStream);
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);

// -------------

//  ------------------
