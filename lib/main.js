let contentTag = document.createElement("div");

function initialize() {
    document.title = TITLE;
    document.getElementById("title").innerText = TITLE;
    contentTag = document.getElementById("main");
    mainContent();
    if (typeof startup === "function") startup();
}

function mainContent() {
    contentTag.innerHTML = "";
    const studentSection = createSmallCard(contentTag, "Student");
    const inpName = createInputSet(studentSection, INP_STUDENT_NAME_ID, "text", "Student name:");
    inpName.placeholder = "How would you like to be called?"
    const inpParent = inpName.parentElement;
    inpParent.classList.remove("mb-3");
    createInputSet(studentSection, INP_STUDENT_JOIN_ID, "number", "Room number:");
    const error = createParagraph(studentSection, "");
    error.id = STUDENT_JOIN_ERRROR_MESSAGE_ID;
    error.className = "mx-3 text-danger-emphasis";
    createButton(createButtonSection(studentSection), "Enter", joinSession);

    const teacherSection = createSmallCard(contentTag, "Teacher Area");
    createButton(createButtonSection(teacherSection), "Enter Teacher Area", createSectionTeacherForm);

    const main = document.querySelector("main");
    const modal = createDiv(main);
    createDownloadModal(modal);
}

function createSectionStudent() {
    contentTag.innerHTML = "";
    // card
    const card = createCard(contentTag);
    card.id = STUDENT_DIV_ID;
}

// TODO: Fix screen reloading when student answers
function updateSectionStudent(value) {
    console.log(canReload, value)
    const card = document.getElementById(STUDENT_DIV_ID);
    switch (value.status) {
        case 'created':
            card.innerHTML = "";
            createHeading(card, "Wait for the teacher to start the activity...");
            const p = createParagraph(card, random(arrWaitingRoom));
            p.className = "fs-5 mx-3";
            break;
        case "started":
            if (!canReload) return;
            card.innerHTML = "";
            hasResponded(currentRoom).then(studentHasResponded => {
                if (studentHasResponded) {
                    createHeading(card, "Wait for the other students to respond...");
                    const p = createParagraph(card, random(arrResponded));
                    p.className = "fs-5 mx-3";
                } else {
                    const h = createHeading(card, "");
                    h.id = STUDENT_SENTENCE_ID;
                    createInputSet(card, INP_STUDENT_RESPONSE_ID, "text");
                    createButton(createButtonSection(card), "Send", sendStudentResponse);
                    showCurrentSentence();
                }
            });
            break;
        case "responded":
            card.innerHTML = "";
            createHeading(card, "Let's see what everyone said");
            const cardsRow = createCardsRow(card);
            fillCardsResponses(cardsRow, value[value.currentSession]);
            break;
    }
}

function createSectionTeacher(roomId) {
    contentTag.innerHTML = "";
    // title section
    const card = createCard(contentTag, `Room #${roomId}`);

    // teacher controls
    const controls = createButtonGroup(createButtonSection(card));
    controls.id = TEACHER_CONTROLS_DIV_ID;
    controls.classList.add("px-3");
    controls.classList.add("pt-2");

    // teacher section
    const div = createDiv(card);
    div.id = TEACHER_DIV_ID;
    div.className = "m-3";
}

