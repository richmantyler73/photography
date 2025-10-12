let isOn = false;
let isSliding = false;
let loopOnSegment = false; // loop projector_on.mp3 between 5s and 15s while ON

const wrap = document.getElementById('overlayWrap');
let active = document.getElementById('overlayImg');
const beam = document.getElementById('beam');
const btn = document.getElementById('powerBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const changeSound = document.getElementById('changeSound');
const powerOnSound = document.getElementById('powerOnSound');

// Lightbox refs
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');

const slides = [
    'jpg/test0.JPG',
    'jpg/test1.JPG',
    'jpg/test2.JPG',
    'jpg/test3.JPG'
];
let index = 0;

function bust(url) {
    const isHttp = /^https?:/i.test(location.protocol);
    return isHttp ? `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}` : url;
}

function setImage(idx) {
    index = (idx + slides.length) % slides.length;
    active.src = bust(slides[index]);
}

function turnOn() {
    const WARMUP_MS = 1200; // reduced slightly for quicker startup
    beam.classList.add('on');
    if (!active.getAttribute('src') || active.getAttribute('src') === '#') {
        active.src = bust(slides[index]);
    }
    active.classList.add('on', 'startup');
    btn.classList.add('on');
    btn.setAttribute('aria-pressed', 'true');
    active.setAttribute('aria-hidden', 'false');

    // enable audio loop for the ON state (5s–15s)
    loopOnSegment = true;
    powerOnSound.currentTime = 0;
    powerOnSound.play();

    setTimeout(() => { if (active) active.classList.remove('startup'); }, WARMUP_MS);
        isOn = true;
}

function turnOff() {
    const SHUTDOWN_MS = 300; // keep in sync with CSS projectorShutdown duration

    // stop looping and jump to shutdown segment (~24s)
    loopOnSegment = false;
    powerOnSound.currentTime = 24.0;
    powerOnSound.play();

    active.classList.add('shutdown');
    setTimeout(
        () => {
            active.classList.remove('on', 'shutdown');
            beam.classList.remove('on');
            btn.classList.remove('on');
            btn.setAttribute('aria-pressed', 'false');
            active.setAttribute('aria-hidden', 'true');
            isOn = false;
        }, 
        SHUTDOWN_MS
    );
}

function toggleOverlay() { if (!isOn) turnOn(); else turnOff(); }
function nextImage() { setImage(index + 1); }
function prevImage() { setImage(index - 1); }

// --- Lightbox logic ---
function openLightbox() {
    if (!isOn) return; // only enlarge when projector is on
    lbImg.src = active.src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
}

active.addEventListener('click', openLightbox);
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    // Close when clicking outside the image
    if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

btn.addEventListener('click', toggleOverlay);
nextBtn.addEventListener('click', () => {
    if (!isOn) turnOn();
    nextImage();
    changeSound.currentTime = 0.1; // start at 100ms
    changeSound.play();
});
prevBtn.addEventListener('click', () => {
    if (!isOn) turnOn();
    prevImage();
    changeSound.currentTime = 0.1; // start at 100ms
    changeSound.play();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (!isOn) turnOn();
    nextImage();
    changeSound.currentTime = 0.1; // start at 100ms
    changeSound.play();
    }
    if (e.key === 'ArrowLeft')  {
        e.preventDefault();
        if (!isOn) turnOn();
        prevImage();
        changeSound.currentTime = 0.1; // start at 100ms
        changeSound.play();
    }
    if (e.key === ' ' || e.key === 'Enter') {
        const activeEl = document.activeElement;
        if (activeEl === btn) { e.preventDefault(); toggleOverlay(); }
    }
});

// Loop projector_on.mp3 between 5s and 15s while power is ON
powerOnSound.addEventListener('timeupdate', () => {
    if (loopOnSegment && powerOnSound.currentTime >= 15) {
        powerOnSound.currentTime = 5;
        if (powerOnSound.paused) powerOnSound.play();
    }
});

// Preload images & set initial
slides.forEach(src => { const img = new Image(); img.src = bust(src); });
active.src = bust(slides[index]);