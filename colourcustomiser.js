const image = document.querySelector('.airpods-realistic .image');

document.querySelector('.black').addEventListener('click', tintBlackContrast);
document.querySelector('.pink').addEventListener('click', tintPink);
document.querySelector('.yellow').addEventListener('click', tintYellow);
document.querySelector('.white').addEventListener('click', tintWhite);

function tintBlackContrast() {
    image.className = 'image tint-black';
}

function tintPink() {
    image.className = 'image tint-pink';
}

function tintYellow() {
    image.className = 'image tint-yellow';
}

function tintWhite() {
    image.className = 'image tint-white';
}