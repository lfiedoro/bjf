// czy nie lepiej zroić e ten sposób, że po mianie daty przy entry automatycznie pojawi
// się znaczegi migracji, a w rozwijanym menu nie będzie opcji migrate
//tą zmienną dodawć do headerów w fetchu
token = undefined;


/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList} 
 */
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}


const addListenersToMenuButtons = () => {
    const menuButtons = document.querySelectorAll('#log-buttons .item');
    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');
    const backlogButton = document.querySelector('#back-button');
    const irrelevantButton = document.querySelector('#irr-button');
    const addNewEntryButton = document.querySelector('#add-new-button');

    addListenerToOneMenuButton(dailyButton, initDailyLog, menuButtons);
    addListenerToOneMenuButton(monthlyButton, initMonthlyLog, menuButtons);
    addListenerToOneMenuButton(backlogButton, initBacklog, menuButtons);
    addListenerToOneMenuButton(irrelevantButton, initIrrelevant, menuButtons);
    addListenerToOneMenuButton(addNewEntryButton, initEntryForm, menuButtons)
}
const addListenerToOneMenuButton = (buttonName, callbackFunc, allMenuButtons) => {
    buttonName.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        allMenuButtons.forEach(button => button.classList.remove('active'));
        buttonName.classList.add('active');
        callbackFunc();
    })
}
const addListenersToFormButtons = () => {
    let sendBtn = document.querySelector('.loginbtn');
    if (sendBtn) sendBtn.addEventListener('click', send);
    let clearBtn = document.querySelector('.resetbtn');
    if (clearBtn) clearBtn.addEventListener('click', reset);
};

const initEntryForm = () => {
    document.querySelector('#task-table').innerHTML = " ";
    const entryFormHtml = createEntryFormHtml();
    const table = document.querySelector('#task-table');
    table.appendChild(htmlToElement(entryFormHtml));
    addListenersToFormButtons();
};
const reset = (e) => {
    e.preventDefault();
    document.querySelector('#entry-form').reset();
};

const getRadioTypeInput = (radioId) => {
    const radio = document.querySelector(radioId).querySelectorAll('input[type=radio]');
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            return radio[i].value;
        }
    }
};

const send = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const type = getRadioTypeInput('#type-radio');
    const significant = getRadioTypeInput('#sign-radio');
    const date = document.querySelector('.entry-date').value;
    const description = document.querySelector('.description').value;

    let body = {
        "entryType": type,
        "taskState": "incomplete",
        "significationType": significant,
        "date": date,
        "body": description
    };

    fetch('http://localhost:3030/api/entries/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body),
    }).then(resp => console.log(resp))
        .catch(err => console.log(err));
    document.querySelector('#entry-form').reset();
};

const createEntryFormHtml = () => {
    return `
    <div class="ui middle aligned center aligned grid">
        <div class="column">
            <form id="entry-form" class="ui large form">
                <div class="ui segment">
                    <div class="field inline" hidden>
                        <label>Id </label>
                        <input type="text" class="id"></input>
                    </div>
                    <div id="type-radio" class="inline fields">
                        <label>Select type</label>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="entryType" value="task" tabindex="0" checked>
                                <label>task</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="entryType" value="note" tabindex="0">
                                <label>note</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="entryType" value="event" tabindex="0">
                                <label>event</label>
                            </div>
                        </div>
                    </div>
                    <div id="sign-radio" class="inline fields">
                        <label>Select signification</label>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="significationType" value="none" tabindex="0" checked>
                                <label>none</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="significationType" value="priority" tabindex="0">
                                <label>priority</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="significationType" value="inspiration" tabindex="0">
                                <label>inspiration</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>Description </label>
                        <textarea type="text" class="description" rows="3" value=""></textarea>
                    </div>
                    <div class="inline field">
                        <label>Date </label>
                        <input class="entry-date" type="date" name="date" min="${new Date().toJSON().slice(0, 10)}"></input>
                    </div>
                </div>
                <button class="ui large button submit blue loginbtn">Add</button>
                <button class="ui large button clear resetbtn ">Clear</button>
            </form>
        </div>
    </div>`;
}

