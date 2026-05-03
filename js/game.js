// Logica principal del juego
let players = [];
let currentPlayerIndex = 0;
let gameActive = false;
let usedQuestionIds = [];

const PLAYER_EMOJIS = ['🦁', '🦋', '🌸', '🐱', '🦄', '🐶', '🌟', '🎀', '🐰', '🍀', '🔥', '💎'];
const PLAYER_COLORS = ['#4caf50', '#2196f3', '#ffc107', '#f44336'];
const COLOR_OPTIONS = [
    { name: 'Verde', color: '#4caf50' },
    { name: 'Azul', color: '#2196f3' },
    { name: 'Amarillo', color: '#ffc107' },
    { name: 'Rojo', color: '#f44336' },
    { name: 'Rosa', color: '#e91e63' },
    { name: 'Morado', color: '#9c27b0' },
    { name: 'Naranja', color: '#ff9800' },
    { name: 'Cyan', color: '#00bcd4' },
    { name: 'Lima', color: '#8bc34a' },
    { name: 'Indigo', color: '#3f51b5' },
    { name: 'Coral', color: '#ff6f61' },
    { name: 'Turquesa', color: '#26a69a' }
];
const DEFAULT_EMOJIS = ['🦁', '🦋', '🌸', '🐱'];
let playerColors = [...PLAYER_COLORS];

// Popup de bienvenida
function showWelcome() {
    Swal.fire({
        html: `
            <div class="welcome-content">
                <span class="welcome-shield">&#128218;</span>
                <span class="welcome-name">Lidys Esther Marquez Torres</span>
                <span class="welcome-grade">Grado 10</span>
                <hr class="welcome-divider">
                <span class="welcome-subject">Literatura Medieval Española</span>
            </div>
        `,
        confirmButtonText: 'Comenzar',
        allowOutsideClick: false,
        customClass: { popup: 'medieval-popup welcome-popup', title: 'medieval-title' }
    });
}

function initStartScreen() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    const sel = document.getElementById('player-count');
    sel.removeEventListener('change', updatePlayerInputs);
    sel.addEventListener('change', updatePlayerInputs);
    updatePlayerInputs();
}

function updatePlayerInputs() {
    const count = parseInt(document.getElementById('player-count').value);
    const container = document.getElementById('player-inputs');

    container.innerHTML = '';
    playerColors = PLAYER_COLORS.slice(0, count);
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input-row';
        div.innerHTML = `
            <button type="button" class="player-emoji-btn" id="emoji-btn-${i}" onclick="pickEmoji(${i})">${DEFAULT_EMOJIS[i]}</button>
            <input type="text" id="player-name-${i}" placeholder="Jugador ${i + 1}" maxlength="15">
            <div class="color-badge" id="color-btn-${i}" style="background:${playerColors[i]};cursor:pointer;" onclick="pickColor(${i})"></div>
        `;
        container.appendChild(div);
    }
}

function pickEmoji(playerIndex) {
    const grid = PLAYER_EMOJIS.map(e =>
        `<button class="emoji-pick" data-emoji="${e}">${e}</button>`
    ).join('');

    Swal.fire({
        title: 'Elige tu ficha',
        html: `<div class="emoji-picker-grid">${grid}</div>`,
        showConfirmButton: false,
        customClass: { popup: 'medieval-popup', title: 'medieval-title' },
        didOpen: () => {
            Swal.getPopup().querySelectorAll('.emoji-pick').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById(`emoji-btn-${playerIndex}`).textContent = btn.dataset.emoji;
                    Swal.close();
                });
            });
        }
    });
}

function pickColor(playerIndex) {
    const grid = COLOR_OPTIONS.map(c =>
        `<button class="color-pick" data-color="${c.color}" style="background:${c.color}" title="${c.name}"></button>`
    ).join('');

    Swal.fire({
        title: 'Elige tu color',
        html: `<div class="color-picker-grid">${grid}</div>`,
        showConfirmButton: false,
        customClass: { popup: 'medieval-popup', title: 'medieval-title' },
        didOpen: () => {
            Swal.getPopup().querySelectorAll('.color-pick').forEach(btn => {
                btn.addEventListener('click', () => {
                    playerColors[playerIndex] = btn.dataset.color;
                    document.getElementById(`color-btn-${playerIndex}`).style.background = btn.dataset.color;
                    Swal.close();
                });
            });
        }
    });
}

