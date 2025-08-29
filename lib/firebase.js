// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD-0c54J4G2e-ncVqaIQ4qd0fIfRD4XCE",
  authDomain: "wisewords-ca4a5.firebaseapp.com",
  databaseURL: "https://wisewords-ca4a5-default-rtdb.firebaseio.com",
  projectId: "wisewords-ca4a5",
  storageBucket: "wisewords-ca4a5.firebasestorage.app",
  messagingSenderId: "587703662844",
  appId: "1:587703662844:web:2cf0d12070bc753f4fbf79",
  measurementId: "G-PX5X7RZFV0"
};

const fb = firebase;
const app = fb.initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = fb.database();

// Invisible login
// fb.signInAnonymously(auth);

console.log("delete this");
joinRoomAsTeacher('12345');

/**
 * 
 * @param {String} roomId 
 * @returns {boolean} true if the room exists
 */
async function checkRoom(roomId) {
  const ref = db.ref();
  const response = await ref.child('rooms').child(roomId).get();
  return response.exists();
}

/**
 * Creates a new room
 * @param {String} roomId 
 * @param {String} adminPass 
 */
async function createRoom(roomId, adminPass) {
  await db.ref(`rooms/${roomId}`).set({
    adminPass: adminPass,
    created: Date.now(),
    content: {
      status: "created",
    }
  });
  joinRoomAsTeacher(roomId);
}

async function checkRoomPass(roomId, adminPass) {
  const ref = db.ref(`rooms/${roomId}`);
  const response = await ref.child("adminPass").get();
  return adminPass === response.val();
}

function joinRoomAsTeacher(roomId) {
  getSentences().then(() => {
    createSectionTeacher(roomId);
    createRoomEvent(roomId, updateSectionTeacher);
  });
}

function joinRoomAsStudent(roomId) {
  createSectionStudent();
  createRoomEvent(roomId, updateSectionStudent);
}

function createRoomEvent(roomId, callback) {
  currentRoom = roomId;
  const ref = db.ref(`rooms/${roomId}/content`);
  ref.on("value", snapshot => {
    callback(snapshot.val());
  })
}

function setSentence(sentence) {
  
}