// 제목 형식
let today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});
const dateElement = document.getElementById("today_date"); 
if (dateElement) dateElement.textContent = formattedDate;

// 현재 상세 패널에 열려있는 태스크의 ID를 저장 
let currentSelectedTaskId = null;

let tasks = [
    { id: 1, title: "Java 공부하기", date: "2026-02-25", time: "14:00", important: true, completed: false, description: "" },
    { id: 2, title: "헬스장 가기", date: "2026-03-13", time: "07:30", important: false, completed: false, description: "" }
];

// DOM 요소
const taskForm = document.querySelector(".task-input");
const textarea = document.getElementById("task-title");
const dueDateInput = document.getElementById("due-date");
const reminderTimeInput = document.getElementById("reminder-time");
const importantBtn = document.getElementById("important-btn");
const taskListDisplay = document.getElementById("task-list-display");
const detailPanel = document.getElementById("detail-panel");
const detailContent = document.getElementById("detail-content");
const dueBtn = document.getElementById("due-btn");
const reminderBtn = document.getElementById("reminder-btn");

/* 폼 인풋 값 받기 */
dueBtn.addEventListener("click", () => dueDateInput.showPicker());
reminderBtn.addEventListener("click", () => reminderTimeInput.showPicker());

dueDateInput.addEventListener("change", () => {
    dueDateInput.value ? dueBtn.classList.add("active") : dueBtn.classList.remove("active");
});

reminderTimeInput.addEventListener("change", () => {
    reminderTimeInput.value ? reminderBtn.classList.add("active") : reminderBtn.classList.remove("active");
});

importantBtn.addEventListener("click", () => {
    importantBtn.classList.toggle("active");
});

// 제출 시 값 저장 
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = textarea.value.trim();
    const date = dueDateInput.value;
    const time = reminderTimeInput.value;
    const isImportant = importantBtn.classList.contains("active");

    if (date === "") {
        alert("기한(날짜)을 선택해주세요!");
        dueDateInput.showPicker();
        return;
    }

    tasks.push({
        id: Date.now(),
        title, date, time,
        important: isImportant,
        completed: false,
        description: ""
    });

    renderTasks();
    taskForm.reset();
    [dueBtn, reminderBtn, importantBtn].forEach(btn => btn.classList.remove("active"));
});

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function updateTaskStatus() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    tasks.forEach(task => {
        if (task.completed) task.currentStatus = 'completed';
        else if (task.date && task.date < todayStr) task.currentStatus = 'overdue';
        else task.currentStatus = 'normal';
    });
}

/* 화면 출력  */
function renderTasks() {
    updateTaskStatus();
    taskListDisplay.innerHTML = ""; 

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `task-card ${task.currentStatus}`;
        
        // 현재 패널에 열려있는 카드라면 selected 클래스 유지
        if (currentSelectedTaskId === task.id) card.classList.add("selected");

        const statusTheme = { completed: "#1e8e3e", overdue: "#d93025", normal: "#1a73e8" };
        const activeColor = statusTheme[task.currentStatus];

        card.innerHTML = `
            <div class="task-info">
                <div class="task-title" style="color: #202124; font-weight: 750; ${task.completed ? 'text-decoration: line-through; color: #70757a;' : ''}">
                    ${task.title}
                </div>
                <div class="task-details" style="display: flex; gap: 12px; margin-top: 6px; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-symbols-outlined" style="font-size: 18px; color: ${activeColor};">calendar_month</span>
                        <span style="font-size: 14px; color: ${activeColor};">${task.date}</span>
                    </div>
                    ${task.time ? `
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-symbols-outlined" style="font-size: 18px; color: #fbbc04;">notifications</span>
                        <span style="font-size: 14px; color: #9ea3a;">${task.time}</span>
                    </div>` : ""}
                    ${task.important ? '<span class="material-symbols-outlined" style="color: #fbbc04; font-size: 18px; font-variation-settings: \'FILL\' 1;">star</span>' : ""}
                </div>
            </div>
            <div class="task-status" style="display: flex; gap: 10px; align-items: center;">
                <span class="material-symbols-outlined check-btn"
                 onclick="event.stopPropagation(); toggleComplete(${task.id})"
                      style="color: ${task.completed ? '#1e8e3e' : '#6e767e'}; font-size: 22px; cursor: pointer; font-weight: bold; color: #519765">
                    ${task.completed ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span class="material-symbols-outlined delete-btn" onclick="event.stopPropagation(); deleteTask(${task.id})" 
                      style="color: #a74848; font-size: 20px; cursor: pointer;">
                    delete
                </span>
            </div>
        `;
        
        card.addEventListener("click", () => showDetail(task));
        taskListDisplay.appendChild(card);
    });
}