function startGame() {
    const count = parseInt(document.getElementById('player-count').value);
    players = [];
    for (let i = 0; i < count; i++) {
        const input = document.getElementById(`player-name-${i}`);
        const emoji = document.getElementById(`emoji-btn-${i}`).textContent;
        players.push({
            name: input.value.trim() || `Jugador ${i + 1}`,
            color: playerColors[i],
            emoji: emoji,
            position: 1,
            correct: 0,
            incorrect: 0
        });
    }

    currentPlayerIndex = 0;
    gameActive = true;
    usedQuestionIds = [];

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';

    createBoard(document.getElementById('board'));
    updateTokens(players);
    updateSidebar();
    enableDice();
}

function updateSidebar() {
    const c = players[currentPlayerIndex];
    document.getElementById('turn-info').innerHTML = `
        <div class="current-turn">
            <div class="turn-token" style="background:${c.color}">${c.emoji}</div>
            <span>Turno de <strong>${c.name}</strong></span>
        </div>
    `;

    const list = document.getElementById('players-stats');
    list.innerHTML = '';
    players.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'player-stat' + (i === currentPlayerIndex ? ' active-player' : '');
        div.innerHTML = `
            <div class="stat-header">
                <div class="stat-token" style="background:${p.color}">${p.emoji}</div>
                <span class="stat-name">${p.name}</span>
                <span class="stat-pos">Casilla ${p.position}</span>
            </div>
            <div class="stat-scores">
                <span class="stat-correct">\u2714 ${p.correct}</span>
                <span class="stat-incorrect">\u2718 ${p.incorrect}</span>
            </div>
        `;
        list.appendChild(div);
    });
}

function enableDice() {
    const scene = document.getElementById('dice-scene');
    scene.style.pointerEvents = 'auto';
    scene.style.opacity = '1';
    scene.classList.add('dice-glow');
    document.getElementById('dice-hint').textContent = '';
}

function disableDice() {
    const scene = document.getElementById('dice-scene');
    scene.style.pointerEvents = 'none';
    scene.style.opacity = '0.5';
    scene.classList.remove('dice-glow');
    document.getElementById('dice-hint').textContent = 'Espera...';
}

function onDiceClick() {
    if (!gameActive) return;
    disableDice();
    playSound('dice');
    playSound('diceRoll');
    rollDice((result) => {
        document.getElementById('dice-hint').textContent = `Resultado: ${result}`;
        handleMove(result);
    });
}

function handleMove(diceResult) {
    const player = players[currentPlayerIndex];
    let target = player.position + diceResult;

    if (target > 20) {
        // Rebote: animar hasta 20, luego devolver
        let bounceTarget = 20 - (target - 20);
        if (bounceTarget < 1) bounceTarget = 1;
        animateToken(player, player.position, 20, players, () => {
            if (bounceTarget === 20) {
                checkLanding(player);
            } else {
                animateToken(player, 20, bounceTarget, players, () => {
                    checkLanding(player);
                });
            }
        });
    } else {
        animateToken(player, player.position, target, players, () => {
            checkLanding(player);
        });
    }
}

function checkLanding(player) {
    if (player.position === 20) { showVictory(player); return; }

    const ladder = LADDERS.find(l => l.from === player.position);
    if (ladder) {
        showQuestion(player, 'ladder', ladder);
        return;
    }

    const snake = SNAKES.find(s => s.from === player.position);
    if (snake) {
        showQuestion(player, 'snake', snake);
        return;
    }

    nextTurn();
}

let questionTimer = null;

