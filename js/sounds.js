// Sonidos generados con Web Audio API - funciona 100% local sin archivos de audio
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        switch (type) {
            case 'dice': playDiceSound(ctx); break;
            case 'diceRoll': playDiceRollSound(ctx); break;
            case 'move': playMoveSound(ctx); break;
            case 'correct': playCorrectSound(ctx); break;
            case 'incorrect': playIncorrectSound(ctx); break;
            case 'ladder': playLadderSound(ctx); break;
            case 'snake': playSnakeSound(ctx); break;
            case 'victory': playVictorySound(ctx); break;
            case 'tick': playTickSound(ctx); break;
            case 'timeout': playTimeoutSound(ctx); break;
        }
    } catch (e) { /* silenciar errores de audio */ }
}

function playDiceSound(ctx) {
    // No hace nada, el sonido principal es diceRoll
}

function playDiceRollSound(ctx) {
    // Simular dado cayendo y rebotando en mesa de madera
    // Varios golpes secos que se van haciendo mas rapidos y suaves
    const hits = [
        { time: 0,    vol: 0.7, freq: 180, dur: 0.08 },
        { time: 0.12, vol: 0.6, freq: 220, dur: 0.06 },
        { time: 0.22, vol: 0.5, freq: 250, dur: 0.05 },
        { time: 0.30, vol: 0.4, freq: 280, dur: 0.04 },
        { time: 0.36, vol: 0.35, freq: 300, dur: 0.035 },
        { time: 0.41, vol: 0.3, freq: 320, dur: 0.03 },
        { time: 0.45, vol: 0.25, freq: 340, dur: 0.025 },
        { time: 0.48, vol: 0.2, freq: 360, dur: 0.02 },
        { time: 0.50, vol: 0.15, freq: 380, dur: 0.02 },
    ];

    hits.forEach(h => {
        // Golpe seco (ruido filtrado)
        const bufLen = Math.floor(ctx.sampleRate * h.dur);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = h.freq;
        filt.Q.value = 5;
        const g = ctx.createGain();
        g.gain.setValueAtTime(h.vol, ctx.currentTime + h.time);
        src.connect(filt).connect(g).connect(ctx.destination);
        src.start(ctx.currentTime + h.time);

        // Tono corto de impacto
        const osc = ctx.createOscillator();
        const og = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = h.freq * 2;
        og.gain.setValueAtTime(h.vol * 0.4, ctx.currentTime + h.time);
        og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + h.time + h.dur);
        osc.connect(og).connect(ctx.destination);
        osc.start(ctx.currentTime + h.time);
        osc.stop(ctx.currentTime + h.time + h.dur);
    });

    // Rodamiento entre rebotes
    const rollDur = 0.55;
    const rollBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * rollDur), ctx.sampleRate);
    const rollData = rollBuf.getChannelData(0);
    for (let i = 0; i < rollData.length; i++) {
        const t = i / ctx.sampleRate;
        const env = Math.sin(t / rollDur * Math.PI) * 0.3;
        rollData[i] = (Math.random() * 2 - 1) * env;
    }
    const rollSrc = ctx.createBufferSource();
    rollSrc.buffer = rollBuf;
    const rollFilt = ctx.createBiquadFilter();
    rollFilt.type = 'bandpass';
    rollFilt.frequency.value = 600;
    rollFilt.Q.value = 3;
    const rollGain = ctx.createGain();
    rollGain.gain.setValueAtTime(0.35, ctx.currentTime);
    rollSrc.connect(rollFilt).connect(rollGain).connect(ctx.destination);
    rollSrc.start(ctx.currentTime);
}

function playMoveSound(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
}

function playCorrectSound(ctx) {
    [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
}

function playIncorrectSound(ctx) {
    [400, 300].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.3);
    });
}

function playLadderSound(ctx) {
    [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.45, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.25);
    });
}

function playSnakeSound(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.7);
}

function playVictorySound(ctx) {
    const melody = [523, 659, 784, 1047, 784, 1047];
    melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
        gain.gain.setValueAtTime(0.5, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.35);
    });
}

function playTickSound(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.06);
}

function playTimeoutSound(ctx) {
    [500, 400, 300].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.25);
    });
}

// ===== CONFETTI =====
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx2d = canvas.getContext('2d');
    const colors = ['#e91e63', '#ff9800', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#00bcd4'];
    const pieces = [];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 3 + 2,
            vx: Math.random() * 2 - 1,
            rot: Math.random() * 360,
            rotSpeed: Math.random() * 10 - 5
        });
    }

    let frame = 0;
    function draw() {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        pieces.forEach(p => {
            if (p.y < canvas.height + 20) alive = true;
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotSpeed;
            p.vy += 0.05;
            ctx2d.save();
            ctx2d.translate(p.x, p.y);
            ctx2d.rotate(p.rot * Math.PI / 180);
            ctx2d.fillStyle = p.color;
            ctx2d.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx2d.restore();
        });
        frame++;
        if (alive && frame < 300) {
            requestAnimationFrame(draw);
        } else {
            canvas.style.display = 'none';
        }
    }
    requestAnimationFrame(draw);
}
