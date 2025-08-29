let sentences = [];
let waitingRoom = [];

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
    const sessionNumber = document.getElementById(INP_STUDENT_JOIN_ID).value;
    if (!errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Enter a room code.", !sessionNumber)) {
        checkRoom(sessionNumber).then(roomExists => {
            if (!errorMessage(STUDENT_JOIN_ERRROR_MESSAGE_ID, "Room does not exist.", !roomExists)) {
                joinRoomAsStudent(sessionNumber);
            }
        })
    }
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
    const response = await fetch(SENTENCES_URL);
    const txt = await response.text();
    sentences = txt.split("\n");
    shuffle(sentences);
}

async function getWaitingRoom() {
    const response = await fetch(WAITING_ROOM_URL);
    const txt = await response.text();
    waitingRoom = txt.split("\n");
}

function startActivity() {

}