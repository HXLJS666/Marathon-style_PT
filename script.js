// DOM元素
const currentTimeElement = document.querySelector('.current-time');
const pomodoroTimerElement = document.getElementById('pomodoro-timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.querySelector('.settings-btn');
const settingsPanel = document.querySelector('.settings-panel');
const closeBtn = document.querySelector('.close-btn');
const saveSettingsBtn = document.getElementById('save-settings');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const roundsInput = document.getElementById('rounds');
const errorPopup = document.querySelector('.error-popup');
const roundsIndicator = document.querySelector('.rounds-indicator');

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

// 生成轮数指示器
function generateRoundsIndicator() {
    // 清空现有的轮数指示器
    roundsIndicator.innerHTML = '';
    
    // 根据轮数生成新的轮数指示器，从右到左排列
    for (let i = pomodoroState.rounds; i >= 1; i--) {
        const roundElement = document.createElement('div');
        roundElement.classList.add('round-indicator');
        
        // 设置轮数指示器的状态
        if (i < pomodoroState.currentRound) {
            roundElement.classList.add('completed');
        } else if (i === pomodoroState.currentRound) {
            roundElement.classList.add('current');
            if (pomodoroState.isRunning) {
                roundElement.classList.add('running');
            }
        }
        
        roundsIndicator.appendChild(roundElement);
    }
}

// 更新轮数指示器
function updateRoundsIndicator() {
    generateRoundsIndicator();
}

// 更新番茄钟显示
function updatePomodoroDisplay() {
    pomodoroTimerElement.textContent = formatTime(pomodoroState.currentTime);
    updateRoundsIndicator();
}

// 开始番茄钟
function startPomodoro() {
    if (!pomodoroState.isRunning || pomodoroState.isPaused) {
        pomodoroState.isRunning = true;
        pomodoroState.isPaused = false;
        
        // 更新轮数指示器状态
        updateRoundsIndicator();
        
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
        pomodoroState.isRunning = false;
        clearInterval(pomodoroState.timerInterval);
        // 更新轮数指示器状态
        updateRoundsIndicator();
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
    // 更新轮数指示器状态
    updateRoundsIndicator();
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
    // 更新轮数指示器状态
    updateRoundsIndicator();
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
        // 更新轮数指示器状态
        updateRoundsIndicator();
        alert('设置已保存！');
    } else {
        alert('请输入有效的设置值！');
    }
}

// 显示设置面板
function showSettings() {
    settingsPanel.classList.add('active');
}

// 隐藏设置面板
function hideSettings() {
    settingsPanel.classList.remove('active');
}

// 显示错误提示
function showError() {
    errorPopup.classList.add('active');
    // 使用CSS动画控制显示和消失，不再需要JavaScript定时器
    setTimeout(() => {
        errorPopup.classList.remove('active');
    }, 1500);
}

// 保存设置
async function saveSettings() {
    // 正则检测，确保输入是纯数字
    const numberRegex = /^\d+$/;
    
    if (!numberRegex.test(workTimeInput.value) || !numberRegex.test(breakTimeInput.value) || !numberRegex.test(roundsInput.value)) {
        showError();
        return;
    }
    
    const workTime = parseInt(workTimeInput.value);
    const breakTime = parseInt(breakTimeInput.value);
    const rounds = parseInt(roundsInput.value);
    
    if (workTime >= 1 && workTime <= 60 && breakTime >= 1 && breakTime <= 30 && rounds >= 1 && rounds <= 10) {
        pomodoroState.workTime = workTime * 60;
        pomodoroState.breakTime = breakTime * 60;
        pomodoroState.rounds = rounds;
        
        // 如果番茄钟没有运行，重置到新的工作时间
        if (!pomodoroState.isRunning) {
            pomodoroState.currentTime = pomodoroState.workTime;
            pomodoroState.currentRound = 1;
            pomodoroState.isWorkSession = true;
            updatePomodoroDisplay();
            // 更新轮数指示器状态
            updateRoundsIndicator();
        }
        
        // 保存配置到Config.json
        await saveConfig();
        
        hideSettings();
    } else {
        showError();
    }
}

// 从localStorage读取配置
function loadConfig() {
    try {
        const configStr = localStorage.getItem('pomodoroConfig');
        if (configStr) {
            const config = JSON.parse(configStr);
            
            // 加载颜色配置
            document.documentElement.style.setProperty('--base-color', config.colors.baseColor);
            document.documentElement.style.setProperty('--highlight-color', config.colors.highlightColor);
            
            // 加载工作时间、休息时间、轮数配置
            pomodoroState.workTime = config.settings.workTime * 60;
            pomodoroState.breakTime = config.settings.breakTime * 60;
            pomodoroState.rounds = config.settings.rounds;
            pomodoroState.currentTime = pomodoroState.workTime;
            
            // 更新输入框的值
            workTimeInput.value = config.settings.workTime;
            breakTimeInput.value = config.settings.breakTime;
            roundsInput.value = config.settings.rounds;
            
            console.log('配置加载成功:', config);
        } else {
            // 从Config.json读取默认配置
            fetch('Config.json')
                .then(response => response.json())
                .then(config => {
                    // 加载颜色配置
                    document.documentElement.style.setProperty('--base-color', config.colors.baseColor);
                    document.documentElement.style.setProperty('--highlight-color', config.colors.highlightColor);
                    
                    // 加载工作时间、休息时间、轮数配置
                    pomodoroState.workTime = config.settings.workTime * 60;
                    pomodoroState.breakTime = config.settings.breakTime * 60;
                    pomodoroState.rounds = config.settings.rounds;
                    pomodoroState.currentTime = pomodoroState.workTime;
                    
                    // 更新输入框的值
                    workTimeInput.value = config.settings.workTime;
                    breakTimeInput.value = config.settings.breakTime;
                    roundsInput.value = config.settings.rounds;
                    
                    console.log('从Config.json加载默认配置:', config);
                })
                .catch(error => {
                    console.error('从Config.json加载默认配置失败:', error);
                    // 使用默认配置
                    console.log('使用硬编码默认配置');
                });
        }
    } catch (error) {
        console.error('配置加载失败:', error);
        // 使用默认配置
        console.log('使用硬编码默认配置');
    }
}

// 保存配置到localStorage
function saveConfig() {
    try {
        const config = {
            colors: {
                baseColor: getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim(),
                highlightColor: getComputedStyle(document.documentElement).getPropertyValue('--highlight-color').trim()
            },
            settings: {
                workTime: parseInt(workTimeInput.value),
                breakTime: parseInt(breakTimeInput.value),
                rounds: parseInt(roundsInput.value)
            }
        };
        
        localStorage.setItem('pomodoroConfig', JSON.stringify(config, null, 2));
        console.log('配置保存成功:', config);
    } catch (error) {
        console.error('配置保存失败:', error);
    }
}

// 初始化
function init() {
    // 加载配置
    loadConfig();
    
    // 更新当前时间
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 初始化番茄钟
    updatePomodoroDisplay();
    // 生成轮数指示器
    generateRoundsIndicator();
    
    // 事件监听器
    startBtn.addEventListener('click', startPomodoro);
    pauseBtn.addEventListener('click', pausePomodoro);
    resetBtn.addEventListener('click', resetPomodoro);
    settingsBtn.addEventListener('click', showSettings);
    closeBtn.addEventListener('click', hideSettings);
    saveSettingsBtn.addEventListener('click', saveSettings);
}

// 启动应用
init();

/*
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
*/