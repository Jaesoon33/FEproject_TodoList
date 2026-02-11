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

// 6. 화면 출력 함수 (닫기 버튼 없이 클릭만으로 제어)
// 6. 화면 출력 함수 (삭제 버튼 추가 및 레이아웃 변경)
function renderTasks() {
    taskListDisplay.innerHTML = ""; 

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";
        card.style.cursor = "pointer";

        card.addEventListener("click", (e) => {
            // 삭제 버튼(span)을 직접 클릭한 경우에는 상세 패널이 열리지 않도록 방지
            if (e.target.closest('.delete-btn')) return;

            const isAlreadySelected = card.classList.contains("selected");
            document.querySelectorAll(".task-card").forEach(c => c.classList.remove("selected"));

            if (isAlreadySelected) {
                detailPanel.classList.remove("active");
            } else {
                card.classList.add("selected");
                detailPanel.classList.add("active");
                showDetail(task);
            }
        });

        card.innerHTML = `
            <div class="task-info">
                <div class="task-title" style="color: #000;">${task.title}</div>
                <div class="task-details" style="display: flex; gap: 12px; margin-top: 6px; align-items: center;">
                    ${task.date ? `
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #135bec;">calendar_month</span>
                            <span style="font-size: 13px; color: #000;">${task.date}</span>
                        </div>` : ""}
                    ${task.time ? `
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #fbbc04;">notifications</span>
                            <span style="font-size: 13px; color: #000;">${task.time}</span>
                        </div>` : ""}
                    ${task.important ? '<span class="material-symbols-outlined" style="color: #fbbc04; font-size: 18px; font-variation-settings: \'FILL\' 1;">star</span>' : ""}
                </div>
            </div>
            <div class="task-status">
                <span class="material-symbols-outlined delete-btn" 
                      onclick="deleteTask(${task.id})" 
                      style="color: #515151; font-size: 20px; transition: color 0.2s;">
                    delete
                </span>
            </div>
        `;
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
    detailPanel.classList.add("active");
    detailContent.innerHTML = `
        <div style="flex: 1;">
            <div class="detail-item" style="margin-bottom: 25px;">
                <label style="display: block; font-size: 12px; color: #70757a; margin-bottom: 5px;">Title</label>
                <div class="val" style="font-size: 1.2rem; font-weight: 500; color: #202124;">${task.title}</div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <span class="material-symbols-outlined" style="color: #135bec;">calendar_month</span>
                <div>
                    <label style="display: block; font-size: 12px; color: #70757a;">Due Date</label>
                    <div class="val" style="color: #202124;">${task.date}</div>
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <span class="material-symbols-outlined" style="color: #fbbc04;">notifications</span>
                <div>
                    <label style="display: block; font-size: 12px; color: #70757a;">Reminder</label>
                    <div class="val" style="color: #202124;">${task.time}</div>
                </div>
            </div>

            <div class="detail-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <span class="material-symbols-outlined" style="color: ${task.important ? '#fbbc04' : '#70757a'}; font-variation-settings: 'FILL' ${task.important ? 1 : 0};">
                    star
                </span>
                <div>
                    <label style="display: block; font-size: 12px; color: #70757a;">Important</label>
                    <div class="val" style="color: #202124;">${task.important ? "Important Task" : "Normal Task"}</div>
                </div>
            </div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column;">
            <div class="detail-item" style="margin-top: 20px; flex-grow: 1;">
                <label style="display: block;  font-size: 15.6px; color: #666666; margin-bottom: 8px;">Description</label>
                <div class="val" style="font-size: 18.2px; color: #515050; line-height: 1.6; background: #e3e0e0; padding: 15px; border-radius: 10px; min-height: 100px;">
                    ${task.description || "추가 상세 내용이 없습니다."}
                </div>
            </div>
        </div>

        <button onclick="deleteTask(${task.id})" 
                style="width: 100%; padding: 15px; background: none; border: 2px solid #fce8e6; color: #d93025; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 30px; font-size: 18px; transition: background 0.2s;">
            <span class="material-symbols-outlined" style="font-size: 26px;">delete</span>
            <span>Delete Task</span>
        </button>
    `;
}