const createNavBarForMonthlyAndDailyLog = (monthOrFullDate) => {
    const html = createNavBarForMonthlyAndDailyLogHtml(monthOrFullDate);
    const htmlToPut = htmlToElement(html);
    putTaskIntoHTML(htmlToPut);
    addListenersForMonthlyDailyNavbar();
};

const createNavBarForMonthlyAndDailyLogHtml = (monthOrFullDate) => {
    return `
          <tr class="nav-bar"> 
            <td class="collapsing">
                <div class="ui icon button" id="previous-day">
                    <i class="arrow left icon"></i>
                </div>
            </td>
            <td >
            ${createChangeDateButton("", "new-log-date", " ", "date-picker")}
            </td>
            <td class="day-or-month center aligned"><h2>${monthOrFullDate}</h2></td>
            <td class="collapsing">
                 <div class="ui icon button" id="next-day">
                    <i class="arrow right icon"></i>
                </div>
            </td>
        </tr>
    `;
}


const addListenersForMonthlyDailyNavbar = () => {
    const previousButton = document.querySelector('#previous-day');
    const nextButton = document.querySelector('#next-day');
    const calendarButton = document.querySelector('#date-picker');

    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');
    const currentDisplayedDate = new Date(document.querySelector('.day-or-month').textContent);


    if (dailyButton.className.includes('active')) {
        calendarButton.previousElementSibling.type = "date";
        previousButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const previousDayDate = (new Date(currentDisplayedDate.setDate(currentDisplayedDate.getDate() - 1))).toJSON().slice(0, 10);
            initDailyLogWithDate(previousDayDate);
        });
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const nextDayDate = (new Date(currentDisplayedDate.setDate(currentDisplayedDate.getDate() + 1))).toJSON().slice(0, 10);
            initDailyLogWithDate(nextDayDate);
        });
        calendarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newdate = calendarButton.previousElementSibling.value;
            initDailyLogWithDate(newdate);
        })
    };
    if (monthlyButton.className.includes('active')) {
        calendarButton.previousElementSibling.type = "month";
        previousButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const previousMonthDate = (new Date(currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() - 1))).toJSON().slice(0, 7);
            initMonthlyLogWithDate(previousMonthDate);
        });
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const nextMonthDate = (new Date(currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() + 1))).toJSON().slice(0, 7);
            initMonthlyLogWithDate(nextMonthDate);
        });
        calendarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newdate = calendarButton.previousElementSibling.value;
            initMonthlyLogWithDate(newdate);
        })
    };
};


const initIrrelevant = () => {
    document.querySelector('#task-table').innerHTML = " ";
    fetch(`http://localhost:3030/api/entries`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                if (task.taskState == "irrelevant") {
                    createTaskHTML(task);
                };
            };
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
            addListenerToChangeTaskDateButton();
        });
};

const initMonthlyLog = () => {
    const currentYearAndMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    initMonthlyLogWithDate(currentYearAndMonth);
};

const initMonthlyLogWithDate = (currentYearAndMonth) => {
    document.querySelector('#task-table').innerHTML = " ";
    createNavBarForMonthlyAndDailyLog(currentYearAndMonth);
    fetch(`http://localhost:3030/api/entries?month=${currentYearAndMonth}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                createTaskHTML(task);
            };
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
            addListenerToChangeTaskDateButton();
        });
};

const initDailyLog = () => {
    const todaysDate = new Date().toJSON().slice(0, 10);
    initDailyLogWithDate(todaysDate);
};

const initDailyLogWithDate = (todaysDate) => {
    document.querySelector('#task-table').innerHTML = " ";
    createNavBarForMonthlyAndDailyLog(todaysDate);
    fetch(`http://localhost:3030/api/entries?ondate=${todaysDate}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                createTaskHTML(task);
            };
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
            addListenerToChangeTaskDateButton();
        });
}

