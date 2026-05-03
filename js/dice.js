// Dado 3D animado
// Rotaciones para mostrar cada cara del cubo
const DICE_ROTATIONS = {
    1: 'rotateX(0deg) rotateY(0deg)',       // front
    2: 'rotateX(90deg) rotateY(0deg)',      // bottom
    3: 'rotateY(90deg) rotateX(0deg)',      // right
    4: 'rotateY(-90deg) rotateX(0deg)',     // left
    5: 'rotateX(-90deg) rotateY(0deg)',     // top
    6: 'rotateX(180deg) rotateY(0deg)'      // back
};

function rollDice(callback) {
    const cube = document.getElementById('dice-cube');
    const scene = document.getElementById('dice-scene');

    scene.style.pointerEvents = 'none';
    scene.classList.remove('dice-glow');

    // Resultado aleatorio
    const result = Math.floor(Math.random() * 6) + 1;

    // Animacion de giro: varias vueltas + posicion final
    const spinsX = (Math.floor(Math.random() * 3) + 2) * 360;
    const spinsY = (Math.floor(Math.random() * 3) + 2) * 360;

    // Primero hacer el giro rapido
    cube.style.transition = 'none';
    cube.style.transform = 'rotateX(0deg) rotateY(0deg)';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cube.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.3, 1)';
            const finalRotation = DICE_ROTATIONS[result];
            const [rx, ry] = finalRotation.match(/-?\d+/g).map(Number);
            cube.style.transform = `rotateX(${spinsX + rx}deg) rotateY(${spinsY + ry}deg)`;
        });
    });

    // Efecto de rebote al terminar
    setTimeout(() => {
        scene.style.pointerEvents = 'auto';
        // Pequeno rebote final
        cube.style.transition = 'transform 0.15s ease';
        const finalRotation = DICE_ROTATIONS[result];
        const [rx, ry] = finalRotation.match(/-?\d+/g).map(Number);
        cube.style.transform = `rotateX(${spinsX + rx + 5}deg) rotateY(${spinsY + ry}deg)`;
        setTimeout(() => {
            cube.style.transform = `rotateX(${spinsX + rx}deg) rotateY(${spinsY + ry}deg)`;
            setTimeout(() => callback(result), 200);
        }, 150);
    }, 1300);
}
