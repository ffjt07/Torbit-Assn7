// Variables and Constants
const type2 = $('#type2');
const evol1 = $('#evol1');
const evol2 = $('#evol2');
const evol3 = $('#evol3');
const legend1 = $('#legend1');
const legend2 = $('#legend2');
const legend3 = $('#legend3')
const errorNode = $('.error-win')
const regSubmit = $('#reg-button');
const regForm = $('#registration-form');
const confId = $('#conf-id');
const bulbCount = $('#bulb-count');
const charCount = $('#char-count');
const squirtCount = $('#squirt-count');
const pollCountClass = $('.poll-counter')
const poll = $('input[name="poll"]');
const session1 = $('input[name="session-1"]');
const session2 = $('input[name="session-2"]');
const session3 = $('input[name="session-3"]');
const evolErrorMsg = "Cannot select any Pokémon Evolution sessions if Electric, Ground, Rock, Steel, Ice, Fighting Pokémon session is selected.";
const legErrorMsg = "Cannot select Two Series Legendary Pokémon session unless Double Evolution session is also selected.";
const doubleErrorMsg = "If you are attending Double Evolution, you can only attend Two Series Legendary Pokémon session on Day 2.";
var errWinOpen = 'open';
var errMsg = 'err';
var confKey = ""
var formData = "";
var cookieData = {};

// Set local storage when registration form page is opened
if (document.title === "Registration Form") {
    localStorage.setItem(errWinOpen, 'false');
}

// Display and prepend error message and element on error window load
if (document.title === "Session Error") {
    var h3el = $('<h3>');
    if (localStorage.getItem(errMsg) === 'B') {
        h3el.text(evolErrorMsg);
        errorNode.prepend(h3el);
    }
    else if (localStorage.getItem(errMsg) === 'F') {
        h3el.text(doubleErrorMsg);
        errorNode.prepend(h3el);
    }
    else {
        h3el.text(legErrorMsg);
        errorNode.prepend(h3el);
    }
}

// Check workshop pairing to ensure user is selecting appropriate sessions
function workshopCheck() {
    if (type2.is(":checked")) {
        if (sessionTwoCheck() === true) {
            clearRadio(session2);
            if (localStorage.getItem(errWinOpen) === 'false') {
                errWindow("B");
            }
        }
        else if (legend2.is(":checked")) {
            if (localStorage.getItem(errWinOpen) === 'false') {
                legend2.prop("checked", false);
                errWindow("H");
            }
        }
    }
    if (legend2.is(":checked") && !evol3.is(":checked")) {
        if (localStorage.getItem(errWinOpen) === 'false') {
            legend2.prop("checked", false);
            errWindow("H");
        }
    }
    if ((legend1.is(":checked") || legend3.is(":checked")) && evol3.is(":checked")) {
        clearRadio(session3);
        if (localStorage.getItem(errWinOpen) === 'false') {
            errWindow("F");
        }
    }
}

// Create window and pass error message key/value into local storage
function errWindow(workshop) {
    const winHeight = 400;
    const winWidth = 500;
    let topOffset = screenY;
    let leftOffset = screenX;
    let top = topOffset + (outerHeight - winHeight) / 2;
    let left = leftOffset + (outerWidth - winWidth) / 2;
    let regerrorUrl = "regerror.html";
    let windowParams = `resizable=no,location=yes,width=${winWidth}, height=${winHeight}, left=${left}, top=${top}`;
    var errorWindow = window;

    localStorage.setItem(errWinOpen, 'true');
    if (workshop === "B") {
        localStorage.setItem(errMsg, 'B');
    }
    else if (workshop === "F") {
        localStorage.setItem(errMsg, 'F')
    }
    else {
        localStorage.setItem(errMsg, 'H');
    }
    errorWindow.open(regerrorUrl, "Error Window", windowParams);
}

// Check to see if any session 2 sessions are checked
function sessionTwoCheck() {
    isChecked = false;
    session2.each(function () {
        if ($(this).is(":checked")) {
            isChecked = true;
            return false;
        }
    });
    return isChecked;
}

// Clear session radio buttons with session name passed in
function clearRadio(radioObject) {
    $(radioObject).prop("checked", false);
}

// Removes required attribute on form if type2 is checked for form to be submitted
function evolCheck() {
    if (type2.is(":checked")) {
        evol1.removeAttr("required");
    }
}

// Closes current window and resets local storage value to show error window is no longer open
function closeWin() {
    let currWin = open(location, '_self');
    localStorage.setItem(errWinOpen, 'false');
    currWin.close();
}

