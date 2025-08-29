let contentTag = document.createElement("div");
let currentRoom;

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
    const a = createInput(studentSection, INP_STUDENT_JOIN_ID, "number", "Session code:");
    a.value = 12345;
    
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
    // header
    const h = createHeading(card, "Wait for the teacher to start the activity...");
    h.classList.replace("rounded-top-3", "rounded-3");
}

function updateSectionStudent(value) { 
    console.log(value)
}

function createSectionTeacher(roomId) { 
    contentTag.innerHTML = "";
    // title section
    const card = createCard(contentTag, `Room number [${roomId}]`);
    card.classList.remove("col-10");
    card.classList.remove("col-md-8");
    card.classList.remove("col-lg-6");
    card.classList.remove("col-xxl-4");

    //

    const div = createDiv(card);
    div.id = TEACHER_DIV_ID;
    div.className = "m-3";
}

function updateSectionTeacher(value) { 
    console.log(value)
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