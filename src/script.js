const inputTask = document.getElementById('inputTask');
const createTask = document.getElementById('createTask');
const createdTasks = document.getElementById('createdTasks');
const errorMessage = document.getElementById('errorMessage');
const filterInputText = document.getElementById('filterInputText');
const modal = document.getElementById('modal');
const editTaskInput = document.getElementById('editTaskInput');
const editTaskSubmit = document.getElementById('editTaskSubmit');
document.getElementById('sortDate').addEventListener('change', getTasks);
document.getElementById('sortPriority').addEventListener('change', getTasks);

const tasks = [];
let taskCount = 0;

createTask.addEventListener('click', (e) => {
    if(inputTask.value === '') {
        errorMessage.classList.remove("hidden");
        errorMessage.innerText = 'Please enter a task';
        return;
    }
    errorMessage.classList.add("hidden");
    const now = new Date();

    errorMessage.innerText = '';
    taskCount++
    tasks.push({id: taskCount, taskInput: inputTask.value, createdAt: now.toLocaleString(), priority: 0});
    inputTask.value = '';
    getTasks()
})
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        getTasks();
    }
}

function showModal(id) {
    modal.classList.add("visible");
    modal.classList.remove("hidden");

    const task = tasks.find(task => task.id === id);
    if (task) {
        editTaskInput.value = task.taskInput;
    }

    let newText = editTaskInput.value;

    editTaskInput.addEventListener('input', () => {
        newText = editTaskInput.value;
    });

    const newBtn = editTaskSubmit.cloneNode(true);
    editTaskSubmit.parentNode.replaceChild(newBtn, editTaskSubmit);

    newBtn.addEventListener('click', () => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index].taskInput = newText;
            getTasks();
            modal.classList.add("hidden");
            modal.classList.remove("visible");
            console.log(tasks);
        }
    });
}

function increasePriority(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index < 0) return
    if(tasks[index].priority > 5){
        tasks[index].priority = 0;
    }
    if(tasks[index].priority < 0) return

    tasks[index].priority++;
    getTasks();
}




function getTasks() {
    createdTasks.innerHTML = '';

    let sortedTasks = [...tasks];

    const sortDate = document.getElementById('sortDate').value;
    const sortPriority = document.getElementById('sortPriority').value;

    // сортировка по дате
    if (sortDate === 'asc') {
        sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortDate === 'desc') {
        sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // сортировка по приоритету
    if (sortPriority === 'asc') {
        sortedTasks.sort((a, b) => a.priority - b.priority);
    } else if (sortPriority === 'desc') {
        sortedTasks.sort((a, b) => b.priority - a.priority);
    }

    sortedTasks.map((task) => {
        createdTasks.innerHTML += `
        <li class="bg-white/10 rounded-lg px-4 py-3 text-white shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div class="flex flex-col gap-2 w-full overflow-hidden">
                <span class="text-base font-medium break-words w-full">
                  ${task.taskInput}
                </span>

                <div class="flex flex-wrap gap-2 text-sm text-white/70">
                    <span onclick="increasePriority(${task.id})" class="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md whitespace-nowrap" style="cursor:pointer;">
                        Приоритет: ${task.priority}
                    </span>
                    <span class="bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-md whitespace-nowrap">
                        Дата: ${task.createdAt}
                    </span>
                </div>
            </div>

            <div class="flex flex-col gap-2 self-end sm:self-start">
                <button 
                    onclick="showModal(${task.id})"
                    class="text-white/70 hover:text-white transition"
                    title="Редактировать"
                    type="button"
                >
                    ✎
                </button>
                <button 
                    onclick="deleteTask(${task.id})" 
                    class="text-white/70 hover:text-white transition"
                    title="Удалить"
                    type="button"
                >
                    ✖
                </button>
            </div>
        </li>
        `;
    });
}


function inputFilter() {
    const filteredTasks = tasks.filter(task =>
        task.taskInput.toLowerCase().includes(filterInputText.value.toLowerCase())
    );

    createdTasks.innerHTML = '';

    if (filteredTasks.length === 0) {
        createdTasks.innerHTML = `<p class="text-white/70 text-center py-4">Not found</p>`;
        return;
    }

    filteredTasks.forEach(task => {
        createdTasks.innerHTML += `
        <li class="bg-white/10 rounded-lg px-4 py-3 text-white shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div class="flex flex-col gap-2 w-full overflow-hidden">
                <span class="text-base font-medium break-words w-full">
                  ${task.taskInput}
                </span>

                <div class="flex flex-wrap gap-2 text-sm text-white/70">
                    <span class="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md whitespace-nowrap">
                        Приоритет: ${task.priority}
                    </span>
                    <span class="bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-md whitespace-nowrap">
                        Дата: ${task.createdAt}
                    </span>
                </div>
            </div>

            <div class="flex flex-col gap-2 self-end sm:self-start">
                <button 
                    class="text-white/70 hover:text-white transition"
                    title="Редактировать"
                    type="button"
                >
                    ✎
                </button>
                <button 
                    onclick="deleteTask(${task.id})" 
                    class="text-white/70 hover:text-white transition"
                    title="Удалить"
                    type="button"
                >
                    ✖
                </button>
            </div>
        </li>
        `;
    });
}


filterInputText.addEventListener('input', (e) => {
    inputFilter()
})