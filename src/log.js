import bullet from './api/BullerBack'
let token = undefined;

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

const handleDeleteUser = () => {
    alert('We do not support deleting account yet :(. You have to stay with us for ever....')
};

const addListenersToMenuButtons = () => {
    const deleteAccountButton = document.querySelector('.deleteAccount');
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
    addListenerToOneMenuButton(addNewEntryButton, initEntryForm, menuButtons);
    deleteAccountButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDeleteUser();
    });
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
    let sendBtn = document.querySelector('.sendbtn');
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

    let payload = {
        "entryType": type,
        "taskState": "incomplete",
        "significationType": significant,
        "date": date,
        "body": description
    };

    bullet.post(`/api/entries/`,
        payload,
        {
            headers:
            {
                'x-access-token': token
            },
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
                <button class="ui large button submit blue sendbtn">Add</button>
                <button class="ui large button clear resetbtn ">Clear</button>
            </form>
        </div>
    </div>`;
}

const createNavBarForMonthlyAndDailyLog = (date) => {
    const html = createNavBarForMonthlyAndDailyLogHtml(date);
    const htmlToPut = htmlToElement(html);
    putTaskIntoHTML(htmlToPut);
    addListenersForMonthlyDailyNavbar();
    activateCalendar();
};

const createNavBarForMonthlyAndDailyLogHtml = (date) => {
    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');

    let headerToDisplay = 'dupa';

    if (dailyButton.className.includes('active')) {
        let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        headerToDisplay = `${weekDays[date.getDay()]}  ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
    if (monthlyButton.className.includes('active')) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        headerToDisplay = `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `
          <tr class="nav-bar"> 
            <td class="collapsing">
                <div class="ui icon button" id="previous-day">
                    <i class="arrow left icon"></i>
                </div>
            </td>
            <td >
            ${createChangeDateButton("", "new-log-date", "activate-log-cal", "date-picker")}
            </td>
            <td class="center aligned"><div class="day-or-month" style="display: none">${date}</div><h2>${headerToDisplay}</h2></td>
            <td class="collapsing">
                 <div class="ui icon button" id="next-day">
                    <i class="arrow right icon"></i>
                </div>
            </td>
        </tr>
    `;
}

const getNextOrPreviousDate = (monthDiff, dayDiff) => {
    let currentDisplayedDate = new Date(document.querySelector('.day-or-month').textContent);
    let newDate = new Date(currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() + monthDiff, currentDisplayedDate.getDate() + dayDiff));
    console.log(newDate);
    return newDate;
}


const addListenersForMonthlyDailyNavbar = () => {
    const previousButton = document.querySelector('#previous-day');
    const nextButton = document.querySelector('#next-day');
    const calendarButton = document.querySelector('#date-picker');

    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');


    if (dailyButton.className.includes('active')) {
        calendarButton.nextElementSibling.lastElementChild.type = "date";
        previousButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            initDailyLogWithDate(getNextOrPreviousDate(0, -1));
        });
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            initDailyLogWithDate(getNextOrPreviousDate(0, 1));

        });
        calendarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newDate = calendarButton.nextElementSibling.lastElementChild.value;
            if (newDate) {
                initDailyLogWithDate(new Date(newDate));
            } else {
                initDailyLog();
            }
        })
    };
    if (monthlyButton.className.includes('active')) {
        calendarButton.nextElementSibling.lastElementChild.type = "month";
        previousButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            initMonthlyLogWithDate(getNextOrPreviousDate(-1, 0));

        });
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            initMonthlyLogWithDate(getNextOrPreviousDate(1, 0));
        });
        calendarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newDate = calendarButton.nextElementSibling.lastElementChild.value;
            if (newDate) {
                initMonthlyLogWithDate(new Date(newDate));
            } else {
                initMonthlyLog();
            }
        })
    };
};


const initIrrelevant = () => {
    document.querySelector('#task-table').innerHTML = " ";

    bullet.get('/api/entries', {
        headers: {
            'x-access-token': token
        }
    }).then(tasks => {
        for (const task of tasks.data.entries) {
            if (task.taskState == "irrelevant") {
                createTaskHTML(task);
            };
        };
        addListenersToSignificancyButtons();
        addListenersToTypeAndStateButtons();
        addListenerToChangeTaskDateButton();
    }).catch(new Error('Could not get any tasks'));
};

const initMonthlyLog = () => {
    const date = new Date();
    initMonthlyLogWithDate(date);
};

const initMonthlyLogWithDate = (todaysDate) => {
    document.querySelector('#task-table').innerHTML = " ";
    createNavBarForMonthlyAndDailyLog(todaysDate);

    bullet.get('/api/entries', {
        params: {
            month: `${todaysDate.getFullYear()}-${todaysDate.getMonth() + 1}`
        },
        headers: {
            'x-access-token': token
        }
    }).then(tasks => {
        console.log(tasks);
        for (const task of tasks.data.entries) {
            createTaskHTML(task);
        }
        addListenersToSignificancyButtons();
        addListenersToTypeAndStateButtons();
        addListenerToChangeTaskDateButton();
    }).catch(new Error('Could not get any tasks'));
};

const initDailyLog = () => {
    const todaysDate = new Date();
    initDailyLogWithDate(todaysDate);
};

const initDailyLogWithDate = (todaysDate) => {
    let month = todaysDate.getMonth();
    let day = todaysDate.getDate();
    let fullDate = `${todaysDate.getFullYear()}-${month + 1}-${day}`;
    console.log(fullDate);

    document.querySelector('#task-table').innerHTML = " ";
    createNavBarForMonthlyAndDailyLog(todaysDate);

    bullet.get('/api/entries', {
        params: {
            ondate: fullDate
        },
        headers: {
            'x-access-token': token
        }
    })
        .then(tasks => {
            for (const task of tasks.data.entries) {
                createTaskHTML(task);
            };
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
            addListenerToChangeTaskDateButton();
        })
        .catch(new Error('Could not get any tasks'));
}

const initBacklog = () => {
    document.querySelector('#task-table').innerHTML = " ";
    bullet.get('/api/entries', {
        headers: {
            'x-access-token': token
        }
    }).then(tasks => {
        console.log(tasks);

        for (const task of tasks.data.entries) {
            if (!task.date) {
                createTaskHTML(task);
            };
        };
        addListenersToSignificancyButtons();
        addListenersToTypeAndStateButtons();
        addListenerToChangeTaskDateButton();
    }).catch(new Error('Could not get any tasks'));
};

const addListenerToChangeTaskDateButton = () => {
    const openButtons = document.querySelectorAll('.activate-task-cal');

    openButtons.forEach((button) => {
        const acceptButton = button.nextElementSibling;
        const calendar = acceptButton.nextElementSibling;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            calendar.style.display = "";
            acceptButton.style.display = "";
        });
        const changeStatus = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const entryId = button.parentElement.parentElement.parentElement.id;
            const newdate = button.nextElementSibling.nextElementSibling.lastElementChild.value;
            const newDateBody = {
                "taskState": "migrated",
                "date": `${newdate}`
            };
            editEntry(entryId, newDateBody);
        }
        acceptButton.addEventListener('click', changeStatus);
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
    const eventBody = { "entryType": "event" };
    const noteBody = { "entryType": "note" };
    const taskBody = { "entryType": "task" };
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
            <td class="collapsing">${createChangeDateButton(`date" min="${new Date().toJSON().slice(0, 10)}`, "accept-new-date", "basic activate-task-cal", `btn-${task._id}`)}</td>
        </tr>
        `;
    const element = htmlToElement(html);

    putTaskIntoHTML(element);
};



const createChangeDateButton = (pickerType, btnClass, iconType, btnId) => {
    return `
    <div>
        <div class="ui ${iconType} icon button">
            <i class="calendar alternate outline icon"></i>
        </div>
        <div class="ui basic icon button ${btnClass}" id="${btnId}" style="display: none">
                <i class="check icon"></i>
        </div>
        <div class="date-picker-container" style="display: none">
                <input type="${pickerType}"></input>
               
        </div>
    </div>
    `
};

const activateCalendar = () => {
    const button = document.querySelector('.activate-log-cal');
    const calendar = document.querySelector('.date-picker-container');
    const acceptButton = document.querySelector('#date-picker');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        calendar.style.display = "";
        acceptButton.style.display = "";
    })
}

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
    bullet.put(`/api/entries/${entryId}`,
        body,
        {
            headers:
            {
                'x-access-token': token
            }
        }).then(resp => {
            console.log(resp);
            logInit();
        }).catch(err => console.log(err));
};

const deleteEntry = (entryId) => {
    bullet.delete(`/api/entries/${entryId}`, {
        headers: {
            'x-access-token': token
        }
    }).then(resp => {
        console.log(resp);
        logInit();
    }).catch(err => console.log(err));
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
    addListenersToMenuButtons();

    console.log('dailylog init with');
    logInit();
};