// Parses form data and stores it as a cookie key:value pair with the conference id as the key
function storeCookie() {
    var name;
    var value;
    regForm.find('input[type=text]').each(function () {
        name = $(this).attr('id');
        value = $(this).val();
        if (name === "conf-id") {
            if (confId.val() === "") {
                confKey = "123456";
            }
            else {
                confKey = value;
            }
        }
        else if (value !== "") {
            if (name === "first-name") {
                formData += `${name}:${value}`;
            }
            else {
                formData += `|${name}:${value}`;
            }
        }
    });
    regForm.find('input[type=tel').each(function () {
        name = $(this).attr('id');
        value = $(this).val();
        formData += `|${name}:${value}`;
    });
    regForm.find('input[type=email]').each(function () {
        name = $(this).attr('id');
        value = $(this).val();
        formData += `|${name}:${value}`;
    });
    regForm.find('select').each(function () {
        name = $(this).attr('id');
        value = $(this).val();
        formData += `|${name}:${value}`;
    });
    session1.each(function () {
        if ($(this).is(":checked")) {
            name = $(this).attr('name');
            value = $(this).val();
            formData += `|${name}:${value}`;
        }
    });
    if (evol1.attr('required')) {
        session2.each(function () {
            if ($(this).is(":checked")) {
                name = $(this).attr('name');
                value = $(this).val();
                formData += `|${name}:${value}`;
            }
        });
    }
    else {
        formData += "|session-2:none";
    }
    session3.each(function () {
        if ($(this).is(":checked")) {
            name = $(this).attr('name');
            value = $(this).val();
            formData += `|${name}:${value}`;
        }
    });
    Cookies.set(confKey, formData);
}

// If conference ID exists, loads cookie data from ID and fills in the data on form
function loadCookie(cookieKey) {
    var cookieValue = Cookies.get(cookieKey);
    var tempArray;
    var delimeter = "|";
    var seperator = ":";
    var tempData;
    var inputName;
    var inputValue;
    var name;

    tempArray = cookieValue.split(delimeter);
    $.each(tempArray, function (index, value) {
        tempData = value.split(seperator);
        if (tempData.length === 2) {
            inputName = tempData[0];
            inputValue = tempData[1];
            cookieData[inputName] = inputValue;
        }
    });
    if (!cookieData.isEmpty) {
        regForm.find('input[type=text]').each(function () {
            name = $(this).attr('id');
            if (name in cookieData) {
                $(this).val(cookieData[name]);
            }
        });
        regForm.find('input[type=tel]').each(function () {
            name = $(this).attr('id');
            $(this).val(cookieData[name]);
        });
        regForm.find('input[type=email]').each(function () {
            name = $(this).attr('id');
            $(this).val(cookieData[name]);
        });
        regForm.find('select').each(function () {
            name = $(this).attr('id');
            $(this).val(cookieData[name]);
        });
        session1.each(function () {
            name = $(this).attr('name');
            if ($(this).attr('value') === cookieData[name]) {
                $(this).prop("checked", true);
            }
        });
        session2.each(function () {
            name = $(this).attr('name');
            if (cookieData[name] === "none") {
                return false;
            }
            else if ($(this).attr('value') === cookieData[name]) {
                $(this).prop("checked", true);
            }
        });
        session3.each(function () {
            name = $(this).attr('name');
            if ($(this).attr('value') === cookieData[name]) {
                $(this).prop("checked", true);
            }
        });
    }
}

// Displays an alert to thank user for voting and stores vote count in local storage
function thankYouAlert() {
    var countId;
    var currentCount;
    poll.each(function () {
        if ($(this).is(":checked")) {
            if ($(this).attr('id') === "bulbasaur") {
                countId = bulbCount.attr('id');
            }
            else if ($(this).attr('id') === "charmander") {
                countId = charCount.attr('id');
            }
            else {
                countId = squirtCount.attr('id');
            }
            if (JSON.parse(localStorage.getItem(countId)) === null) {
                currentCount = 0;
            }
            else {
                currentCount = JSON.parse(localStorage.getItem(countId));
            }
            currentCount++;
            localStorage.setItem(countId, JSON.stringify(currentCount));
            renderPollCount();
            
            alert("Thank you for voting for: " + $(this).val());
        }
    });
}

// Pulls vote count data from local storage and displays it on the screen
function renderPollCount() {
    var localKey;
    var currentCount;
    pollCountClass.find('span').each(function () {
        if (localStorage.length === 0 || localStorage.getItem($(this).attr('id')) === null) {
            $(this).text(0);
        }
        for (var i = 0; i < localStorage.length; i++) {
            localKey = localStorage.key(i);
            if (localKey === $(this).attr('id')) {
                currentCount = JSON.parse(localStorage.getItem(localKey));
                $(this).text(currentCount);
            }
        }
    });
}

// Focus event to call load cookie function
confId.blur(function () {
    loadCookie(confId.val());
});

// On form submission calls store cookie function
regForm.on('submit', function () {
    storeCookie();
});

// On click functions to call appropriate form checks for sessions selected
type2.on('click', function () {
    workshopCheck();
});
legend1.on('click', function () {
    workshopCheck();
})
legend2.on('click', function () {
    workshopCheck();
});
legend3.on('click', function () {
    workshopCheck();
});
evol1.on('click', function () {
    workshopCheck();
});
evol2.on('click', function () {
    workshopCheck();
});
evol3.on('click', function () {
    workshopCheck();
});
regSubmit.on('click', function () {
    evolCheck();
});

// Removes data from local storage if navigating to different page than Registration form or Error window
if (document.title !== "Registration Form") {
    if (document.title !== "Session Error") {
        localStorage.removeItem(errWinOpen);
        localStorage.removeItem(errMsg);
    } 
}

// On load of Poll page, run render poll count function
if (document.title === "Poll") {
    renderPollCount();
}
