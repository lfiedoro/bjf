

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
const getTasks = () => {
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
            <td class="signification">${task.significationType}</td>
            <td class="entry-type">${task.entryType}</td>
            <td class="task-state">${task.taskState}</td>
            <td class="description">${task.body}</td>
            <td class="settings">${createSettingsButton()}</td>
        </tr>
        <div class="ui divider></div>
        `;
    const element = htmlToElement(html);
    putTaskIntoHTML(element);
    // putTaskIntoHTML(html);
};

const putTaskIntoHTML = (taskHTML) => {
    const taskTable = document.querySelector('#task-table');
    taskTable.appendChild(taskHTML);
};

const createSettingsButton = () => {
    return `<button></button>`;
};

getTasks();