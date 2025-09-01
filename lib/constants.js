const TITLE = "Wise Words";

const FILE_TYPES = {
    csv: {
        name: "CSV",
        type: "text/csv",
        fileExtension: ".csv",
    },
    json: {
        name: "JSON",
        type: "application/json",
        fileExtension: ".json",
    },
    txt: {
        name: "Text",
        type: "text/plain;charset=utf-8",
        fileExtension: ".txt",
    },
}

const SENTENCES_URL = "./data/English/WiseWords.txt";
const WAITING_ROOM_URL = "./data/English/waitingRoom.txt";
const RESPONDED_URL = "./data/English/responded.txt";

const INP_STUDENT_JOIN_ID = "inpStudentJoin";
const INP_STUDENT_NAME_ID = "inpStudentName";
const STUDENT_JOIN_ERRROR_MESSAGE_ID = "studentJoinError";
const INP_NEW_SESSION_NUMBER_ID = "inpNewSessionNumber";
const INP_NEW_SESSION_PASS_ID = "inpNewSessionPass";
const NEW_SESSION_ERROR_MESSAGE_ID = "newSessionError";
const STUDENT_DIV_ID = "studentDiv";
const TEACHER_DIV_ID = "teacherDiv";
const TEACHER_CONTROLS_DIV_ID = "teacherControls";

const TEACHER_STUDENTS_LIST_DIV_ID = "studentsList";

const STUDENT_SENTENCE_ID = "studentSentence";
const INP_STUDENT_RESPONSE_ID = "studentResponse";

const MODAL_DOWNLOAD_ID = "modalDownload";
const DOWNLOAD_OPTIONS_GROUP_ID = "downloadFileGroup";
const SEL_DOWNLOAD_FILE_TYPE = "downloadFileSelect";
const INP_DOWNLOAD_FILE_NAME = "downloadFileName";
const SPN_DOWNLOAD_FILE_EXTENSION = "downloadFileSpan";

const ICON_HEART_EMPTY = `<i class="fa-regular fa-heart"></i>`;
const ICON_HEART_FULL = `<i class="fa-solid fa-heart"></i>`;
const ICON_TRASH_CAN = `<i class="fa-solid fa-trash-can"></i>`

const debugMode = true;
const teacherMode = true;
const debugRoom = "20000";
const debugName = "Dummy";