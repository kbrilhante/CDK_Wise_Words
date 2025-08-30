/**
 * 
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns 
 */
function includesAny(array1, array2) {
    for (const element of array2) {
        if (array1.includes(element)) return true;
    }
    return false;
}

/**
 * 
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns 
 */
function includesAll(array1, array2) {
    for (const element of array2) {
        if (!array1.includes(element)) return false;
    }
    return true;
}

/**
 * 
 * @param {Set} set 
 */
function setToArray(set) {
    let arr = [];
    for (const value of set.values()) {
        arr.push(value);
    }
    return arr;
}

/**
 * Checks whether an array contains an object that matches another object
 * on a given set of keys.
 *
 * @template T
 * @param {T[]} array - The array of objects to search.
 * @param {Partial<T>} object - The object with key-value pairs to match.
 * @param {Array<keyof T>} keys - The keys to compare between items in the array and the target object.
 * @returns {boolean} `true` if at least one object in the array matches all the provided keys, otherwise `false`.
 *
 * @example
 * const arr = [
 *   { name: "apple", type: "fruit", color: "red" },
 *   { name: "carrot", type: "vegetable", color: "orange" }
 * ];
 *
 * arrayHasObject(arr, { name: "apple", type: "fruit" }, ["name", "type"]);
 * // => true
 *
 * arrayHasObject(arr, { name: "apple", type: "vegetable" }, ["name", "type"]);
 * // => false
 */

function arrayHasObject(array, object, keys) {
    return array.some(element =>
        keys.every(key => element[key] === object[key])
    );
}

/**
 * Finds the index of the first object in an array that matches another object
 * on a given set of keys.
 *
 * @template T
 * @param {T[]} array - The array of objects to search.
 * @param {Partial<T>} object - The object with key-value pairs to match.
 * @param {Array<keyof T>} keys - The keys to compare between items in the array and the target object.
 * @returns {number} The index of the matching object, or -1 if no match is found.
 *
 * @example
 * const arr = [
 *   { name: "apple", type: "fruit", color: "red" },
 *   { name: "carrot", type: "vegetable", color: "orange" }
 * ];
 *
 * arrayFindIndexByKeys(arr, { name: "carrot", type: "vegetable" }, ["name", "type"]);
 * // => 1
 *
 * arrayFindIndexByKeys(arr, { name: "apple", type: "vegetable" }, ["name", "type"]);
 * // => -1
 */
function arrayFindIndexByKeys(array, object, keys) {
    return array.findIndex(item =>
        keys.every(key => item[key] === object[key])
    );
}

/**
 * 
 * @param {Array} array 
 * @param {String} key 
 */
function arraySortByKey(array, key) {
    if (typeof array[0][key] === "string") array.sort((a, b) => { return a[key].localeCompare(b[key]); });
    if (typeof array[0][key] === "number") array.sort((a, b) => { return a - b; });
}

/**
 * 
 * @param {Number|Array} [a] 
 * @param {Number} [b] 
 * @returns {Number}
 */
function random(a, b) {
    if (a == undefined && b == undefined) return Math.random();
    if (Array.isArray(a)) {
        const index = randInt(a.length);
        return a[index];
    }
    if (b == undefined) return Math.random() * a;
    const min = Math.min(a, b);
    let max = Math.max(a, b);
    return Math.random() * (max - min) + min;
}

/**
 * 
 * @param {Number} n 
 * @returns {Number}
 */
function floor(n) {
    return Math.floor(n);
}

/**
 * 
 * @param {Number} a 
 * @param {Number} [b] 
 * @returns {Number}
 */
function randInt(a, b) {
    if (!b) return floor(random(a));
    return floor(random(Math.min(a, b), Math.max(a, b) + 1));
}



/**
 * 
 * @param {String} str 
 * @param {Number} start 
 * @param {Number} [deleteCount] 
 * @param {String} [replacement] 
 * @returns {String}
 */
function stringSplice(str, start, deleteCount = str.length - start, replacement = "") {
    let newStr = str.substring(0, start);
    newStr += replacement;
    newStr += str.substring(start + deleteCount);
    return newStr;
}

/**
 * 
 * @param {String} str 
 * @param {String} searchString 
 * @returns {Array<Number>}
 */
function stringFindAll(str, searchString) {
    let response = [];
    let index = -1;
    while (true) {
        index = str.indexOf(searchString, index + 1);
        if (index == -1) return response;
        response.push(index);
    }
}

/**
 * shuffles an array
 * @param {Array} arr 
 */
function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const dice = randInt(i + 1);
        const aux = arr[i];
        arr[i] = arr[dice];
        arr[dice] = aux;
    }
}

/**
 * 
 * @param {String} url 
 * @returns {Array<String>}
 */
async function getTextFile(url) {
    const response = await fetch(url);
    let text = await response.text();
    text = text.trim();
    text = text.split("\n");
    return text;
}