const initBacklog = () => {
    document.querySelector('#task-table').innerHTML = " ";
    // clear all tasks
    fetch(`http://localhost:3030/api/entries`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                if (!task.date) {
                    createTaskHTML(task);
                };
            };
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
            addListenerToChangeTaskDateButton();
        });
};

const addListenerToChangeTaskDateButton = () => {
    const changeDateButtons = document.querySelectorAll('.accept-new-date');
    changeDateButtons.forEach((button) => {
        const changeStatus = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const entryId = button.parentElement.parentNode.parentNode.parentNode.parentNode.id;
            const newdate = button.previousElementSibling.value;
            const newDateBody = {
                "taskState": "migrated",
                "date": `${newdate}`
            };
            editEntry(entryId, newDateBody);
        }
        button.addEventListener('click', changeStatus);
    });
};

const addListenersToSignificancyButtons = () => {
    const buttons = document.querySelectorAll('.signification .menu .item');

    const priorityBody = { "significationType": "priority" };
    const inspirationBody = { "significationType": "inspiration" };
    const noneBody = { "significationType": "none" };

    buttons.forEach(button => {
        const changeStatus = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const entryId = button.parentElement.parentNode.parentNode.parentNode.id;
            if (button.className.includes('none')) {
                editEntry(entryId, noneBody);
            }
            if (button.className.includes('inspiration')) {
                editEntry(entryId, inspirationBody);
            }
            if (button.className.includes('priority')) {
                editEntry(entryId, priorityBody);
            }
        }
        button.addEventListener('click', changeStatus);
    })
};

const addListenersToTypeAndStateButtons = () => {
    const buttons = document.querySelectorAll('.type-state .menu .item');

    // types
    const eventBody = { "entryType": "event" };
    const noteBody = { "entryType": "note" };
    const taskBody = { "entryType": "task" };
    // states
    const incompleteBody = { "taskState": "incomplete" };//dac jako drugie klikniecie na complete czy jako oddzielna opcja w menu?
    const completeBody = { "taskState": "complete" };
    const irrelevantBody = { "taskState": "irrelevant" };
    const scheduledBody = {
        "taskState": "scheduled",
        "date": ""
    };

    buttons.forEach(button => {
        const changeStatus = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const entryId = button.parentElement.parentNode.parentNode.parentNode.id;

            if (button.className.includes('event')) {
                editEntry(entryId, eventBody);
            }
            if (button.className.includes('task')) {
                editEntry(entryId, taskBody);
            }
            if (button.className.includes('note')) {
                editEntry(entryId, noteBody);
            }
            if (button.className.includes('complete')) {
                editEntry(entryId, completeBody);
            }
            if (button.className.includes('irrelevant')) {
                editEntry(entryId, irrelevantBody);
            }
            if (button.className.includes('scheduled')) {
                editEntry(entryId, scheduledBody);
            }
            if (button.className.includes('delete')) {
                deleteEntry(entryId);
            }
        }
        button.addEventListener('click', changeStatus);
    })
};

const createTaskHTML = (task) => {
    const html = `
        <tr class="task" id=${task._id}> 
            <td class="collapsing signification">${createSignificationButtonMenu(createSignificationButton(task.significationType))}</td>
            <td class="collapsing type-state">${createTypeAndStateButtonMenu(createTypeAndStateButton(task.entryType, task.taskState))}</td>
            <td class="description">${task.body}</td>
            <td class="collapsing">${createChangeDateButton(`date" min="${new Date().toJSON().slice(0, 10)}`, "accept-new-date", "basic", " ")}</td>
        </tr>
        `;
    const element = htmlToElement(html);
    putTaskIntoHTML(element);
};
// check if thin min datevalue works
const createChangeDateButton = (pickerType, btnClass, iconType, btnId) => {
    return `
    <div class="ui ${iconType} simple icon top left dropdown button">
        <i class="calendar alternate outline icon"></i>
        <div class="menu">
            <div class="header">Choose date</div>
            <div class="item">
                <input type="${pickerType}"></input>
                <div class="ui basic icon button ${btnClass}" id="${btnId}">
                    <i class="check icon"></i>
                </div>
            </div>
        </div>
    </div>
    `
};


