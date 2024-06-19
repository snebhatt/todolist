document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.title}: ${task.description}`;
            if (task.completed) {
                li.classList.add('completed');
            }
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.onclick = async () => {
                await fetch(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...task, completed: !task.completed })
                });
                fetchTasks();
            };
            li.appendChild(completeBtn);
            taskList.appendChild(li);
        });
    };

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, completed: false })
        });
        fetchTasks();
    });

    fetchTasks();
});
