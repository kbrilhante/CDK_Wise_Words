let currentRoom;
let studentName = null;
let arrWaitingRoom = [];
let arrResponded = [];

function startup() { }

function createNewSession() {
    const fields = checkAdminFields();
    if (fields) {
        checkRoom(fields.sessionNumber).then(roomExists => {
            const txtError = `Room already exists.\nIf you are the admin, type the correct password and click b{Open}.`;
            if (!errorMessage(NEW_SESSION_ERROR_MESSAGE_ID, txtError, roomExists))
                createRoom(fields.sessionNumber, fields.sessionAdminPass);
        });
    }
}

function openExistingSession() {
    const fields = checkAdminFields();
    if (fields) {
        checkRoom(fields.sessionNumber).then(roomExists => {
            let txtError = `Room does not exist.\nTo create a new session with this number, type your password and click b{Create}.`;
            if (!errorMessage(NEW_SESSION_ERROR_MESSAGE_ID, txtError, !roomExists)) {
                checkRoomPass(fields.sessionNumber, fields.sessionAdminPass).then(pass => {
                    txtError = `Incorrect password.`;
                    if (!errorMessage(NEW_SESSION_ERROR_MESSAGE_ID, txtError, !pass)) {
                        joinRoomAsTeacher(fields.sessionNumber);
                    }
                });
            }
        });
    }
}

function joinSession() {
    const inpStudentName = document.getElementById(INP_STUDENT_NAME_ID).value.trim();
    const sessionNumber = document.getElementById(INP_STUDENT_JOIN_ID).value;
    if (errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Enter your name and the room code.", !(inpStudentName || sessionNumber))) return;
    if (errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Enter your name.", !inpStudentName)) return;
    if (errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Enter the room code.", !sessionNumber)) return;
    checkRoom(sessionNumber).then(roomExists => {
        if (!errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Room does not exist.", !roomExists)) {
            studentExists(sessionNumber, inpStudentName).then(studentExists => {
                const txt = "Student name already in the room. Pick a different name or ask your teacher to remove your name from the list.";
                if (!errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, txt, studentExists)) {
                    studentName = inpStudentName;
                    getTextFile(RESPONDED_URL).then(arr => arrResponded = arr);
                    joinRoomAsStudent(sessionNumber);
                }
            });
        }
    })
}

function checkAdminFields() {
    const sessionNumber = document.getElementById(INP_NEW_SESSION_NUMBER_ID).value;
    if (errorMessage(NEW_SESSION_ERROR_MESSAGE_ID, "Enter a valid session code.", sessionNumber.length < 5)) return false;
    const sessionAdminPass = document.getElementById(INP_NEW_SESSION_PASS_ID).value;
    if (errorMessage(NEW_SESSION_ERROR_MESSAGE_ID, "Enter a password.", !sessionAdminPass)) return false;
    const obj = {
        sessionNumber: sessionNumber,
        sessionAdminPass: sessionAdminPass,
    }
    return obj;
}

/**
 * 
 * @param {String} paragraphId - id of the \<p> tag that shows the error message
 * @param {String} message - unformated error message
 * @param {boolean} valueCheck - expression that should trigger the error when true
 * @returns {boolean} valuecheck
 */
function errorMessage(paragraphId, message, valueCheck) {
    const error = document.getElementById(paragraphId);
    error.innerHTML = "";
    if (valueCheck) {
        error.innerHTML = formatTextToHTML(`i{${message}}`);
    }
    return valueCheck;
}

async function getSentences() {
    const sentences = await getTextFile(SENTENCES_URL);
    shuffle(sentences);
    return sentences;
}

async function getWaitingRoom() {
    arrWaitingRoom = await getTextFile(WAITING_ROOM_URL);
}

function startActivity() {
    setStatus("started");
    getNewSentence().then(sentence => {
        setNewSentence(sentence);
    });
}

function showCurrentSentence() {
    getCurrentSentence().then(sentence => {
        const sentenceHeader = document.getElementById(STUDENT_SENTENCE_ID);
        sentenceHeader.innerText = sentence;
    });
}

function sendStudentResponse() {
    const response = document.getElementById(INP_STUDENT_RESPONSE_ID).value.trim();
    if (response) addStudentResponse(response);

}

function checkStudentDeleted() {
    studentExists(currentRoom, studentName).then(exists => {
        if (!exists) {
            alert("Student was removed from the room. Please login again.");
            studentName = null;
            removeRoomEvent(currentRoom);
            removeStudentsEvent(currentRoom);
            mainContent();
        }
    });
}