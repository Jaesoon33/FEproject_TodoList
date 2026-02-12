// 1. 날짜 표시 (상단)
let today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});
const dateElement = document.getElementById("today_date"); 
if (dateElement) dateElement.textContent = formattedDate;

// 2. 데이터 저장소
let tasks = [
    { id: 1, title: "Java", date: "2026-02-25", time: "14:00", important: true, completed: false },
    { id: 2, title: "헬스장 가기", date: "2026-03-13", time: "07:30", important: false, completed: false }
];

// 3. DOM 요소 가져오기 
const taskForm = document.querySelector(".task-input");
const textarea = document.getElementById("task-title");
const dueDateInput = document.getElementById("due-date");
const reminderTimeInput = document.getElementById("reminder-time");
const importantBtn = document.getElementById("important-btn");
const taskListDisplay = document.getElementById("task-list-display");
// 상단 DOM 요소 추가
const detailPanel = document.getElementById("detail-panel");
const detailContent = document.getElementById("detail-content");


// 버튼
const dueBtn = document.getElementById("due-btn");
const reminderBtn = document.getElementById("reminder-btn");

// --- 4. 인터랙션 및 이벤트 설정 ---

// 숨겨진 input 호출
dueBtn.addEventListener("click", () => dueDateInput.showPicker());
reminderBtn.addEventListener("click", () => reminderTimeInput.showPicker());

// 날짜/시간 선택 시 버튼 색상 활성화 (active 클래스 추가)
dueDateInput.addEventListener("change", () => {
    dueDateInput.value ? dueBtn.classList.add("active") : dueBtn.classList.remove("active");
});

reminderTimeInput.addEventListener("change", () => {
    reminderTimeInput.value ? reminderBtn.classList.add("active") : reminderBtn.classList.remove("active");
});

// 중요 버튼 토글
importantBtn.addEventListener("click", () => {
    importantBtn.classList.toggle("active");
});

// 5. 메인 추가 기능 (Submit)
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = textarea.value.trim();
    const date = dueDateInput.value;
    const time = reminderTimeInput.value;
    const isImportant = importantBtn.classList.contains("active");

    if (date === "") {
        alert("기한(날짜)을 선택해주세요!");
        dueDateInput.showPicker(); // 바로 날짜 선택창 띄우기
        return;
    }


    const newTask = {
        id: Date.now(),
        title: title,
        date: date,
        time: time,
        important: isImportant,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();

    // 입력창 및 버튼 상태 초기화
    taskForm.reset();
    dueBtn.classList.remove("active");
    reminderBtn.classList.remove("active");
    importantBtn.classList.remove("active");
});

// 할 일 완료 토글 함수
function toggleComplete(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed; // 상태 반전
        renderTasks(); // 화면 다시 그리기
    }
}


// 객체를 기준으로 상태값 변경
function updateTaskStatus() {
    const now = new Date();
    // 로컬 시간 기준 YYYY-MM-DD 생성
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    tasks.forEach(task => {
        if (task.completed) {
            task.currentStatus = 'completed';
        } else if (task.date && task.date < todayStr) {
            task.currentStatus = 'overdue';
        } else {
            task.currentStatus = 'normal';
        }
    });
}



function renderTasks() {
    updateTaskStatus(); // 상태 갱신 로직 실행
    const taskListDisplay = document.getElementById("task-list-display");
    taskListDisplay.innerHTML = ""; 

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `task-card ${task.currentStatus}`;
        
        // blue - in progress
        // green - completed
        // red - expired/overdue
        const statusTheme = {
            completed: "#1e8e3e",
            overdue: "#d93025",
            normal: "#1a73e8"
        };
        const activeColor = statusTheme[task.currentStatus];

        card.innerHTML = `
            <div class="task-info">
                <div class="task-title" style="color: #202124; font-weight: 500; ${task.completed ? 'text-decoration: line-through; color: #70757a;' : ''}">
                    ${task.title}
                </div>
                <div class="task-details" style="display: flex; gap: 12px; margin-top: 6px; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-symbols-outlined" style="font-size: 18px; color: ${activeColor};">calendar_month</span>
                        <span style="font-size: 13px; color: ${activeColor};">${task.date}</span>
                    </div>
                    ${task.time ? `
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-symbols-outlined" style="font-size: 18px; color: #fbbc04;">notifications</span>
                        <span style="font-size: 13px; color: #9ea3a;">${task.time}</span>
                    </div>` : ""}
                    ${task.important ? '<span class="material-symbols-outlined" style="color: #fbbc04; font-size: 18px; font-variation-settings: \'FILL\' 1;">star</span>' : ""}
                </div>
            </div>
            <div class="task-status" style="display: flex; gap: 10px; align-items: center;">
                <span class="material-symbols-outlined check-btn" onclick="toggleComplete(${task.id})" 
                      style="color: ${task.completed ? '#1e8e3e' : '#9ea3a8'}; font-size: 22px; cursor: pointer; font-weight: bold;">
                    ${task.completed ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span class="material-symbols-outlined delete-btn" onclick="deleteTask(${task.id})" 
                      style="color: #5f6368; font-size: 20px; cursor: pointer;">
                    delete
                </span>
            </div>
        `;
        
        card.addEventListener("click", (e) => {
            if (e.target.closest('.delete-btn') || e.target.closest('.check-btn')) return;
            
            document.querySelectorAll(".task-card")
            .forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            showDetail(task);
        });
        taskListDisplay.appendChild(card);
    });
}

