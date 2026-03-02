document.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.airpods-realistic .image');
    const blackBtn = document.querySelector('.black');
    const pinkBtn = document.querySelector('.pink');
    const yellowBtn = document.querySelector('.yellow');
    const whiteBtn = document.querySelector('.white');

    console.log('image:', image);
    console.log('black button:', blackBtn);
    console.log('pink button:', pinkBtn);
    console.log('yellow button:', yellowBtn);
    console.log('white button:', whiteBtn);

    document.addEventListener('click', (e) => {
    console.log('Click registered on:', e.target);
});
    // Verify binding
    console.log('Attempting to bind events...');

    blackBtn.addEventListener('click', (e) => {
        console.log('BLACK click fired', e.target);
        tintBlackContrast();
    });
    pinkBtn.addEventListener('click', (e) => {
        console.log('PINK click fired', e.target);
        tintPink();
    });
    yellowBtn.addEventListener('click', (e) => {
        console.log('YELLOW click fired', e.target);
        tintYellow();
    });
    whiteBtn.addEventListener('click', (e) => {
        console.log('WHITE click fired', e.target);
        tintWhite();
    });

    console.log('Events bound successfully');

    function tintBlackContrast() { image.className = 'image tint-black'; }
    function tintPink() { image.className = 'image tint-pink'; }
    function tintYellow() { image.className = 'image tint-yellow'; }
    function tintWhite() { image.className = 'image tint-white'; }
});