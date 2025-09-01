let currentRoom;
let studentName = null;
let arrWaitingRoom = [];
let arrResponded = [];
let showCards = true;

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

function studentsResponded() {
    setStatus("responded");
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

/**
 * 
 * @param {Number} index 
 */
function toggleLike(index) {
    likeCard(currentRoom, index);
}

/**
 * 
 * @param {Event} e 
 */
function changeFileType(e) {
    setFileType(e.target.value);
}

/**
 * 
 * @param {String|Number} value 
 */
function setFileType(value) {
    const obj = FILE_TYPES[value];
    document.getElementById(SPN_DOWNLOAD_FILE_EXTENSION).textContent = obj.fileExtension;
}

function setFileName() {
    getRoomCreated(currentRoom).then(createdTime => {
        let fileName = `${currentRoom}_${createdTime}`;
        document.getElementById(INP_DOWNLOAD_FILE_NAME).value = fileName;
    });
}

function exportSessionFile() {
    getRoomContent(currentRoom).then((content) => {
        // console.log(JSON.stringify(content, null, 2));
        const fileKey = document.getElementById(SEL_DOWNLOAD_FILE_TYPE).value;
        // process the data
        const data = {
            content: [],
        };
        for (const session in content) {
            if (session === "status" || session === "currentSession") continue;
            data.content.push(content[session]);
        }
        let fileContent;
        switch (fileKey) {
            case "json":
                fileContent = JSON.stringify(data, null, 2);
                break;
            case "txt":
                fileContent = processTextFile(data.content);
                break;
            case "csv":
                fileContent = processCSVFile(data.content);
                break;
        }
        downloadSessionFile(fileContent, FILE_TYPES[fileKey]);
    });
}

/**
 * @param {Object[]} data 
 * @param {string} data.sentence - The sentence to be completed.
 * @param {Object[]} data.responses - Array of student responses.
 * @param {string} data.responses[].response - The response text.
 * @param {string} data.responses[].student - The student who gave the response.
 * @param {Number} data.responses[].likes - How many likes the student got.
 * @param {String[]} data.responses[].likedBy - Who liked that post.
 * @returns {String}
 */
function processTextFile(data) {
    let content = "";
    for (const session of data) {
        content += `Sentence: ${session.sentence}\nResponses:\n`
        for (const response of session.responses) {
            const txtLikes = response.likes === 1 ? "like" : "likes";
            const line = `- ${response.student}: ${response.response} (${response.likes} ${txtLikes})\n`;
            content += line;
        }
        content += "\n";
    }
    return content;
}

/**
 * @param {Object[]} data 
 * @param {string} data.sentence - The sentence to be completed.
 * @param {Object[]} data.responses - Array of student responses.
 * @param {string} data.responses[].response - The response text.
 * @param {string} data.responses[].student - The student who gave the response.
 * @param {number} data.responses[].likes - The amount of likes the post had.
 * @param {string[]} data.responses[].likedBy - Who likes the post.
 * @returns {String}
 */
function processCSVFile(data) {
    const headers = [
        "\"Sentence\"",
        "\"Response\"",
        "\"Student\"",
        "\"Likes\"",
        "\"Liked By\"",
    ];
    const content = [headers.join(",")];
    for (const session of data) {
        const sentence = `\"${session.sentence}\"`;
        for (const response of session.responses) {
            console.log(response)
            const line = [sentence];
            line.push(`\"${response.response}\"`);
            line.push(`\"${response.student}\"`);
            line.push(response.likes)
            const likedBy = response.likedBy ? `\"[${response.likedBy.join(",")}]\"` : "[]";
            line.push(likedBy)
            content.push(line.join(","));
            console.log(line)
        }
    }
    return content.join("\n");
}

/**
 * 
 * @param {string} fileContent 
 * @param {{
 * name: String,
 * type: String,
 * fileExtension: String
 * }} fileOpt 
 */
function downloadSessionFile(fileContent, fileOpt) {
    let fileName = document.getElementById(INP_DOWNLOAD_FILE_NAME).value;
    fileName += fileOpt.fileExtension;
    const blob = new Blob([fileContent], { type: fileOpt.type });
    const link = document.createElement("a");
    link.download = fileName;
    if (webkitURL != null) {
        link.href = webkitURL.createObjectURL(blob);
    } else {
        link.href = URL.createObjectURL(blob);
        link.onclick = destroyClickedElement;
        link.style.display = "none";
        document.body.appendChild(link);
    }
    link.click();
}