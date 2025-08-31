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
if (debugMode) {
  setTimeout(() => {
    if (teacherMode) {
      joinRoomAsTeacher('12345');
    } else {
      studentName = debugName;
      getTextFile(RESPONDED_URL).then(arr => arrResponded = arr);
      joinRoomAsStudent('12345');
    }
  }, 1000);
}

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
  const sentences = await getSentences();
  await db.ref(`rooms/${roomId}`).set({
    adminPass: adminPass,
    created: Date.now(),
    content: {
      status: "created",
      currentSession: "none",
    },
    sentences: sentences,
  });
  joinRoomAsTeacher(roomId);
}

/**
 * 
 * @param {String|Number} roomId 
 * @param {String} adminPass 
 * @returns 
 */
async function checkRoomPass(roomId, adminPass) {
  const ref = db.ref(`rooms/${roomId}`);
  const response = await ref.child("adminPass").get();
  return adminPass === response.val();
}

/**
 * 
 * @param {String|Number} roomId 
 */
function joinRoomAsTeacher(roomId) {
  studentName = null;
  createSectionTeacher(roomId);
  createRoomEvent(roomId, updateSectionTeacher);
}

/**
 * 
 * @param {String|Number} roomId 
 */
function joinRoomAsStudent(roomId) {
  getWaitingRoom().then(() => {
    createSectionStudent();
    studentJoin(roomId);
    createRoomEvent(roomId, updateSectionStudent);
  });
}

/**
 * 
 * @param {String|Number} roomId 
 */
async function studentJoin(roomId) {
  const ref = db.ref(`rooms/${roomId}/students`);
  const students = await ref.get();
  if (students.exists()) {
    const names = students.val();
    if (!names.includes(studentName)) {
      names.push(studentName);
      names.sort((a, b) => { return a.localeCompare(b) });
      ref.set(names);
    }
  } else {
    ref.set([studentName]);
  }
}

/**
 * 
 * @param {String|Number} roomId 
 * @param {String} studentName 
 * @returns {Boolean}
 */
async function studentExists(roomId, studentName) {
  const ref = db.ref(`rooms/${roomId}/students`);
  let students = await ref.get();
  students = students.val();
  return Array.isArray(students) && students.includes(studentName);
}

/**
 * 
 * @returns {string[]}
 */
async function getStudents() {
  const ref = db.ref(`rooms/${currentRoom}/students`)
  let students = await ref.get();
  return students.val();
}

/**
 * 
 * @param {Number} index 
 */
async function removeStudentFromList(index) {
  const ref = db.ref(`rooms/${currentRoom}/students`);
  let studentsList = await ref.get();
  studentsList = studentsList.val();
  studentsList.splice(index, 1);
  ref.set(studentsList);
}

/**
 * 
 * @param {String|Number} roomId 
 * @param {Function} callback 
 */
async function createRoomEvent(roomId, callback) {
  currentRoom = roomId;
  const ref = db.ref(`rooms/${roomId}/content`);
  await ref.on("value", snapshot => {
    callback(snapshot.val());
    createStudentsEvent(roomId);
  });
}

async function removeRoomEvent(roomId) {
  const ref = db.ref(`rooms/${roomId}/content`);
  await ref.off();
}

/**
 * 
 * @param {String|Number} roomId 
 */
async function createStudentsEvent(roomId) {
  const ref = db.ref(`rooms/${roomId}/students`);
  await ref.on("value", snapshot => {
    if (snapshot.exists()) {
      if (!studentName) {
        fillStudentsList(snapshot.val());
      } else {
        checkStudentDeleted();
      }
    }
  });
}

async function removeStudentsEvent(roomId) {
  const ref = db.ref(`rooms/${roomId}/students`);
  await ref.off();
}

/**
 * 
 * @param {String} newStatus 
 */
function setStatus(newStatus) {
  const ref = db.ref(`rooms/${currentRoom}/content`);
  ref.update({ status: newStatus });
}

/**
 * 
 * @returns {String}
 */
async function getStatus() {
  const ref = db.ref(`rooms/${currentRoom}/content/status`);
  const snapshot = await ref.get()
  return snapshot.val()
}

/**
 * 
 * @returns {String}
 */
async function getNewSentence() {
  const ref = db.ref(`rooms/${currentRoom}/sentences`);
  const snapshot = await ref.get();
  const sentences = snapshot.val();
  const selectedSentence = sentences.shift();
  await ref.set(sentences);
  return selectedSentence;
}

/**
 * 
 * @param {String} newSentence 
 * @returns 
 */
async function setNewSentence(newSentence) {
  const ref = db.ref(`rooms/${currentRoom}/content`);
  const newSentenceKey = ref.push().key;
  const updates = {};
  updates[`/${newSentenceKey}/sentence`] = newSentence;
  updates[`/currentSession`] = newSentenceKey;
  return await ref.update(updates);
}

/**
 * 
 * @returns {String}
 */
async function getCurrentSentence() {
  let key = await getCurrentSession();
  const ref = db.ref(`rooms/${currentRoom}/content/${key}/sentence`);
  const sentence = await ref.get();
  return sentence.val();
}

/**
 * 
 * @returns {String}
 */
async function getCurrentSession() {
  const ref = db.ref(`rooms/${currentRoom}/content`);
  const key = await ref.child("currentSession").get();
  return key.val();
}

/**
 * 
 * @param {String} sentence 
 * @returns 
 */
async function addStudentResponse(sentence) {
  const key = await getCurrentSession();
  const ref = db.ref(`rooms/${currentRoom}/content/${key}/responses`);
  const response = {
    student: studentName,
    response: sentence,
  }
  let responses = await ref.get();
  if (!responses.exists()) {
    ref.set([response]);
    return;
  }
  responses = responses.val();
  responses.push(response);
  arraySortByKey(responses, "student");
  ref.set(responses);
}

async function hasResponded() {
  const ref = db.ref(`rooms/${currentRoom}/content`);
  let content = await ref.get();
  content = content.val();
  const key = content.currentSession;
  const responses = content[key].responses;
  if (Array.isArray(responses)) {
    return responses.some(obj => obj.student === studentName);
  }
  return false;
}