function updateSectionTeacher(value) {
    const controls = document.getElementById(TEACHER_CONTROLS_DIV_ID);
    const teacherDiv = document.getElementById(TEACHER_DIV_ID);
    controls.innerHTML = "";
    teacherDiv.innerHTML = "";

    const currentResponses = value[value.currentSession];
    switch (value.status) {
        case "created":
            createButton(controls, "Start Activity", startActivity);
            createParagraph(teacherDiv, `i{Click b{Start Activity} when your students are ready to begin.}`)
            createStudentsListDiv(teacherDiv);
            break;
        case "started":
            createButton(controls, "Show Cards to Students", studentsResponded);
            const btnText = showCards ? "Manage Students" : "Show Cards";
            createButton(controls, btnText, () => {
                showCards = !showCards;
                updateSectionTeacher(value);
                getStudents(currentRoom).then(students => fillStudentsList(students));
            });
            createExportCloseButtons(controls);

            if (currentResponses.responses) {
                const h = createHeading(teacherDiv, "Students Responses:");
                h.className = "mx-3 text-center";
                h.hidden = !showCards;
                const cardsRow = createCardsRow(teacherDiv);
                cardsRow.hidden = !showCards;

                fillCardsResponses(cardsRow, currentResponses, false);
            }

            const studentsList = createStudentsListDiv(teacherDiv);
            studentsList.className = "";
            studentsList.hidden = showCards;
            break;
        case "responded":
            createButton(controls, "New round", newSessionRound);
            createExportCloseButtons(controls);
            fillCardsResponses(createCardsRow(teacherDiv), currentResponses);
            break;
    }
}


/**
 * 
 * @param {HTMLDivElement} parent - a row div where the cards are
 * @param {{
 * sentence: String,
 * responses: {student: String, response: String}[]
 * }} value - object with the card info
 * @param {Boolean} [likeMode] 
 * 
 */