function showDetail(task) {
    // 시작 시 닫기 위함
    if (currentSelectedTaskId === task.id) {
        detailPanel.classList.remove("active");
        currentSelectedTaskId = null;
        renderTasks(); // selected 클래스 제거
        return;
    }

    currentSelectedTaskId = task.id;
    detailPanel.classList.add("active");
    renderTasks(); // selected 클래스 적용을 재 출력

    const statusColor = task.currentStatus === 'completed' ? "#1e8e3e" : (task.currentStatus === 'overdue' ? "#d93025" : "#70757a");
    const statusLabel = task.currentStatus === 'completed' ? "Task Completed" : (task.currentStatus === 'overdue' ? "Expired" : "In Progress");
    const statusIcon = task.currentStatus === 'completed' ? 'check_circle' : (task.currentStatus === 'overdue' ? 'error' : 'radio_button_unchecked');

    detailContent.innerHTML = `
        <div style="flex: 1;">
            <div class="detail-item" style="margin-bottom: 32px;">  
                <label style="display: block; font-size: 16px; color: #70757a; margin-bottom: 6px;">Title</label>
                <input type="text" id="edit-title" value="${task.title}" 
                    style="font-size: 25px; font-weight: 600; color: #202124; border: none; width: 100%; outline: none; background: transparent; padding: 0;">
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: #1a73e8; font-size: 32px; cursor: pointer;" 
                      onclick="document.getElementById('edit-date').showPicker()">calendar_month</span>
                <div>
                    <label style="display: block; font-size: 16px; color: #70757a;">Due Date</label>
                    <input type="date" id="edit-date" value="${task.date}" 
                        style="border: none;  outline: none; font-family: inherit; color: #202124; font-size: 18px;">
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: #fbbc04; font-size: 32px; cursor: pointer;" 
                      onclick="document.getElementById('edit-time').showPicker()">notifications</span>
                <div>
                    <label style="display: block; font-size: 16px; color: #70757a;">Reminder</label>
                    <input type="time" id="edit-time" value="${task.time || ''}" 
                        style="border: none; outline: none; font-family: inherit; color: #202124; font-size: 18px;">
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" id="edit-important-icon" 
                      style="color: #fbbc04; font-size: 32px; cursor: pointer; font-variation-settings: 'FILL' ${task.important ? 1 : 0};"
                      onclick="this.style.fontVariationSettings = this.style.fontVariationSettings.includes('1') ? '\\'FILL\\' 0' : '\\'FILL\\' 1'">star</span>
                <div>
                    <label style="display: block; font-size: 16px; color: #70757a;">Important</label>
                    <div style="color: #202124; font-size: 18px;">Task Importance Setting</div>
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: ${statusColor}; font-size: 31px; font-variation-settings: 'FILL' ${task.completed ? 1 : 0};">
                    ${statusIcon}
                </span>
                <div>
                    <label style="display: block; font-size: 16px; color: #70757a;">Achievement</label>
                    <div style="color: ${statusColor}; font-weight: bold; font-size: 18.2px;">${statusLabel}</div>
                </div>
            </div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column;">
            <div class="detail-item" style="margin-top: 13px; flex-grow: 1;">
                <label style="display: block; font-size: 18px; color: #666666; margin-bottom: 10px;">Description</label>
                <textarea id="edit-desc" 
                    style="width: 100%; font-size: 21px; color: #515050; line-height: 2.2; background: #e3e0e0; padding: 18px; border-radius: 12px; border: none; resize: none; font-family: inherit; box-sizing: border-box;"
                    placeholder="Enter task details here...">${task.description || ""}</textarea>
            </div>
        </div>

        <button onclick="updateTaskEdit(${task.id})" 
                onmouseover="this.style.transform='translateY(-2px)';" 
                onmouseout="this.style.transform='translateY(0)';"
                style="width: 100%; padding: 18px; background-color: #1a73e8; color: white; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 26px; font-size: 20.8px; font-weight: 600; transition: transform 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 28px;">update</span>
            <span>Update Task</span>
        </button>

        <button onclick="deleteTask(${task.id})" 
                onmouseover="this.style.transform='translateY(-2px)';" 
                onmouseout="this.style.transform='translateY(0)';"
                style="width: 100%; padding: 14px; background: none; border: 2px solid #fce8e6; color: #ffffff; border-radius: 12px; background: #e94338d0; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 13px; font-size: 18px; transition: transform 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 24px;">delete</span>
            <span>Delete Task</span>
        </button>
    `;
}

function updateTaskEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.title = document.getElementById("edit-title").value;
    task.date = document.getElementById("edit-date").value;
    task.time = document.getElementById("edit-time").value;
    task.description = document.getElementById("edit-desc").value;

    renderTasks();
    alert("수정되었습니다.");
}

function deleteTask(id) {
    if(confirm("이 할 일을 삭제하시겠습니까?")) {
        tasks = tasks.filter(task => task.id !== id);
        detailPanel.classList.remove("active");
        currentSelectedTaskId = null; // 선택 해제
        renderTasks();
    }
}

// 초기 호출
renderTasks();