const createSignificationButton = (type) => {
    switch (type) {
        case "priority":
            return "exclamation";
        case "inspiration":
            return "star";
        case "none":
            return "";
    }
};

const createSignificationButtonMenu = (buttonIcon) => {
    return `
    <div class="ui basic simple icon top left dropdown button">
    <i class="${buttonIcon} icon"></i>
        <div class="menu">
            <div class="header">Signification type</div>
            <div class="item priority"><i class="exclamation icon"></i>Important</div>
            <div class="item inspiration"><i class="star icon"></i>Inspiration</div>
            <div class="item none"><i class="icon"></i>None</div>
        </div>
    </div>
    `
}

const createTypeAndStateButtonMenu = (buttonIcon) => {
    return `
    <div class="ui icon basic simple dropdown button">
        <i class="${buttonIcon} icon"></i>
        <div class="menu">
            <div class="header">Type</div>
            <div class="item task"><i class="circle icon"></i>Task</div>
            <div class="item note"><i class="minus icon"></i>Note</div>
            <div class="item event"><i class="circle outline icon"></i>Event</div>
            <div class="header">State</div>
            <div class="item complete"><i class="close icon"></i>Complete</div>
            <div class="item scheduled"><i class="chevron left icon"></i>Move to backlog</div>
            <div class="item irrelevant"><i class="ban icon"></i>Mark as irrelevant</div>
            <div class="item delete"><i class="trash alternate icon"></i>Delete</div>
        </div>
    </div>
    `
}

const createTypeAndStateButton = (type, state) => {
    if (state === "complete") {
        return "close";
    }
    if (state === "migrated") {
        return "chevron right";
    }
    if (state === "scheduled") {
        return "chevron left";
    }
    if (state === "irrelevant") {
        return "ban";
    }
    if (type === "task") {
        return "circle";
    }
    if (type === "note") {
        return "minus";
    }
    if (type === "event") {
        return "circle outline";
    }
};

const putTaskIntoHTML = (taskHTML) => {
    const taskTable = document.querySelector('#task-table');
    taskTable.appendChild(taskHTML);
};

const editEntry = (entryId, body) => {
    console.log(body);
    console.log(entryId);
    fetch(`http://localhost:3030/api/entries/${entryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body),
    }).then(resp => {
        console.log(resp);
        // document.location.reload();
        logInit();
    })
        .catch(err => console.log(err));
};
const deleteEntry = (entryId) => {
    fetch(`http://localhost:3030/api/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }).then(resp => {
        console.log(resp);
        // document.location.reload();
        logInit();
    })
        .catch(err => console.log(err));
};

const logInit = () => {
    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');
    const backlogButton = document.querySelector('#back-button');
    const irrelevantButton = document.querySelector('#irr-button');
    if (dailyButton.className.includes('active')) initDailyLog();
    if (monthlyButton.className.includes('active')) initMonthlyLog();
    if (backlogButton.className.includes('active')) initBacklog();
    if (irrelevantButton.className.includes('active')) initIrrelevant();
};

const wind = window.location.href;
if (wind.includes('log.html')) {
    token = sessionStorage.getItem('inMemoryToken');
    if (!token) {
        console.log('No JWT token!');
        window.location.href = 'login.html';
    }
    console.log('dailylog init with');
    addListenersToMenuButtons();
    logInit();
};