function fillCardsResponses(parent, value, likeMode = true) {
    for (const [index, resp] of value.responses.entries()) {
        const col = createCol(parent);
        const card = createCard(col);
        const likesRow = createRow(card);
        const likesCol = createCol(likesRow);
        let txt = resp.likes === 1 ? `${resp.likes} like` : `${resp.likes} likes`
        const p = createParagraph(likesCol, txt)
        p.className = "text-end my-auto"
        const btnCol = createCol(likesRow);
        btnCol.classList.replace('col', 'col-auto');
        btnCol.classList.replace('mx-auto', 'ms-auto');
        let btn;
        if (!likeMode) {
            btn = createButton(
                btnCol,
                ICON_TRASH_CAN,
                () => { removeStudentResponse(currentRoom, index) }
            );
        } else {
            const icon = resp.likedBy && resp.likedBy.includes(studentName) ? ICON_HEART_FULL : ICON_HEART_EMPTY;
            btn = createButton(
                btnCol,
                icon,
                () => {
                    toggleLike(index)
                }
            );
        }
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-sm");
        if ((resp.student == studentName || !studentName) && likeMode) {
            btn.classList.add("disabled");
        }
        const respSentence = createParagraph(card, `${value.sentence} b{${resp.response}}`);
        respSentence.className = "m-3 fs-2";
        const signature = createParagraph(card, `i{- ${resp.student}}`);
        signature.className = "m-3 fs-4 text-end text-secondary";
    }
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createStudentsListDiv(parent) {
    const div = createDiv(parent);
    div.className = "border-top pt-3";
    div.id = TEACHER_STUDENTS_LIST_DIV_ID;
    return div;
}

/**
 * 
 * @param {Array<String>} studentsList 
 */
function fillStudentsList(studentsList) {
    const div = document.getElementById(TEACHER_STUDENTS_LIST_DIV_ID);
    if (div) {
        div.innerHTML = "";
        if (!studentsList) return;
        const h = createHeading(div, "Students Joined:");
        h.className = "mx-3 text-center";
        for (let i = 0; i < studentsList.length; i++) {
            const name = studentsList[i];
            const line = createRow(div);
            const pCol = createCol(line);
            const p = createParagraph(pCol, `- ${name}`);
            p.className = "text-center";
            const btnCol = createCol(line);
            btnCol.classList.replace("col", "col-auto");
            const btn = createButton(btnCol, ICON_TRASH_CAN, () => {
                if (confirm(`Are you sure you want to remove ${name} from the list?\nThey can join back in if they want to.`))
                    removeStudentFromList(currentRoom, i);
            });
            btn.title = "Proceed with caution";
        }
    }
}

function createExportCloseButtons(parent) {
    const btn = createButton(parent, "Export");
    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", `#${MODAL_DOWNLOAD_ID}`);
    createButton(parent, "Close Session", closeCurrentRoom);
}

function createSectionTeacherForm() {
    contentTag.innerHTML = "";
    const div = createCard(contentTag, "Create New Session");

    const inpNewSessionNumber = createInputSet(div, INP_NEW_SESSION_NUMBER_ID, "number", "Enter your session number:");
    inpNewSessionNumber.value = randInt(10000, 99999);
    const inpNumberParent = inpNewSessionNumber.parentElement;
    inpNumberParent.classList.remove("mb-3");
    inpNumberParent.classList.add("mb-0");
    const pNumber = createParagraph(inpNumberParent, `i{Use a number with at least 5 digits as your code.}`);
    pNumber.className = "form-text";

    const inpPassword = createInputSet(div, INP_NEW_SESSION_PASS_ID, "password", "Enter your password:");
    const inpPasswordParent = inpPassword.parentElement;
    inpPasswordParent.classList.remove("mb-3");
    inpPasswordParent.classList.add("mb-0");
    const pPass = createParagraph(inpPasswordParent, `i{b{Do not} show students your password.}`);
    pPass.className = "form-text";
    const error = createParagraph(div, "");
    error.id = NEW_SESSION_ERROR_MESSAGE_ID;
    error.className = "mx-3 text-danger-emphasis";

    const btnGroup = createButtonGroup(createButtonSection(div));
    createButton(btnGroup, "Create", createNewSession);
    createButton(btnGroup, "Open", openExistingSession);
    createButton(btnGroup, "Back", mainContent);
}

function createDownloadModal(parent) {
    parent.innerHTML = "";
    const labelId = "modalDownloadLabel";
    const modal = createDiv(parent);
    modal.className = "modal fade";
    modal.id = MODAL_DOWNLOAD_ID;
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", labelId);
    modal.ariaLabel = true;
    const modalDialog = createDiv(modal);
    modalDialog.className = "modal-dialog";
    const modalContent = createDiv(modalDialog);
    modalContent.className = "modal-content";
    const modalHeader = createDiv(modalContent);
    modalHeader.className = "modal-header";
    const h1 = document.createElement("h1");
    h1.className = "modal-title fs-5";
    h1.id = labelId;
    h1.textContent = "Export content"
    modalHeader.appendChild(h1);
    const btnClose = createButton(modalHeader);
    btnClose.className = "btn-close";
    btnClose.setAttribute("data-bs-dismiss", "modal");
    btnClose.ariaLabel = "Close";
    const modalBody = createDiv(modalContent);
    modalBody.className = "modal-body";

    const p = createParagraph(modalBody, "Download options");
    p.className = "form-label";

    const fileTypeGroup = createDiv(modalBody);
    fileTypeGroup.className = "input-group mb-3";
    const spnFileType = createSpan(fileTypeGroup, "File Type");
    spnFileType.className = "input-group-text";

    const options = [];
    const values = [];
    for (const key in FILE_TYPES) {
        values.push(key);
        options.push(FILE_TYPES[key].name);
    }
    const selType = createSelect(fileTypeGroup, SEL_DOWNLOAD_FILE_TYPE, options, values);
    selType.onchange = changeFileType;

    const fileNameGroup = createDiv(modalBody);
    fileNameGroup.className = "input-group mb-3";
    const spnFileName = createSpan(fileNameGroup, "File name");
    spnFileName.className = "input-group-text";
    const inpFileName = createInput(fileNameGroup, "text", INP_DOWNLOAD_FILE_NAME);
    inpFileName.placeholder = "file name";
    const spnExtension = createSpan(fileNameGroup, ".");
    spnExtension.className = "input-group-text";
    spnExtension.id = SPN_DOWNLOAD_FILE_EXTENSION;
    setFileType(selType.value);

    const modalFooter = createDiv(modalContent);
    modalFooter.className = "modal-footer";
    const btnCancel = createButton(modalFooter, "Cancel");
    btnCancel.className = "btn btn-outline-secondary";
    btnCancel.setAttribute("data-bs-dismiss", "modal");
    createButton(modalFooter, "Download", exportSessionFile);
}