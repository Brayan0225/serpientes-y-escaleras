// Tablero de 20 casillas con serpientes y escaleras dibujadas
const COLS = 5;
const ROWS = 4;

// Escaleras: base (from) → tope (to). Caes en from → pregunta → aciertas = subes a to
const LADDERS = [
    { from: 2, to: 12, color: '#fbc02d' },
    { from: 5, to: 15, color: '#2196f3' },
    { from: 7, to: 17, color: '#e91e63' }
];

// Serpientes: cabeza (from) → cola (to). Caes en from → pregunta → fallas = bajas a to
const SNAKES = [
    { from: 19, to: 9, color: '#4caf50', stripe: '#2e7d32' },
    { from: 16, to: 6, color: '#e91e63', stripe: '#ad1457' },
    { from: 13, to: 3, color: '#ff9800', stripe: '#e65100' }
];

// Casillas especiales = bases de escaleras + cabezas de serpientes
const LADDER_CELLS = LADDERS.map(l => l.from);
const SNAKE_CELLS = SNAKES.map(s => s.from);
const SPECIAL_CELLS = [...LADDER_CELLS, ...SNAKE_CELLS];

function createBoard(container) {
    container.innerHTML = '';
    const grid = [];

    for (let row = 0; row < ROWS; row++) {
        const rowCells = [];
        for (let col = 0; col < COLS; col++) {
            rowCells.push(row * COLS + col + 1);
        }
        if (row % 2 === 1) rowCells.reverse();
        grid.push(rowCells);
    }

    // Renderizar de arriba (fila 3) hacia abajo (fila 0)
    for (let row = ROWS - 1; row >= 0; row--) {
        for (let col = 0; col < COLS; col++) {
            const cellNum = grid[row][col];
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${cellNum}`;
            cell.dataset.cell = cellNum;

            // Colores alternados
            if (cellNum % 2 === 0) {
                cell.classList.add('cell-yellow');
            } else {
                cell.classList.add('cell-pink');
            }

            if (cellNum === 1) cell.classList.add('start-cell');
            if (cellNum === 20) cell.classList.add('finish-cell');
            if (SPECIAL_CELLS.includes(cellNum)) cell.classList.add('special-cell');

            if (cellNum === 1) {
                cell.innerHTML = '<span class="cell-label">Start</span>';
            } else if (cellNum === 20) {
                cell.innerHTML = '<span class="cell-label">Finish</span><span class="cell-finish-icon">\u2B50</span>';
            } else {
                let inner = `<span class="cell-number">${cellNum}</span>`;
                if (SPECIAL_CELLS.includes(cellNum)) {
                    inner += '<span class="cell-icon">\uD83D\uDCDA</span>';
                }
                cell.innerHTML = inner;
            }

            const tokensDiv = document.createElement('div');
            tokensDiv.className = 'cell-tokens';
            cell.appendChild(tokensDiv);

            container.appendChild(cell);
        }
    }

    // Agregar flechas de direccion del camino serpentina
    addDirectionArrows(container);

    // Dibujar serpientes y escaleras despues de renderizar
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            drawSnakesAndLadders();
        });
    });
}

function getCellCenter(cellNum) {
    const board = document.getElementById('board');
    const cell = document.getElementById(`cell-${cellNum}`);
    if (!board || !cell) return null;

    const boardRect = board.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    return {
        x: cellRect.left - boardRect.left + cellRect.width / 2,
        y: cellRect.top - boardRect.top + cellRect.height / 2
    };
}

function drawSnakesAndLadders() {
    const svg = document.getElementById('board-svg');
    const board = document.getElementById('board');
    if (!svg || !board) return;

    svg.setAttribute('width', board.offsetWidth);
    svg.setAttribute('height', board.offsetHeight);
    svg.setAttribute('viewBox', `0 0 ${board.offsetWidth} ${board.offsetHeight}`);
    svg.innerHTML = '';

    // Definiciones (gradientes, filtros)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Filtro de sombra
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shadow');
    filter.innerHTML = '<feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.25"/>';
    defs.appendChild(filter);

    svg.appendChild(defs);

    // Dibujar escaleras
    LADDERS.forEach(ladder => {
        const from = getCellCenter(ladder.from);
        const to = getCellCenter(ladder.to);
        if (!from || !to) return;
        drawLadder(svg, from, to, ladder.color);
    });

    // Dibujar serpientes
    SNAKES.forEach(snake => {
        const from = getCellCenter(snake.from);
        const to = getCellCenter(snake.to);
        if (!from || !to) return;
        drawSnake(svg, from, to, snake.color, snake.stripe);
    });
}

function drawLadder(svg, from, to, color) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('filter', 'url(#shadow)');
    g.setAttribute('opacity', '0.85');

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len * 12; // perpendicular
    const ny = dx / len * 12;

    // Rieles
    const rail1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rail1.setAttribute('x1', from.x + nx);
    rail1.setAttribute('y1', from.y + ny);
    rail1.setAttribute('x2', to.x + nx);
    rail1.setAttribute('y2', to.y + ny);
    rail1.setAttribute('stroke', color);
    rail1.setAttribute('stroke-width', '5');
    rail1.setAttribute('stroke-linecap', 'round');

    const rail2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rail2.setAttribute('x1', from.x - nx);
    rail2.setAttribute('y1', from.y - ny);
    rail2.setAttribute('x2', to.x - nx);
    rail2.setAttribute('y2', to.y - ny);
    rail2.setAttribute('stroke', color);
    rail2.setAttribute('stroke-width', '5');
    rail2.setAttribute('stroke-linecap', 'round');

    g.appendChild(rail1);
    g.appendChild(rail2);

    // Peldanos
    const numRungs = 5;
    for (let i = 1; i <= numRungs; i++) {
        const t = i / (numRungs + 1);
        const mx = from.x + dx * t;
        const my = from.y + dy * t;

        const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rung.setAttribute('x1', mx + nx);
        rung.setAttribute('y1', my + ny);
        rung.setAttribute('x2', mx - nx);
        rung.setAttribute('y2', my - ny);
        rung.setAttribute('stroke', color);
        rung.setAttribute('stroke-width', '4');
        rung.setAttribute('stroke-linecap', 'round');
        g.appendChild(rung);
    }

    svg.appendChild(g);
}

function drawSnake(svg, from, to, color, stripeColor) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('filter', 'url(#shadow)');
    g.setAttribute('opacity', '0.85');

    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;

    // Curva ondulada con mas forma de S
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const wave1 = (dx > 0 ? 50 : dx < 0 ? -50 : 45);
    const wave2 = -wave1;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const cp1x = from.x + wave1;
    const cp1y = from.y + dy * 0.3;
    const cp2x = to.x + wave2;
    const cp2y = from.y + dy * 0.7;
    const d = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
    path.setAttribute('d', d);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '10');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    g.appendChild(path);

    // Rayas de la serpiente
    const stripePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    stripePath.setAttribute('d', d);
    stripePath.setAttribute('stroke', stripeColor);
    stripePath.setAttribute('stroke-width', '4');
    stripePath.setAttribute('fill', 'none');
    stripePath.setAttribute('stroke-linecap', 'round');
    stripePath.setAttribute('stroke-dasharray', '8 12');
    g.appendChild(stripePath);

    // Cabeza de la serpiente (circulo)
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', from.x);
    head.setAttribute('cy', from.y);
    head.setAttribute('r', '8');
    head.setAttribute('fill', color);
    head.setAttribute('stroke', stripeColor);
    head.setAttribute('stroke-width', '2');
    g.appendChild(head);

    // Ojitos
    const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eye1.setAttribute('cx', from.x - 3);
    eye1.setAttribute('cy', from.y - 2);
    eye1.setAttribute('r', '2');
    eye1.setAttribute('fill', 'white');
    g.appendChild(eye1);

    const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eye2.setAttribute('cx', from.x + 3);
    eye2.setAttribute('cy', from.y - 2);
    eye2.setAttribute('r', '2');
    eye2.setAttribute('fill', 'white');
    g.appendChild(eye2);

    const pupil1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pupil1.setAttribute('cx', from.x - 3);
    pupil1.setAttribute('cy', from.y - 2);
    pupil1.setAttribute('r', '1');
    pupil1.setAttribute('fill', '#333');
    g.appendChild(pupil1);

    const pupil2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pupil2.setAttribute('cx', from.x + 3);
    pupil2.setAttribute('cy', from.y - 2);
    pupil2.setAttribute('r', '1');
    pupil2.setAttribute('fill', '#333');
    g.appendChild(pupil2);

    // Lengua bifida
    const tongue = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tongue.setAttribute('d', `M ${from.x} ${from.y + 8} L ${from.x - 3} ${from.y + 15} M ${from.x} ${from.y + 8} L ${from.x + 3} ${from.y + 15}`);
    tongue.setAttribute('stroke', '#d32f2f');
    tongue.setAttribute('stroke-width', '1.5');
    tongue.setAttribute('fill', 'none');
    tongue.setAttribute('stroke-linecap', 'round');
    g.appendChild(tongue);

    // Cola (punta fina al final)
    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    tail.setAttribute('cx', to.x);
    tail.setAttribute('cy', to.y);
    tail.setAttribute('r', '3');
    tail.setAttribute('fill', color);
    g.appendChild(tail);

    svg.appendChild(g);
}

function updateTokens(players) {
    document.querySelectorAll('.cell-tokens').forEach(div => div.innerHTML = '');

    players.forEach(player => {
        const cell = document.getElementById(`cell-${player.position}`);
        if (cell) {
            const tokensDiv = cell.querySelector('.cell-tokens');
            const token = document.createElement('div');
            token.className = 'token';
            token.style.backgroundColor = player.color;
            token.title = player.name;
            token.textContent = player.emoji || '';
            tokensDiv.appendChild(token);
        }
    });

    updateTokenIndicators(players);
}

function updateTokenIndicators(players) {
    const container = document.getElementById('token-indicators');
    if (!container) return;
    container.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = 'token-indicator';
        div.innerHTML = `<div class="token-big" style="background:${p.color}">${p.emoji || ''}</div><span>${p.name}</span>`;
        container.appendChild(div);
    });
}

function animateToken(player, from, to, players, callback) {
    const step = from < to ? 1 : -1;
    let current = from;

    function moveStep() {
        current += step;
        player.position = current;
        updateTokens(players);

        const cell = document.getElementById(`cell-${current}`);
        if (cell) {
            cell.classList.add('cell-bounce');
            setTimeout(() => cell.classList.remove('cell-bounce'), 300);
        }

        if (typeof playSound === 'function') playSound('move');

        if (current === to) {
            setTimeout(callback, 250);
        } else {
            setTimeout(moveStep, 180);
        }
    }

    setTimeout(moveStep, 180);
}

function addDirectionArrows(container) {
    // Flechas que indican la direccion del camino serpentina
    // Fila 0 (bottom): izq → der → curva arriba
    // Fila 1: der → izq → curva arriba
    // Fila 2: izq → der → curva arriba
    // Fila 3 (top): der → izq → FIN

    const arrows = [
        // Flecha derecha entre celda 5 y 6 (esquina inferior derecha, sube)
        { text: '↱', gridCol: 5, gridRow: 4, side: 'right' },
        // Flecha izquierda entre celda 10 y 11 (esquina izquierda, sube)
        { text: '↰', gridCol: 1, gridRow: 3, side: 'left' },
        // Flecha derecha entre celda 15 y 16 (esquina derecha, sube)
        { text: '↱', gridCol: 5, gridRow: 2, side: 'right' },
    ];

    // Flechas horizontales dentro de las filas
    const rowArrows = [
        // Fila 1 (bottom): izq a der
        { text: '→', row: 4, col: 2.5, opacity: 0.2 },
        // Fila 2: der a izq
        { text: '←', row: 3, col: 3.5, opacity: 0.2 },
        // Fila 3: izq a der
        { text: '→', row: 2, col: 2.5, opacity: 0.2 },
        // Fila 4: der a izq
        { text: '←', row: 1, col: 3.5, opacity: 0.2 },
    ];

    // Los agregamos como elementos posicionados sobre el board usando CSS grid
    // No los ponemos dentro del grid, sino como overlay despues del render
}
