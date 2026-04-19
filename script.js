function openVideoModal(src) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const vimeoWrapper = document.getElementById('modalVimeoWrapper');
    const vimeoIframe = document.getElementById('modalVimeo');
    const content = modal.querySelector('.video-modal-content');

    if (src.startsWith('vimeo:')) {
        const parts = src.split(':');
        const videoId = parts[1];
        const orientation = parts[2];
        video.style.display = 'none';
        vimeoWrapper.style.display = 'block';
        vimeoIframe.src = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&autoplay=1&player_id=0&app_id=58479`;
        if (orientation === 'portrait') {
            content.classList.add('portrait-mode');
            vimeoWrapper.style.paddingTop = '177.78%';
        } else {
            vimeoWrapper.style.paddingTop = '56.25%';
        }
    } else {
        const source = document.getElementById('modalVideoSrc');
        vimeoWrapper.style.display = 'none';
        video.style.display = '';
        source.src = src;
        video.load();
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const vimeoWrapper = document.getElementById('modalVimeoWrapper');
    const vimeoIframe = document.getElementById('modalVimeo');
    const content = modal.querySelector('.video-modal-content');
    video.pause();
    vimeoIframe.src = '';
    vimeoWrapper.style.display = 'none';
    content.classList.remove('portrait-mode');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideoModal();
});

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

function showPopup(event) {
    event.preventDefault();
    event.target.closest('form').reset();
    document.getElementById('successPopup').classList.add('active');
}

function closePopup() {
    document.getElementById('successPopup').classList.remove('active');
}

//Formspree
document.querySelector('.kontakt-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const response = await fetch('https://formspree.io/f/mkoqykaw', {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
        showPopup();
        this.reset();
    }
});

function showPopup() {
    document.getElementById('successPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
}