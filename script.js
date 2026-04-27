document.addEventListener('DOMContentLoaded', function () {
    // Vimeo thumbnails
    document.querySelectorAll('.portfolio-thumb-img[data-vimeo-id]').forEach(function (img) {
        const id = img.dataset.vimeoId;
        // Primär: vumbnail.com (kein CORS-Problem)
        const fallbackUrl = `https://vumbnail.com/${id}.jpg`;
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.thumbnail_url) {
                    img.src = data.thumbnail_url;
                } else {
                    img.src = fallbackUrl;
                }
            })
            .catch(() => { img.src = fallbackUrl; });
    });

    // Inject Vimeo wrapper into modal if not already present
    const modal = document.getElementById('videoModal');
    if (modal) {
        const content = modal.querySelector('.video-modal-content');

        if (!document.getElementById('modalVimeoWrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'modalVimeoWrapper';
            wrapper.style.display = 'none';
            wrapper.innerHTML = '<iframe id="modalVimeo" src="" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
            content.appendChild(wrapper);
        }

        if (!document.getElementById('modalVideo')) {
            const video = document.createElement('video');
            video.id = 'modalVideo';
            video.controls = true;
            video.style.display = 'none';
            video.innerHTML = '<source id="modalVideoSrc" src="" type="video/mp4">';
            content.appendChild(video);
        }
    }

    // Fade-in scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = entry.target.dataset.delay || '0ms';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach((el) => {
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        const idx = Array.from(siblings).indexOf(el);
        if (siblings.length > 1) el.dataset.delay = (idx * 120) + 'ms';
        observer.observe(el);
    });

    // Kontakt form (nur auf Kontakt-Seite)
    const form = document.querySelector('.kontakt-form');
    if (form) {
        form.addEventListener('submit', async function (event) {
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
    }
});

function openVideoModal(src) {
    const modal = document.getElementById('videoModal');
    if (!modal) return;
    const video = document.getElementById('modalVideo');
    const vimeoWrapper = document.getElementById('modalVimeoWrapper');
    const vimeoIframe = document.getElementById('modalVimeo');
    const content = modal.querySelector('.video-modal-content');

    if (src.startsWith('vimeo:')) {
        const parts = src.split(':');
        const videoId = parts[1];
        const orientation = parts[2];
        if (video) video.style.display = 'none';
        vimeoWrapper.style.display = 'block';
        vimeoIframe.src = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&autoplay=1&player_id=0&app_id=58479`;
        if (orientation === 'portrait') {
            content.classList.add('portrait-mode');
            vimeoWrapper.classList.add('portrait');
        } else {
            content.classList.remove('portrait-mode');
            vimeoWrapper.classList.remove('portrait');
        }
    } else {
        const source = document.getElementById('modalVideoSrc');
        if (vimeoWrapper) vimeoWrapper.style.display = 'none';
        if (video) video.style.display = '';
        if (source) source.src = src;
        if (video) video.load();
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) return;
    const video = document.getElementById('modalVideo');
    const vimeoWrapper = document.getElementById('modalVimeoWrapper');
    const vimeoIframe = document.getElementById('modalVimeo');
    const content = modal.querySelector('.video-modal-content');

    if (video) video.pause();
    if (vimeoIframe) vimeoIframe.src = '';
    if (vimeoWrapper) { vimeoWrapper.style.display = 'none'; vimeoWrapper.classList.remove('portrait'); }
    content.classList.remove('portrait-mode');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideoModal();
});

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

function showPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) popup.style.display = 'flex';
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    if (popup) popup.style.display = 'none';
}
