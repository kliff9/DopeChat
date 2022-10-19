// ------------------------------------------------ Basic Setup for Setting up the Stream  -------------------------------------------- \\\
//

const APP_ID = "afa463fb93f64fbb9dc55922464e29c9";

const TOKEN = sessionStorage.getItem("token");
const CHANNEL = sessionStorage.getItem("room");
let UID = sessionStorage.getItem("UID");

let NAME = sessionStorage.getItem("name");
let Random = sessionStorage.getItem("Random");

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
  let Cam = await localTracks[1];

  console.log(member);

  let userlist = await UserList();

  let HD720 = await Cam.setEncoderConfiguration("720p_1").then(() => {
    console.log("Quality has been updated to", Cam._encoderConfig);
  });
  remoteUsers[UID] = member;

  let player = `<div  class="video-container" style="background-image: url('../static/images/smiley.png');" id="user-container-${UID}">
                   <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                     <div class="video-player  selff" id="user-${UID}"></div>
                  </div>`;

  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);
  localTracks[1].play(`user-${UID}`);
  await client.publish([localTracks[0], localTracks[1]]);

  console.log(
    "Cam: ",
    Cam.getMediaStreamTrack().getSettings(),
    "CamVideoStats: ",
    client.getLocalVideoStats()
  );
};

// ------------------------------------------------ Subscribes the User to the Channel upon joining ----------------------------------------------------- \\\
Added = true
let handleUserJoined = async (user, mediaType) => {
  let activated = 0;
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  console.log('PLAYERRMED: ', mediaType)

  let player = null
  if (mediaType === "video") {
    console.log('Video was called')
     player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }
    let member = await getMember(user);
    let userlist = await UserList();

    player = `<div  class="video-container" style="background-image: url('../static/images/smiley.png');" id="user-container-${user.uid}">
          <div class="video-player" id="user-${user.uid}"></div>
          <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
      </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);
    user.videoTrack.play(`user-${user.uid}`);
  }
  console.log('PLAYERR: ', player, mediaType, activated)

  if (mediaType === "audio") {
    user.audioTrack.play();
  }

  activated += 1;
};

// ------------------------------------------------ Remove the User Video from the html ----------------------------------------------------- \\\

let handleUserLeft = async (user) => {
  console.log('user left: ', user)
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();
  UserList();

};

// ------------------------------------------------ Remove the User from the Stream ----------------------------------------------------- \\\
let rrr = Math.floor(Math.random() * 18);
let leaveAndRemoveLocalStream = async () => {

  deleteMember();


  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }
  if (Random) {

   deleteRoom();
      } 

  await client.leave();


  window.open("/", "_self");
  


  // window.location.assign("/");
};

// ------------------------------------------------ Allow User to Toggle the Camera ----------------------------------------------------- \\\

// Change to Setmuted because its faster
let toggleCamera = async (e) => {
  console.log("TOGGLE CAMERA TRIGGERED", localTracks[1]);
  if (localTracks[1].enabled) {
    await localTracks[1].setEnabled(false);

    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
    remove_camera_css("0%", false);
    console.log("FFF set to disable");
  } else {
    remove_camera_css("100%", true);
    await localTracks[1].setEnabled(true);
    e.target.style.backgroundColor = "#fff";
    console.log("FFF set to enabled");
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
  console.log("Getmember:", member);
  return member;
};
// ------------------------------------------------ Deletes the Member Information  ----------------------------------------------------- \\\
let deleteMember = async () => {
  console.log("Delete Member Called:");

  let response = await fetch("/delete_member/", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: NAME, room_name: CHANNEL, UID: UID }),
  });
  let deletedmember = await response.json();
  console.log(deletedmember)
};

// ------------------------------------------------ Grabs The UserList  ----------------------------------------------------- \\\

let AddedUsers = [];


let UserList = async () => {
  let response = await fetch(`/get_user/?room_name=${CHANNEL}`);
  let UL = await response.json();
  let RoomUserList = UL.users;
  console.log("addedUsers:", AddedUsers, 'RoomUserlist', RoomUserList);
  let userdiv;
  RoomUserList.forEach(
    (hello = (user) => {
      if (!AddedUsers.includes(user)) {
        userdiv = `<div class="button-60" id="${user}">${user}</div>`

        document
          .getElementById("AllUsers")
          .insertAdjacentHTML("beforeend", userdiv);
        AddedUsers.push(user);
      }

    })
  );
  UserList_delete_user(RoomUserList)

};

let UserList_delete_user = async (RL) => {
  AddedUsers.forEach(
    (hello = (user) => {
      if (!RL.includes(user)) {

        document.getElementById(user).remove();

      const index = AddedUsers.indexOf(user);
      AddedUsers.splice(index, 1);
      console.log("UDU update: ", AddedUsers);
      }

    })
  );

};

// ------------------------------------------------ Removes the Member in the Room  ----------------------------------------------------- \\\


let deleteRoom = async () => {
  console.log("Random: ", Random);

    let response = await fetch("/leave_RandomRoom/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ RoomName: CHANNEL }),
    });
    let postupdate = await response.json();
    console.log("Post Update:", postupdate);
  
};

AgoraRTC.onAutoplayFailed = () => {
  const btn = document.createElement("button");
  btn.innerText = "Click me to resume the audio/video playback";
  btn.onClick = () => {
    btn.remove();
  };
  document.body.append(btn);
};

let remove_camera_css = (height) => {
  const self = document.querySelector(".selff");

  self.style.height = height;
};



// ------------------------------------------------ Calling the Main Function  ----------------------------------------------------- \\\

joinAndDisplayLocalStream();

// ------------------------------------------------ Assinging Functions to the HTML  ----------------------------------------------------- \\\
window.addEventListener("beforeunload", deleteRoom);
window.addEventListener("beforeunload", deleteMember);
  

// window.addEventListener("beforeunload ", function(event)  {
//   window.alert("alert")
//   alert("yoas")
// });

// window.onbeforeunload = deleteRoom

document
  .getElementById("leave-btn")
  .addEventListener("click", leaveAndRemoveLocalStream);
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);

// ------------------------------------------------------------------------------------------------------------- \\\