function showQuestion(player, type, connection) {
    const q = getRandomQuestion(usedQuestionIds);
    usedQuestionIds.push(q.id);

    const isLadder = type === 'ladder';
    const title = isLadder
        ? '\uD83E\uDE9C Escalera! Responde para subir'
        : '\uD83D\uDC0D Serpiente! Responde para salvarte';

    const TIMER_SECONDS = 25;

    Swal.fire({
        title: title,
        html: `
            <div class="question-timer-bar"><div class="timer-fill" id="timer-fill"></div></div>
            <div class="question-timer-text" id="timer-text">${TIMER_SECONDS}s</div>
            <p class="swal-question-text">${q.question}</p>
            <div class="swal-options">
                ${q.options.map((opt, i) => `
                    <button class="swal-option-btn" data-index="${i}">${String.fromCharCode(65 + i)}) ${opt}</button>
                `).join('')}
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: { popup: 'medieval-popup', title: 'medieval-title' },
        didOpen: () => {
            let timeLeft = TIMER_SECONDS;
            const fill = document.getElementById('timer-fill');
            const text = document.getElementById('timer-text');
            let answered = false;

            questionTimer = setInterval(() => {
                timeLeft--;
                if (text) text.textContent = `${timeLeft}s`;
                if (fill) fill.style.width = `${(timeLeft / TIMER_SECONDS) * 100}%`;

                if (timeLeft <= 5 && timeLeft > 0) {
                    playSound('tick');
                    if (fill) fill.style.background = '#f44336';
                    if (text) text.style.color = '#f44336';
                }

                if (timeLeft <= 0 && !answered) {
                    answered = true;
                    clearInterval(questionTimer);
                    playSound('timeout');
                    // Tiempo agotado = respuesta incorrecta
                    Swal.getPopup().querySelectorAll('.swal-option-btn').forEach(b => {
                        b.style.pointerEvents = 'none'; b.style.opacity = '0.5';
                    });
                    handleAnswer(player, -1, q.correct, q, type, connection);
                }
            }, 1000);

            Swal.getPopup().querySelectorAll('.swal-option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (answered) return;
                    answered = true;
                    clearInterval(questionTimer);
                    Swal.getPopup().querySelectorAll('.swal-option-btn').forEach(b => {
                        b.style.pointerEvents = 'none'; b.style.opacity = '0.5';
                    });
                    btn.style.opacity = '1';
                    handleAnswer(player, parseInt(btn.dataset.index), q.correct, q, type, connection);
                });
            });
        },
        willClose: () => {
            if (questionTimer) clearInterval(questionTimer);
        }
    });
}

function handleAnswer(player, selected, correct, question, type, connection) {
    const isCorrect = selected === correct;
    const isLadder = type === 'ladder';
    const timedOut = selected === -1;

    if (isLadder) {
        if (isCorrect) {
            player.correct++;
            playSound('correct');
            playSound('ladder');
            Swal.fire({
                title: '\u2705 Correcto!',
                html: `<p>\uD83E\uDE9C <strong>${player.name}</strong> sube por la escalera!<br>De casilla <strong>${connection.from}</strong> a casilla <strong>${connection.to}</strong>!</p>`,
                icon: 'success', confirmButtonText: 'Continuar',
                customClass: { popup: 'medieval-popup', title: 'medieval-title' }
            }).then(() => {
                animateToken(player, player.position, connection.to, players, () => {
                    updateSidebar();
                    if (player.position === 20) showVictory(player);
                    else nextTurn();
                });
            });
        } else {
            player.incorrect++;
            playSound('incorrect');
            Swal.fire({
                title: timedOut ? '\u23F0 Tiempo agotado!' : '\u274C Incorrecto!',
                html: `<p><strong>${player.name}</strong> no pudo subir la escalera.<br>Se queda en casilla <strong>${player.position}</strong>.</p>
                       <p class="correct-answer">Respuesta: <strong>${question.options[correct]}</strong></p>`,
                icon: 'error', confirmButtonText: 'Continuar',
                customClass: { popup: 'medieval-popup', title: 'medieval-title' }
            }).then(() => { updateSidebar(); nextTurn(); });
        }
    } else {
        if (isCorrect) {
            player.correct++;
            playSound('correct');
            Swal.fire({
                title: '\u2705 Te salvaste!',
                html: `<p>\uD83D\uDC0D <strong>${player.name}</strong> respondio bien y la serpiente no lo muerde!<br>Se queda en casilla <strong>${player.position}</strong>.</p>`,
                icon: 'success', confirmButtonText: 'Continuar',
                customClass: { popup: 'medieval-popup', title: 'medieval-title' }
            }).then(() => { updateSidebar(); nextTurn(); });
        } else {
            player.incorrect++;
            playSound('incorrect');
            playSound('snake');
            Swal.fire({
                title: timedOut ? '\u23F0 Tiempo agotado!' : '\u274C La serpiente te atrapo!',
                html: `<p>\uD83D\uDC0D <strong>${player.name}</strong> baja por la serpiente!<br>De casilla <strong>${connection.from}</strong> a casilla <strong>${connection.to}</strong>!</p>
                       <p class="correct-answer">Respuesta: <strong>${question.options[correct]}</strong></p>`,
                icon: 'error', confirmButtonText: 'Continuar',
                customClass: { popup: 'medieval-popup', title: 'medieval-title' }
            }).then(() => {
                animateToken(player, player.position, connection.to, players, () => {
                    updateSidebar(); nextTurn();
                });
            });
        }
    }
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateSidebar();
    enableDice();
}

function showVictory(winner) {
    gameActive = false;
    playSound('victory');
    launchConfetti();

    let stats = '<div class="victory-stats">';
    players.forEach(p => {
        stats += `<div class="victory-player ${p === winner ? 'winner-row' : ''}">
            <div class="victory-token" style="background:${p.color}">${p.emoji}</div>
            <span class="victory-name">${p === winner ? '\uD83C\uDFC6 ' : ''}${p.name}</span>
            <span class="victory-score">\u2714 ${p.correct} | \u2718 ${p.incorrect}</span>
        </div>`;
    });
    stats += '</div>';

    Swal.fire({
        title: 'Victoria!',
        html: `<span class="victory-crown">\uD83C\uDFC6</span>
               <p class="victory-text">${winner.name} ha ganado!</p>
               <h3 style="margin:0.5rem 0;color:#e91e63;">Estadisticas</h3>${stats}`,
        confirmButtonText: 'Jugar de Nuevo',
        allowOutsideClick: false,
        customClass: { popup: 'medieval-popup victory-popup', title: 'medieval-title' }
    }).then(() => restartGame());
}

function restartGame() {
    gameActive = false; players = []; currentPlayerIndex = 0; usedQuestionIds = [];
    initStartScreen();
}

// ===== EDITOR =====
function openQuestionEditor() {
    const questions = loadQuestions();
    let html = questions.map((q, i) => `
        <div class="editor-question"><div class="eq-header">
            <span class="eq-num">${i + 1}.</span>
            <span class="eq-text">${q.question}</span>
            <div class="eq-actions">
                <button class="eq-edit-btn" onclick="editQuestion(${q.id})">Editar</button>
                <button class="eq-delete-btn" onclick="deleteQuestion(${q.id})">X</button>
            </div>
        </div></div>`).join('');

    Swal.fire({
        title: '\u270E Editor de Preguntas',
        html: `<div class="editor-container"><div class="editor-list">${html}</div>
            <div class="editor-buttons">
                <button class="editor-add-btn" onclick="addQuestion()">+ Agregar</button>
                <button class="editor-reset-btn" onclick="resetAllQuestions()">Restaurar</button>
            </div></div>`,
        confirmButtonText: 'Cerrar', width: '700px',
        customClass: { popup: 'medieval-popup', title: 'medieval-title' }
    });
}

function addQuestion() {
    showQuestionForm(null, (data) => {
        const qs = loadQuestions();
        qs.push({ id: qs.reduce((m, q) => Math.max(m, q.id), 0) + 1, ...data });
        saveQuestions(qs); openQuestionEditor();
    });
}

function editQuestion(id) {
    const q = loadQuestions().find(x => x.id === id);
    if (!q) return;
    showQuestionForm(q, (data) => {
        const qs = loadQuestions();
        const i = qs.findIndex(x => x.id === id);
        if (i !== -1) qs[i] = { id, ...data };
        saveQuestions(qs); openQuestionEditor();
    });
}

function deleteQuestion(id) {
    Swal.fire({
        title: 'Eliminar?', icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Si', cancelButtonText: 'No',
        customClass: { popup: 'medieval-popup', title: 'medieval-title' }
    }).then(r => { if (r.isConfirmed) { saveQuestions(loadQuestions().filter(q => q.id !== id)); openQuestionEditor(); } });
}

function resetAllQuestions() {
    Swal.fire({
        title: 'Restaurar originales?', icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Si', cancelButtonText: 'No',
        customClass: { popup: 'medieval-popup', title: 'medieval-title' }
    }).then(r => { if (r.isConfirmed) { resetQuestions(); openQuestionEditor(); } });
}

function showQuestionForm(ex, onSave) {
    Swal.fire({
        title: ex ? 'Editar' : 'Nueva Pregunta',
        html: `<div class="question-form">
            <label>Pregunta:</label><textarea id="qf-q" rows="2">${ex ? ex.question : ''}</textarea>
            <label>A:</label><input id="qf-0" value="${ex ? ex.options[0] : ''}">
            <label>B:</label><input id="qf-1" value="${ex ? ex.options[1] : ''}">
            <label>C:</label><input id="qf-2" value="${ex ? ex.options[2] : ''}">
            <label>D:</label><input id="qf-3" value="${ex ? ex.options[3] : ''}">
            <label>Correcta:</label><select id="qf-c">
                <option value="0" ${ex&&ex.correct===0?'selected':''}>A</option>
                <option value="1" ${ex&&ex.correct===1?'selected':''}>B</option>
                <option value="2" ${ex&&ex.correct===2?'selected':''}>C</option>
                <option value="3" ${ex&&ex.correct===3?'selected':''}>D</option>
            </select></div>`,
        showCancelButton: true, confirmButtonText: 'Guardar', cancelButtonText: 'Cancelar',
        width: '600px', customClass: { popup: 'medieval-popup', title: 'medieval-title' },
        preConfirm: () => {
            const question = document.getElementById('qf-q').value.trim();
            const options = [0,1,2,3].map(i => document.getElementById(`qf-${i}`).value.trim());
            const correct = parseInt(document.getElementById('qf-c').value);
            if (!question || options.some(o => !o)) { Swal.showValidationMessage('Completa todo'); return false; }
            return { question, options, correct };
        }
    }).then(r => { if (r.isConfirmed) onSave(r.value); });
}

function showRules() {
    Swal.fire({
        title: '\uD83D\uDCCB Reglas del Juego',
        html: `<div style="text-align:left;font-size:0.95rem;line-height:1.6;">
            <p><strong>\uD83C\uDFB2 Objetivo:</strong> Llegar a la casilla 20 (Finish) antes que los demas.</p>
            <p><strong>\uD83D\uDC49 Turno:</strong> Haz clic en el dado para lanzarlo. Tu ficha avanzara el numero de casillas que salga.</p>
            <p><strong>\uD83E\uDE9C Escaleras:</strong> Si caes en la base de una escalera, aparecera una pregunta. Si respondes <span style="color:#4caf50;font-weight:700;">correctamente</span>, subes por la escalera!</p>
            <p><strong>\uD83D\uDC0D Serpientes:</strong> Si caes en la cabeza de una serpiente, aparecera una pregunta. Si respondes <span style="color:#f44336;font-weight:700;">incorrectamente</span>, bajas por la serpiente!</p>
            <p><strong>\u23F0 Tiempo:</strong> Tienes 25 segundos para responder cada pregunta. Si se acaba el tiempo, cuenta como incorrecta.</p>
            <p><strong>\uD83C\uDFC1 Ganar:</strong> Debes caer exactamente en la casilla 20. Si te pasas, rebotaras hacia atras.</p>
        </div>`,
        confirmButtonText: 'Entendido!',
        width: '550px',
        customClass: { popup: 'medieval-popup', title: 'medieval-title' }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showWelcome();
    initStartScreen();
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('dice-scene').addEventListener('click', onDiceClick);
    document.getElementById('btn-edit-questions').addEventListener('click', openQuestionEditor);
    document.getElementById('btn-rules').addEventListener('click', showRules);
});
