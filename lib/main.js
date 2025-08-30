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
    const studentSection = createCard(contentTag, "Student");
    const inpName = createInput(studentSection, INP_STUDENT_NAME_ID, "text", "Student name:");
    const inpParent = inpName.parentElement;
    inpParent.classList.remove("mb-3");
    createInput(studentSection, INP_STUDENT_JOIN_ID, "number", "Session code:");
    
    const error = createParagraph(studentSection, "");
    error.id = STUDENT_JOIN_ERRROR_MESSAGE_ID;
    error.className = "mx-3 text-danger-emphasis";
    createButton(createButtonSection(studentSection), "Enter", joinSession);

    const teacherSection = createCard(contentTag, "Teacher Area");
    createButton(createButtonSection(teacherSection), "Enter Teacher Area", createSectionTeacherForm);
}

function createSectionStudent() {
    contentTag.innerHTML = "";
    // card
    const card = createDiv(contentTag);
    card.classList.remove("col-10");
    card.classList.remove("col-md-8");
    card.classList.remove("col-lg-6");
    card.classList.remove("col-xxl-4");
    card.id = STUDENT_DIV_ID;
}

function updateSectionStudent(value) {
    console.log("Student section")
    console.log(value)
    const card = document.getElementById(STUDENT_DIV_ID);
    card.innerHTML = "";
    switch (value.status) {
        case 'created':
            createHeading(card, "Wait for the teacher to start the activity...");
            const p = createParagraph(card, random(waitingRoom));
            p.className = "fs-5 mx-3";
            break;
        case "started":
            const h = createHeading(card, "");
            h.id = STUDENT_SENTENCE_ID;
            createInput(card, INP_STUDENT_RESPONSE_ID, "text");
            createButton(createButtonSection(card), "Send", sendSentence);
            showStudentSentence();
            break;
        case "responded":

            break;
    }
}

function createSectionTeacher(roomId) {
    contentTag.innerHTML = "";
    // title section
    const card = createCard(contentTag, `Room number [${roomId}]`);
    card.classList.remove("col-10");
    card.classList.remove("col-md-8");
    card.classList.remove("col-lg-6");
    card.classList.remove("col-xxl-4");

    // teacher controls
    const controls = createButtonGroup(createButtonSection(card));
    controls.id = TEACHER_CONTROLS_DIV_ID;

    // teacher section
    const div = createDiv(card);
    div.id = TEACHER_DIV_ID;
    div.className = "m-3";
}

function updateSectionTeacher(value) {
    console.log("Teacher Section")
    console.log(value)
    const controls = document.getElementById(TEACHER_CONTROLS_DIV_ID);
    const teacherDiv = document.getElementById(TEACHER_DIV_ID);
    controls.innerHTML = "";
    teacherDiv.innerHTML = "";
    switch (value.status) {
        case "created":
            createButton(controls, "Start Activity", startActivity);
            createParagraph(teacherDiv, `i{Click b{Start Activity} when your students are ready to begin.}`)
            break;
        case "started":
            createButton(controls, "Show responses");
            createExportCloseButtons(controls);
            break;
        case "responded":
            createButton(controls, "Next sentence");
            createExportCloseButtons(controls);
            break;
    }
}

function createExportCloseButtons(parent) {
    createButton(parent, "Export", null);
    createButton(parent, "Close", null);
}

function createSectionTeacherForm() {
    contentTag.innerHTML = "";
    const div = createCard(contentTag, "Create New Session");

    const inpNewSessionNumber = createInput(div, INP_NEW_SESSION_NUMBER_ID, "number", "Enter your session number:");
    inpNewSessionNumber.value = randInt(10000, 99999);
    const inpNumberParent = inpNewSessionNumber.parentElement;
    inpNumberParent.classList.remove("mb-3");
    inpNumberParent.classList.add("mb-0");
    const pNumber = createParagraph(inpNumberParent, `i{Use a number with at least 5 digits as your code.}`);
    pNumber.className = "form-text";

    const inpPassword = createInput(div, INP_NEW_SESSION_PASS_ID, "password", "Enter your password:");
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
