

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

// docelowo jako argument wejdzie userid, który bedzie przekazywany do api
const dailyLogInit = () => {
    fetch(`http://localhost:3030/api/entries`)
        .then(response => response.json())
        .catch(new Error('Could not get any tasks'))
        .then(tasks => {
            for (const task of tasks.entries) {
                console.log(task);
                createTaskHTML(task);
            }
        });
};

const createTaskHTML = (task) => {
    const html = `
        <tr class="task" id=${task._id}> 
        <td class="signification">${createSignificationButtonMenu(createSignificationButton(task.significationType))}</td>
            <td class="entry-type">${createButton(createEntryTypeButon(task.entryType, task.taskState))}</td>
            <td class="task-state">${task.taskState}</td>
            <td class="description">${task.body}</td>
            <td class="settings">${createButton("cog")}</td>
        </tr>
        `;
    const element = htmlToElement(html);
    putTaskIntoHTML(element);
    // putTaskIntoHTML(html);
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

const createEntryTypeButon = (type, state) => {
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
        return "";//what to do?
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

const createButton = (iconName) => {
    return `<button class="ui icon button">
    <i class="${iconName} icon"></i>
  </button>`;
};

const createSignificationButtonMenu = (buttonIcon) => {
    return `
    <div class="ui simple icon top left dropdown button">
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

// const priorityButton = document.querySelector('.item.priority');
// if(priorityButton){
//     priorityButton.addEventListener(('click', (e) => {
//         console.log(e,"clicked");
//     }));
// }
const wind = window.location.href;


if (wind.includes('dailyLog.html')) {
    console.log('dailylog init')
    dailyLogInit();
};