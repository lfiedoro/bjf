

const inMemoryToken = 'dupa';
//tą zmienną dodawć do headerów w fetchu

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

const logInit = (callback = showDailyEntries) => {
    document.querySelector('#task-table').innerHTML = " ";
    // clear all tasks
    fetch(`http://localhost:3030/api/entries`)
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            callback(tasks);
            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
        });
};

const addListenersToMenuButtons = () => {
    const menuButtons = document.querySelectorAll('#log-buttons .item');
    const dailyButton = document.querySelector('#daily-button');
    const monthlyButton = document.querySelector('#monthly-button');
    const backlogButton = document.querySelector('#back-button');
    const irrelevantButton = document.querySelector('#irr-button');

    addListenerToOneMenuButton(dailyButton, showDailyEntries, menuButtons);
    addListenerToOneMenuButton(monthlyButton, showMonthlyEntries, menuButtons);
    addListenerToOneMenuButton(backlogButton, showBacklogEntries, menuButtons);
    addListenerToOneMenuButton(irrelevantButton, showIrrelevantEntries, menuButtons);
}
const addListenerToOneMenuButton = (buttonName, callbackFunc, allMenuButtons) => {
    buttonName.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        allMenuButtons.forEach(button => button.classList.remove('active'));
        buttonName.classList.add('active');
        logInit(callbackFunc);
    })
}

const showIrrelevantEntries = (tasks) => {
    for (const task of tasks.entries) {
        if (task.taskState == "irrelevant") {
            createTaskHTML(task);
        };
    };
};

const showMonthlyEntries = () => {
    const currentYearAndMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    fetch(`http://localhost:3030/api/entries?month=${currentYearAndMonth}`)
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                createTaskHTML(task);
            };

            addListenersToSignificancyButtons();
            addListenersToTypeAndStateButtons();
        });
};

const showDailyEntries = (tasks) => {
    const todaysDate = new Date().toJSON().slice(0, 10)
    for (const task of tasks.entries) {
        if (task.date && task.date.slice(0, 10) == todaysDate) {
            createTaskHTML(task);
        };
    };
};

const showBacklogEntries = (tasks) => {
    for (const task of tasks.entries) {
        if (!task.date) {
            createTaskHTML(task);
        };
    };
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
    const migratedBody = {
        "taskState": "migrated"
        // "date": new Date()
    };
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
            if (button.className.includes('migrated')) {//zmienić date
                editEntry(entryId, migratedBody);
            }
            if (button.className.includes('irrelevant')) {
                editEntry(entryId, irrelevantBody);
            }
            if (button.className.includes('scheduled')) {
                editEntry(entryId, scheduledBody);
            }
            // delete
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
            <td class="signification">${createSignificationButtonMenu(createSignificationButton(task.significationType))}</td>
            <td class="type-state">${createTypeAndStateButtonMenu(createTypeAndStateButton(task.entryType, task.taskState))}</td>
            <td class="description">${task.body}</td>
        </tr>
        `;
    const element = htmlToElement(html);
    putTaskIntoHTML(element);
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
    <div class="ui basic simple icon button bottom left dropdown">
    <i class="${buttonIcon} icon"></i>
    <div class="menu">
        <div class="header">Type</div>
        <div class="item task"><i class="circle icon"></i>Task</div>
        <div class="item note"><i class="minus icon"></i>Note</div>
        <div class="item event"><i class="circle outline icon"></i>Event</div>
         <div class="header">State</div>
        <div class="item complete"><i class="close icon"></i>Complete</div>
        <div class="item migrated"><i class="chevron right icon"></i>Move to next day's log</div>
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
        return "ban";//what to do?
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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }).then(resp => {
        console.log(resp);
        document.location.reload();
    })
        .catch(err => console.log(err));
};
const deleteEntry = (entryId) => {
    fetch(`http://localhost:3030/api/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(resp => {
        console.log(resp);
        document.location.reload();
    })
        .catch(err => console.log(err));
};



const wind = window.location.href;
if (wind.includes('dailyLog.html')) {
    console.log('dailylog init')
    addListenersToMenuButtons();
    logInit();
};