// 할 일 삭제 함수
function deleteTask(id) {
    if(confirm("이 할 일을 삭제하시겠습니까?")) {
        tasks = tasks.filter(task => task.id !== id);
        detailPanel.classList.remove("active");
        renderTasks();
    }
}



// 초기 렌더링
renderTasks();



function showDetail(task) {
    const detailPanel = document.getElementById("detail-panel");
    const detailContent = document.getElementById("detail-content");
    detailPanel.classList.add("active");
    
    const statusColor = task.currentStatus === 'completed' ? "#1e8e3e" : (task.currentStatus === 'overdue' ? "#d93025" : "#70757a");
    const statusLabel = task.currentStatus === 'completed' ? "Task Completed" : (task.currentStatus === 'overdue' ? "Expired" : "In Progress");
    const statusIcon = task.currentStatus === 'completed' ? 'check_circle' : (task.currentStatus === 'overdue' ? 'error' : 'radio_button_unchecked');

    detailContent.innerHTML = `
        <div style="flex: 1;">
            <div class="detail-item" style="margin-bottom: 32px;">  
                <label style="display: block; font-size: 15.6px; color: #70757a; margin-bottom: 6px;">Title</label>
                <input type="text" id="edit-title" value="${task.title}" 
                    style="font-size: 1.56rem; font-weight: 600; color: #202124; border: none; width: 100%; outline: none; background: transparent; padding: 0;">
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: #1a73e8; font-size: 31px; cursor: pointer;" 
                      onclick="document.getElementById('edit-date').showPicker()">calendar_month</span>
                <div>
                    <label style="display: block; font-size: 15.6px; color: #70757a;">Due Date</label>
                    <input type="date" id="edit-date" value="${task.date}" 
                        style="border: none; background: transparent; outline: none; font-family: inherit; color: #202124; font-size: 18.2px;">
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: #fbbc04; font-size: 31px; cursor: pointer;" 
                      onclick="document.getElementById('edit-time').showPicker()">notifications</span>
                <div>
                    <label style="display: block; font-size: 15.6px; color: #70757a;">Reminder</label>
                    <input type="time" id="edit-time" value="${task.time || ''}" 
                        style="border: none; background: transparent; outline: none; font-family: inherit; color: #202124; font-size: 18.2px;">
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" id="edit-important-icon" 
                      style="color: #fbbc04; font-size: 31px; cursor: pointer; font-variation-settings: 'FILL' ${task.important ? 1 : 0};"
                      onclick="toggleStar(this)">star</span>
                <div>
                    <label style="display: block; font-size: 15.6px; color: #70757a;">Important</label>
                    <div id="edit-important-text" style="color: #202124; font-size: 18.2px;">${task.important ? "Important Task" : "Normal Task"}</div>
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 26px;">
                <span class="material-symbols-outlined" style="color: ${statusColor}; font-size: 31px; font-variation-settings: 'FILL' ${task.completed ? 1 : 0};">
                    ${statusIcon}
                </span>
                <div>
                    <label style="display: block; font-size: 15.6px; color: #70757a;">Achievement</label>
                    <div style="color: ${statusColor}; font-weight: bold; font-size: 18.2px;">
                        ${statusLabel}
                    </div>
                </div>
            </div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column;">
            <div class="detail-item" style="margin-top: 13px; flex-grow: 1;">
                <label style="display: block; font-size: 18.2px; color: #666666; margin-bottom: 10px;">Description</label>
                <textarea id="edit-desc" oninput="updateDescription(${task.id}, this.value)" 
                    style="width: 100%; flex-grow: 1; font-size: 21px; color: #515050; line-height: 1.6; background: #e3e0e0; padding: 18px; border-radius: 12px; border: none; resize: none; font-family: inherit; box-sizing: border-box;"
                    placeholder="Enter task details here...">${task.description || ""}</textarea>
            </div>
        </div>

        <button onclick="saveTaskEdit(${task.id})" 
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 15px rgba(26, 115, 232, 0.3)';" 
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                style="width: 100%; padding: 18px; background-color: #1a73e8; color: white; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 26px; font-size: 20.8px; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 28px;">save</span>
            <span>Update Task</span>
        </button>

        <button onclick="deleteTask(${task.id})" 
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 15px rgba(195, 44, 54, 0.3)';" 
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                style="width: 100%; padding: 14px; background: none; border: 2px solid #fce8e6; color: #d93025; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 13px; font-size: 18.2px;">
            <span class="material-symbols-outlined" style="font-size: 24px;">delete</span>
            <span>Delete Task</span>
        </button>
    `;
}



function saveTaskEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.title = document.getElementById("edit-title").value;
    task.date = document.getElementById("edit-date").value;
    task.time = document.getElementById("edit-time").value;
    task.important = document.getElementById("edit-important-icon").style.fontVariationSettings.includes("'FILL' 1");
    task.description = document.getElementById("edit-desc").value;

    renderTasks();
    alert("수정되었습니다.");
}