// System credentials
const SYSTEM_USERNAME = "admin";
const SYSTEM_PASSWORD = "1234";

// Attendance records
let attendanceList = [];
const STORAGE_KEY = 'attendance_records_v1';

function saveAttendance() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceList));
    } catch (e) {
        console.warn('Could not save attendance:', e);
    }
}

function loadAttendance() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            attendanceList = JSON.parse(raw);
        }
    } catch (e) {
        console.warn('Could not load attendance:', e);
    }
}

/* Configurable beep for errors
   - Edit `ERROR_BEEP_CONFIG` to change sound
   - Set `file` to a local audio filepath (e.g., 'beep.mp3') to use an audio file instead */
const ERROR_BEEP_CONFIG = {
    type: 'sine',      // 'sine'|'square'|'triangle'|'sawtooth'
    frequency: 440,    // base frequency in Hz
    volume: 0.2,       // gain (0.0 - 1.0)
    duration: 0.12,    // seconds per beep
    gap: 0.06,         // seconds between beeps
    count: 2,          // number of beeps (2 = double-beep)
    file: ''           // optional: 'beep.mp3' to play a file instead of WebAudio
};

function playErrorBeep() {
    const cfg = ERROR_BEEP_CONFIG;

    // If a file is provided, play it as a fallback/preferred option
    if (cfg.file) {
        const audio = new Audio(cfg.file);
        audio.play().catch(e => console.warn('Error playing audio file:', e));
        return;
    }

    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        for (let i = 0; i < Math.max(1, cfg.count); i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = cfg.type;
            o.frequency.value = cfg.frequency;

            o.connect(g);
            g.connect(ctx.destination);

            const start = now + i * (cfg.duration + cfg.gap);
            const stop = start + cfg.duration;

            g.gain.setValueAtTime(0.0001, start);
            g.gain.exponentialRampToValueAtTime(cfg.volume, start + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, stop - 0.02);

            o.start(start);
            o.stop(stop);
        }
    } catch (e) {
        console.warn('Audio beep unsupported:', e);
    }
}

const SUCCESS_BEEP_CONFIG = {
    type: 'triangle',
    frequency: 660,
    volume: 0.15,
    duration: 0.12,
    gap: 0.05,
    count: 1,
    file: ''
};

function playBeep(cfg) {
    if (!cfg) return;
    if (cfg.file) {
        const audio = new Audio(cfg.file);
        audio.play().catch(e => console.warn('Error playing audio file:', e));
        return;
    }
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        for (let i = 0; i < Math.max(1, cfg.count); i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = cfg.type;
            o.frequency.value = cfg.frequency;
            o.connect(g);
            g.connect(ctx.destination);
            const start = now + i * (cfg.duration + cfg.gap);
            const stop = start + cfg.duration;
            g.gain.setValueAtTime(0.0001, start);
            g.gain.exponentialRampToValueAtTime(cfg.volume, start + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, stop - 0.02);
            o.start(start);
            o.stop(stop);
        }
    } catch (e) {
        console.warn('Audio beep unsupported:', e);
    }
}

function playErrorBeep() { playBeep(ERROR_BEEP_CONFIG); }
function playSuccessBeep() { playBeep(SUCCESS_BEEP_CONFIG); }

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");
    const usernameInput = usernameEl.value.trim();
    const passwordInput = passwordEl.value.trim();

    if (usernameInput === SYSTEM_USERNAME && passwordInput === SYSTEM_PASSWORD) {
        handleSuccessfulLogin(usernameInput);
        usernameEl.value = "";
        passwordEl.value = "";
        usernameEl.focus();
    } else {
        handleFailedLogin();
    }
});

function handleSuccessfulLogin(username) {
    const messageDiv = document.getElementById("message");
    const timestampDiv = document.getElementById("timestamp");

    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleString();

    messageDiv.style.color = "#2e7d32";
    messageDiv.textContent = "✅ Login successful. Welcome, " + username + "!";

    timestampDiv.textContent = "🕒 Login Time: " + formattedTime;

    attendanceList.push({
        username: username,
        time: formattedTime
    });

    saveAttendance();
    renderAttendanceList();
    updateControls();
    playSuccessBeep();
}

