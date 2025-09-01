/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createDiv(parent) {
    const div = document.createElement("div");
    parent.appendChild(div);
    return div;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} text 
 * @returns {HTMLHeadingElement}
 */
function createHeading(parent, text) {
    const h = document.createElement("h3");
    h.className = "text-center border rounded-top-3 p-2 text-bg-secondary";
    h.innerHTML = formatTextToHTML(text);
    parent.appendChild(h);
    return h;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} [title] 
 * @returns {HTMLDivElement}
 */
function createCard(parent, title) {
    const div = createDiv(parent);
    div.className = "border border-2 rounded-3 my-3 mx-auto";
    if (title) createHeading(div, title);
    return div;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} title 
 * @returns {HTMLDivElement}
 */
function createSmallCard(parent, title) {
    const div = createCard(parent, title);
    div.classList.add("col-10");
    div.classList.add("col-md-8");
    div.classList.add("col-lg-6");
    div.classList.add("col-xxl-4");
    return div;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} id 
 * @param {String} type 
 * @param {String} [textLabel] 
 * @returns {HTMLInputElement}
 */
function createInputSet(parent, id, type, textLabel) {
    const div = createDiv(parent);
    div.className = "px-3 my-2";
    if (textLabel) {
        createLabel(div, textLabel, id);
    }
    const input = createInput(div, type, id);
    return input;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} [type] - button | checkbox | color | date | datetime-local | email | file | hidden | image | month | number | password | radio | range | reset | search | submit | tel | text | time | url | week
 * @param {String} [id] 
 * @returns {HTMLInputElement}
 */
function createInput(parent, type = "text", id) {
    const input = document.createElement("input");
    input.type = type;
    input.className = "form-control";
    if (id) {
        input.id = id;
        input.name = id;
    }
    parent.appendChild(input);
    return input;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} text 
 * @param {String} [htmlFor] 
 * @returns {HTMLLabelElement}
 */
function createLabel(parent, text, htmlFor) {
    const label = document.createElement("label");
    label.className = "form-label";
    label.textContent = text;
    if (htmlFor) label.htmlFor = htmlFor;
    parent.appendChild(label);
    return label;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} [text] - can be formated as HTML
 * @returns {HTMLSpanElement}
 */
function createSpan(parent, text) {
    const span = document.createElement("span");
    span.innerHTML = text;
    parent.appendChild(span);
    return span;
}

/**
 * 
 * @param {HTMLDivElement} parent - parent Element
 * @param {String} id - Element id
 * @param {Array<String|Number>} options - an array with the options. if no values are provided, this array is also the values
 * @param {Array<String|Number>} [values] - an array with the values for the options
 * @param {Number} [selected] - index of the selected value. default is 0
 * @param {String} [ariaLabel] - aria-label attibute
 * @returns {HTMLSelectElement}
 */
function createSelect(parent, id, options, values, selected = 0, ariaLabel) {
    const select = document.createElement("select");
    select.className = "form-select";
    select.id = id;
    if (ariaLabel) select.ariaLabel = ariaLabel;
    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("option");
        option.text = options[i];
        option.value = values ? values[i] : options[i];
        option.selected = selected == i;
        select.appendChild(option);
    }
    parent.appendChild(select);
    return select;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createButtonSection(parent) {
    const row = createRow(parent);
    const col = createCol(row);
    col.classList.replace("col", "col-auto");
    return col;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createRow(parent) {
    const row = createDiv(parent);
    row.className = "row mb-3";
    return row;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createCol(parent) {
    const col = createDiv(parent);
    col.className = "col mx-auto my-auto";
    return col;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createButtonGroup(parent) {
    const group = createDiv(parent);
    group.className = "btn-group";
    return group;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String|HTMLElement} [text] 
 * @param {Function} [callback] 
 * @returns {HTMLButtonElement}
 */
function createButton(parent, text = "", callback) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = text;
    btn.className = "btn btn-secondary";
    if (callback) btn.onclick = callback;
    parent.appendChild(btn);
    return btn;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} href 
 * @param {String} target 
 * @param {String} title 
 * @returns {HTMLAnchorElement}
 */
function createLinkButton(parent, href, target = "_blank", title = "") {
    const link = document.createElement("a");
    link.href = href;
    link.target = target;
    link.title = title;
    parent.appendChild(link);
    return link;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @param {String} iconClass 
 * @returns {HTMLElement}
 */
function createIcon(parent, iconClass) {
    const icon = document.createElement("i");
    icon.className = iconClass;
    parent.appendChild(icon);
    return icon;
}

/**
 * use b{...} for bold
 * use d{...} for deleted
 * use i{...} for italic
 * use s{...} for fine print
 * use u{...} for underline
 * \n breaks the line
 * @param {HTMLDivElement} parent 
 * @param {String} text can have HTML tags
 * @returns {HTMLParagraphElement}
 */
function createParagraph(parent, text = "") {
    const p = document.createElement("p");
    p.innerHTML = formatTextToHTML(text);
    parent.appendChild(p);
    return p;
}

/**
 * use b{...} for bold
 * use d{...} for deleted
 * use i{...} for italic
 * use s{...} for fine print
 * use u{...} for underline
 * \n breaks the line
 * @param {String} text - can have HTML tags
 * @returns {String}
 */
function formatTextToHTML(text = "") {
    const replacements = [
        { key: "b", tag: "<strong>" },
        { key: "d", tag: "<del>" },
        { key: "i", tag: "<em>" },
        { key: "s", tag: "<small>" },
        { key: "u", tag: "<u>" },
    ]
    // tranforms all line breaks into <br>
    text = text.replaceAll("\n", "<br>");

    // handles the other replacements
    for (const r of replacements) {
        const key = `${r.key}{`
        const indexes = stringFindAll(text, key);
        for (let i = indexes.length - 1; i >= 0; i--) {
            const index = indexes[i];
            let closingIndex = text.indexOf("}", index + 1);
            if (closingIndex == -1) closingIndex = text.length - 1;
            text = stringSplice(text, closingIndex, 1, r.tag.replace("<", "</"));
            text = stringSplice(text, index, key.length, r.tag);
        }
    }
    return text;
}

/**
 * 
 * @param {HTMLDivElement} parent 
 * @returns {HTMLDivElement}
 */
function createCardsRow(parent) {
    const cardsRow = createRow(parent);
    cardsRow.classList.add("row-cols-1");
    cardsRow.classList.add("row-cols-md-2");
    cardsRow.classList.add("row-cols-xl-3");
    cardsRow.classList.add("px-3");
    return cardsRow
}