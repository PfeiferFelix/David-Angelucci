document.addEventListener('DOMContentLoaded', function () {
    // Vimeo thumbnails via oEmbed JSONP
    // Hinweis: bewusst "data-thumb-id" statt "data-vimeo-id" – Letzteres lässt das
    // Vimeo Player SDK das Element automatisch zu einem Live-Embed umwandeln.
    document.querySelectorAll('.portfolio-thumb-img[data-thumb-id]').forEach(function (thumb) {
        var id = thumb.dataset.thumbId;
        var cb = '_vt' + id;

        window[cb] = function (data) {
            delete window[cb];
            var s = document.getElementById(cb);
            if (s) s.parentNode.removeChild(s);
            if (data && data.thumbnail_url) {
                var url = data.thumbnail_url.replace(/_\d+x\d+/, '_960x1706');
                thumb.style.backgroundImage = "url('" + url + "')";
            }
        };

        var s = document.createElement('script');
        s.id = cb;
        s.src = 'https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + id + '&callback=' + cb;
        document.head.appendChild(s);
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

let vimeoPlayer = null;
let vimeoSDKPromise = null;

function loadVimeoSDK() {
    if (window.Vimeo && window.Vimeo.Player) return Promise.resolve();
    if (!vimeoSDKPromise) {
        vimeoSDKPromise = new Promise(function (resolve, reject) {
            const s = document.createElement('script');
            s.src = 'https://player.vimeo.com/api/player.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
    return vimeoSDKPromise;
}

function openVideoModal(src) {
    const modal = document.getElementById('videoModal');
    if (!modal) return;
    const video = document.getElementById('modalVideo');
    const vimeoWrapper = document.getElementById('modalVimeoWrapper');
    let vimeoIframe = document.getElementById('modalVimeo');
    const content = modal.querySelector('.video-modal-content');

    if (src.startsWith('vimeo:')) {
        const parts = src.split(':');
        const videoId = parts[1];
        const orientation = parts[2];
        if (video) video.style.display = 'none';

        // vimeoPlayer.destroy() entfernt das iframe aus dem DOM – beim erneuten
        // Öffnen muss es daher ggf. neu erstellt werden
        if (!vimeoIframe && vimeoWrapper) {
            vimeoIframe = document.createElement('iframe');
            vimeoIframe.id = 'modalVimeo';
            vimeoIframe.setAttribute('frameborder', '0');
            vimeoIframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
            vimeoIframe.setAttribute('allowfullscreen', '');
            vimeoWrapper.insertBefore(vimeoIframe, vimeoWrapper.firstChild);
        }

        vimeoWrapper.style.display = 'block';
        vimeoIframe.src = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&autoplay=1&player_id=0&app_id=58479`;
        if (orientation === 'portrait') {
            content.classList.add('portrait-mode');
            vimeoWrapper.classList.add('portrait');
        } else {
            content.classList.remove('portrait-mode');
            vimeoWrapper.classList.remove('portrait');
        }

        // Statt Vimeos "Mehr Videos"-Übersicht am Ende zeigen wir wieder das Thumbnail –
        // dafür schließen wir das Modal einfach, sobald das Video durchgelaufen ist
        loadVimeoSDK().then(function () {
            if (vimeoPlayer) { vimeoPlayer.destroy().catch(function () {}); vimeoPlayer = null; }
            vimeoPlayer = new Vimeo.Player(vimeoIframe);
            vimeoPlayer.on('ended', function () {
                closeVideoModal();
            });
        }).catch(function () {});
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
    if (vimeoPlayer) { vimeoPlayer.destroy().catch(function () {}); vimeoPlayer = null; }
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