function handleFailedLogin() {
    const messageDiv = document.getElementById("message");

    messageDiv.style.color = "#c62828";
    messageDiv.textContent = "❌ Invalid username or password.";

    playErrorBeep();
}

/* Render attendance entries into the UI list */
function renderAttendanceList() {
    const ul = document.getElementById("attendanceList");
    ul.innerHTML = "";

    attendanceList.forEach((record, idx) => {
        const li = document.createElement("li");
        li.style.padding = "6px 0";
        li.style.borderBottom = "1px solid #f5f5f5";
        li.textContent = `${record.username} — ${record.time}`;
        ul.appendChild(li);
    });
}

function getAttendanceCSVString() {
    let csvData = "Username,Timestamp\n";

    attendanceList.forEach(record => {
        // Escape double quotes in fields
        const user = String(record.username).replace(/"/g, '""');
        const time = String(record.time).replace(/"/g, '""');
        csvData += `"${user}","${time}"\n`;
    });

    return csvData;
}

/* Export attendance to CSV and trigger download */
function exportAttendanceCSV() {
    if (attendanceList.length === 0) {
        alert("No attendance records to download.");
        return;
    }

    const csvData = getAttendanceCSVString();
    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = "attendance_summary.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
}   

/* Clear attendance records */
let _lastClearedBackup = null;
let _toastTimer = null;

function showToast(message, { undoText = 'Undo', onUndo = null, timeout = 5000 } = {}) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    const undoBtn = document.getElementById('toastUndoBtn');

    msg.textContent = message;
    undoBtn.textContent = undoText;

    // remove previous handler
    undoBtn.onclick = null;
    if (onUndo) {
        undoBtn.onclick = function () {
            onUndo();
            hideToast();
        };
        undoBtn.style.display = '';
    } else {
        undoBtn.style.display = 'none';
    }

    toast.style.display = 'flex';

    if (_toastTimer) clearTimeout(_toastTimer);
    if (timeout > 0) {
        _toastTimer = setTimeout(() => { hideToast(); }, timeout);
    }
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.style.display = 'none';
    if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
}

function clearAttendance() {
    if (!confirm("Clear all attendance records?")) return;

    // Backup in case user wants to undo
    _lastClearedBackup = attendanceList.slice();

    attendanceList = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    renderAttendanceList();
    updateControls();

    const messageDiv = document.getElementById("message");
    messageDiv.style.color = "#555";
    messageDiv.textContent = "⚪ Attendance cleared.";
    document.getElementById("timestamp").textContent = "";

    showToast('Attendance cleared', { undoText: 'Undo', onUndo: () => {
        // restore backup
        if (_lastClearedBackup) {
            attendanceList = _lastClearedBackup.slice();
            try { saveAttendance(); } catch (e) { /* ignore */ }
            renderAttendanceList();
            updateControls();
            const messageDiv = document.getElementById("message");
            messageDiv.style.color = "#2e7d32";
            messageDiv.textContent = "✅ Attendance restored.";
            _lastClearedBackup = null;
        }
    }, timeout: 7000 });
}

/* Enable/disable controls based on attendance state */
function updateControls() {
    const downloadBtn = document.getElementById("downloadBtn");
    const clearBtn = document.getElementById("clearBtn");
    const hasRecords = attendanceList.length > 0;
    downloadBtn.disabled = !hasRecords;
    clearBtn.disabled = !hasRecords;
    downloadBtn.style.opacity = hasRecords ? "1" : "0.6";
    clearBtn.style.opacity = hasRecords ? "1" : "0.6";
}

/* Wire up buttons */
document.getElementById("downloadBtn").addEventListener("click", exportAttendanceCSV);
document.getElementById("clearBtn").addEventListener("click", clearAttendance);

/* Initial state */
loadAttendance();
renderAttendanceList();
updateControls();
