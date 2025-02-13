const type2 = $('#type2');
const evol1 = $('#evol1');
const evol2 = $('#evol2');
const evol3 = $('#evol3');
const legend2 = $('#legend2');
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
var errWinOpen = 'open';
var errMsg = 'err';
var confKey = ""
var formData = "";
var cookieData = {};

if (document.title === "Registration Form") {
    localStorage.setItem(errWinOpen, 'false');
}

if (document.title === "Session Error") {
    var h3el = $('<h3>');
    if (localStorage.getItem(errMsg) === 'B') {
        h3el.text(evolErrorMsg);
        errorNode.prepend(h3el);
    }
    else {
        h3el.text(legErrorMsg);
        errorNode.prepend(h3el);
    }
}

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
}


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
    else {
        localStorage.setItem(errMsg, 'H');
    }
    errorWindow.open(regerrorUrl, "Error Window", windowParams);
}

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

function clearRadio(radioObject) {
    $(radioObject).prop("checked", false);
}

function evolCheck() {
    if (type2.is(":checked")) {
        evol1.removeAttr("required");
    }
}

function closeWin() {
    let currWin = open(location, '_self');
    localStorage.setItem(errWinOpen, 'false');
    currWin.close();
}

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

confId.blur(function () {
    loadCookie(confId.val());
});

regForm.on('submit', function () {
    storeCookie();
});

type2.on('click', function () {
    workshopCheck();
});
legend2.on('click', function () {
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

if (document.title !== "Registration Form") {
    if (document.title !== "Session Error") {
        localStorage.removeItem(errWinOpen);
        localStorage.removeItem(errMsg);
    } 
}

if (document.title === "Poll") {
    renderPollCount();
}
