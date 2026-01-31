// DOM元素
const currentTimeElement = document.querySelector('.current-time');
const pomodoroTimerElement = document.getElementById('pomodoro-timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// 番茄钟状态
let pomodoroState = {
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60, // 默认工作时间（秒）
    workTime: 25 * 60,    // 工作时间（秒）
    breakTime: 5 * 60,    // 休息时间（秒）
    rounds: 4,            // 轮数
    currentRound: 1,      // 当前轮数
    isWorkSession: true,  // 是否工作阶段
    timerInterval: null   // 定时器
};

// 更新当前时间显示
function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// 格式化时间（秒转分:秒）
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// 更新番茄钟显示
function updatePomodoroDisplay() {
    pomodoroTimerElement.textContent = formatTime(pomodoroState.currentTime);
}

// 开始番茄钟
function startPomodoro() {
    if (!pomodoroState.isRunning) {
        pomodoroState.isRunning = true;
        pomodoroState.isPaused = false;
        
        pomodoroState.timerInterval = setInterval(() => {
            pomodoroState.currentTime--;
            updatePomodoroDisplay();
            
            if (pomodoroState.currentTime <= 0) {
                completeSession();
            }
        }, 1000);
    }
}

// 暂停番茄钟
function pausePomodoro() {
    if (pomodoroState.isRunning && !pomodoroState.isPaused) {
        pomodoroState.isPaused = true;
        clearInterval(pomodoroState.timerInterval);
    }
}

// 重置番茄钟
function resetPomodoro() {
    clearInterval(pomodoroState.timerInterval);
    pomodoroState.isRunning = false;
    pomodoroState.isPaused = false;
    pomodoroState.currentTime = pomodoroState.workTime;
    pomodoroState.currentRound = 1;
    pomodoroState.isWorkSession = true;
    updatePomodoroDisplay();
}

// 完成一个会话（工作或休息）
function completeSession() {
    clearInterval(pomodoroState.timerInterval);
    pomodoroState.isRunning = false;
    
    // 切换工作/休息状态
    if (pomodoroState.isWorkSession) {
        // 工作时间结束，切换到休息时间
        pomodoroState.isWorkSession = false;
        pomodoroState.currentTime = pomodoroState.breakTime;
        
        // 检查是否完成所有轮数
        if (pomodoroState.currentRound >= pomodoroState.rounds) {
            alert('恭喜！所有轮数已完成！');
            resetPomodoro();
            return;
        }
    } else {
        // 休息时间结束，切换到工作时间
        pomodoroState.isWorkSession = true;
        pomodoroState.currentTime = pomodoroState.workTime;
        pomodoroState.currentRound++;
    }
    
    updatePomodoroDisplay();
    alert(pomodoroState.isWorkSession ? '休息结束，开始工作！' : '工作结束，开始休息！');
}

// 保存设置
function saveSettings() {
    const rounds = parseInt(roundsInput.value);
    const workTime = parseInt(workTimeInput.value);
    const breakTime = parseInt(breakTimeInput.value);
    
    if (rounds >= 1 && rounds <= 10 && workTime >= 1 && workTime <= 60 && breakTime >= 1 && breakTime <= 30) {
        pomodoroState.rounds = rounds;
        pomodoroState.workTime = workTime * 60;
        pomodoroState.breakTime = breakTime * 60;
        resetPomodoro();
        alert('设置已保存！');
    } else {
        alert('请输入有效的设置值！');
    }
}

// 初始化
function init() {
    // 更新当前时间
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 初始化番茄钟
    updatePomodoroDisplay();
    
    // 事件监听器
    startBtn.addEventListener('click', startPomodoro);
    pauseBtn.addEventListener('click', pausePomodoro);
    resetBtn.addEventListener('click', resetPomodoro);
}

// 启动应用
init();

// 尝试进入全屏模式
function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err.message);
        });
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen().catch(err => {
            console.log('无法进入全屏模式:', err.message);
        });
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err.message);
        });
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err.message);
        });
    }
}

// 页面加载完成后尝试进入全屏
window.addEventListener('load', function() {
    // 添加一个短暂延迟，确保页面完全加载
    setTimeout(enterFullscreen, 500);
});

// 为用户交互添加全屏请求（现代浏览器要求）
document.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    }
}, { once: true });