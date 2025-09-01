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
debug();
function debug() {
  if (debugMode) {
    setTimeout(() => {
      if (teacherMode) {
        checkRoom(debugRoom).then(exists => {
          if (!exists) {
            createRoom(debugRoom, "aaaa");
          } else {
            joinRoomAsTeacher(debugRoom);
          }
        });
      } else {
        studentExists(debugRoom, debugName).then(exists => {
          if (exists) {
            studentName = debugName;
            getTextFile(RESPONDED_URL).then(arr => arrResponded = arr);
            joinRoomAsStudent(debugRoom);
          } else {
            document.getElementById(INP_STUDENT_NAME_ID).value = debugName;
            document.getElementById(INP_STUDENT_JOIN_ID).value = debugRoom;
            joinSession();
          }
        });
      }
    }, 1000);
  }
}

/**
 * 
 * @param {String} roomId 
 * @returns {boolean} true if the room exists
 */
async function checkRoom(roomId) {
  const ref = db.ref(`rooms/${roomId}`);
  const response = await ref.get();
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

async function getRoomCreated(roomId) {
  const ref = db.ref(`rooms/${roomId}/created`)
  const created = await ref.get();
  return created.val();
}

/**
 * 
 * @param {String|Number} roomId 
 */
function joinRoomAsTeacher(roomId) {
  studentName = null;
  createSectionTeacher(roomId);
  createRoomEvent(roomId, updateSectionTeacher);
  setFileName();
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
async function getStudents(roomId) {
  const ref = db.ref(`rooms/${roomId}/students`)
  let students = await ref.get();
  return students.val();
}

/**
 * 
 * @param {Number} index 
 */
async function removeStudentFromList(roomId, index) {
  const ref = db.ref(`rooms/${roomId}/students`);
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
    createStudentsEvent(roomId);
    callback(snapshot.val());
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
  ref.on("value", snapshot => {
    if (!studentName) {
      fillStudentsList(snapshot.val());
    } else if (snapshot.exists()) {
      checkStudentDeleted();
    }
  });
}

async function removeStudentsEvent(roomId) {
  const ref = db.ref(`rooms/${roomId}/students`);
  await ref.off();
}

/**
 * 
 * @param {String} roomId 
 * @param {String} newStatus 
 */
function setStatus(roomId, newStatus) {
  const ref = db.ref(`rooms/${roomId}/content`);
  ref.update({ status: newStatus });
}

/**
 * 
 * @param {String} roomId 
 * @returns {String}
 */
async function getStatus(roomId) {
  const ref = db.ref(`rooms/${roomId}/content/status`);
  const snapshot = await ref.get()
  return snapshot.val()
}

/**
 * 
 * @returns {String}
 */
async function getNewSentence(roomId) {
  const ref = db.ref(`rooms/${roomId}/sentences`);
  let sentences = await ref.get();
  sentences = sentences.val();
  const selectedSentence = sentences.shift();
  await ref.set(sentences);
  return selectedSentence;
}

/**
 * 
 * @param {String} roomId 
 * @param {String} newSentence 
 * @returns 
 */
async function setNewSentence(roomId, newSentence) {
  const ref = db.ref(`rooms/${roomId}/content`);
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
async function getCurrentSentence(roomId) {
  let key = await getCurrentSession(roomId);
  const ref = db.ref(`rooms/${roomId}/content/${key}/sentence`);
  const sentence = await ref.get();
  return sentence.val();
}

/**
 * 
 * @param {String|Number} roomId 
 * @returns {String}
 */
async function getCurrentSession(roomId) {
  const ref = db.ref(`rooms/${roomId}/content/currentSession`);
  const key = await ref.get();
  return key.val();
}

async function renewSession(roomId) {
  const ref = db.ref(`rooms/${roomId}/content`);
  let content = await ref.get();
  content = content.val();
  const updates = {
    currentSession: "none",
    status: "created",
  };
  ref.update(updates);
}

/**
 * 
 * @param {String} studentResponse 
 */
async function addStudentResponse(roomId, studentResponse) {
  const key = await getCurrentSession(roomId);
  const ref = db.ref(`rooms/${roomId}/content/${key}/responses`);
  const response = {
    student: studentName,
    response: studentResponse,
    likes: 0,
    likedBy: [],
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

/**
 * 
 * @param {String} roomId 
 * @param {Number} index 
 */
async function removeStudentResponse(roomId, index) {
  const ref = db.ref(`rooms/${roomId}/content`);
  let content = await ref.get();
  content = content.val();
  const key = content.currentSession;
  const responses = content[key].responses;
  if (confirm(`Are you sure you want to delete ${responses[index].student}'s response?`)) {
    responses.splice(index, 1);
    ref.child(key).child('responses').set(responses);
  }
}

async function hasResponded(roomId) {
  const ref = db.ref(`rooms/${roomId}/content`);
  let content = await ref.get();
  content = content.val();
  const key = content.currentSession;
  const session = key ? content[key] : null;
  const responses = session ? session.responses : null;
  if (Array.isArray(responses)) {
    return responses.some(obj => obj.student === studentName);
  }
  return false;
}

/**
 * 
 * @param {String|Number} roomId 
 * @returns {Object}
 */
async function getRoomContent(roomId) {
  const ref = db.ref(`rooms/${roomId}/content`);
  const content = await ref.get();
  return content.val();
}

/**
 * 
 * @param {String|Number} roomId - room code
 * @param {Number} index - card index
 * @param {Number} value - 1 = like | -1 = undo like
 */
async function likeCard(roomId, index) {
  const sessionKey = await getCurrentSession(roomId);
  const ref = db.ref(`rooms/${roomId}/content/${sessionKey}/responses/${index}`);
  let response = await ref.get();
  response = response.val();
  let likedBy = [];
  let value;
  if (!response.likedBy) {
    likedBy = [studentName];
    value = 1;
  } else {
    likedBy = response.likedBy;
    if (likedBy.includes(studentName)) {
      value = -1;
      arrayRemoveByValue(likedBy, studentName);
    } else {
      value = 1;
      likedBy.push(studentName);
      likedBy.sort((a, b) => a.localeCompare(b));
    }
  }

  const updates = {}
  updates[`likedBy`] = likedBy;
  updates[`likes`] = firebase.database.ServerValue.increment(value);
  ref.update(updates);
}

function closeRoom(roomId) {
  removeRoomEvent(roomId).then(() => {
    removeStudentsEvent(roomId).then(() => {
      const ref = db.ref(`rooms/${roomId}`);
      ref.remove();
    })
  })
}

async function thing() {
  const ref = db.ref("rooms/12345/content/-OYxeweb3jOFIRQ3rUsj/responses");
  let resp = await ref.get();
  resp = resp.val()
  for (const r of resp) {
    r.likes = 0;
    r.likedBy = [];
  }
  ref.set(resp)
}
// thing()