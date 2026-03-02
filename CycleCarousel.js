const container = document.querySelector('.testimonials');

const left = document.querySelector('.left');
const mid = document.querySelector('.mid');
const right = document.querySelector('.right');

console.log(container);
console.log(left);
console.log(mid);
console.log(right);

const slides = [
    left,mid,right
];
// positions as multiples of 100% (-1 = left, 0 = centre, 1 = right)
let positions = [0, 1, -1]; // img1 centre, img2 right, img3 left
let dragging = false;
let startX = 0;
let dragDelta = 0;

container.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX;
    // disable transition while dragging for real-time feel
    slides.forEach(s => s.style.transition = 'none');
});

document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    dragDelta = e.clientX - startX;
    const pct = (dragDelta / container.offsetWidth) * 100;
    slides.forEach((s, i) => {
        s.style.transform = `translateX(${positions[i] * 100 + pct}%)`;
    });
});

document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    slides.forEach(s => s.style.transition = 'transform 0.3s ease');

    const threshold = container.offsetWidth * 0.2; // 20% drag to trigger

    if (dragDelta < -threshold) {
        // dragged left → shift everything left
        positions = positions.map(p => p - 1);
        recycle();
    } else if (dragDelta > threshold) {
        // dragged right → shift everything right
        positions = positions.map(p => p + 1);
        recycle();
    }

    // snap to current positions
    slides.forEach((s, i) => {
        s.style.transform = `translateX(${positions[i] * 100}%)`;
    });

    dragDelta = 0;
});

function recycle() {
    // if any image goes beyond ±1, wrap it to the other side
    positions.forEach((p, i) => {
        if (p > 1) {
            positions[i] = -1;
            // instantly reposition without transition
            slides[i].style.transition = 'none';
            slides[i].style.transform = `translateX(-100%)`;
            setTimeout(() => slides[i].style.transition = 'transform 0.3s ease', 50);
        }
        if (p < -1) {
            positions[i] = 1;
            slides[i].style.transition = 'none';
            slides[i].style.transform = `translateX(100%)`;
            setTimeout(() => slides[i].style.transition = 'transform 0.3s ease', 50);
        }
    });

    // update z-index: centred image (position 0) gets highest
    slides.forEach((s, i) => {
        s.style.zIndex = positions[i] === 0 ? 2 : 1;
    });
}