(function () {
    const headerHTML = `
    <header>
        <div class="logo">
            <img src="./images/Logo weiß türkis.png" alt="ESTEEMED videography">
        </div>
        <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="MenuBar">
            <a class="link" href="./index.html">Home</a>
            <a class="link" href="./portfolio.html">Portfolio</a>
            <a class="link" href="./kontakt.html">Kontakt</a>
        </nav>
    </header>`;

    const footerHTML = `
    <footer>
        <div class="footer-top">
            <div class="footer-brand">
                <div class="footer-logo">
                    <img class="logo" src="./images/Logo weiß türkis.png" alt="ESTEEMED videography">
                </div>
            </div>
            <div class="footer-links">
                <h4 class="footer-heading">Links</h4>
                <a class="footer-link" href="./index.html">Home</a>
                <a class="footer-link" href="./portfolio.html">Portfolio</a>
                <a class="footer-link" href="./kontakt.html">Kontakt</a>
            </div>
            <div class="footer-socials">
                <h4 class="footer-heading">Socials</h4>
                <a class="footer-link" href="https://www.instagram.com/dvdangelucci/" target="_blank">Instagram</a>
                <a class="footer-link" href="https://www.facebook.com/david.angelucci.330" target="_blank">Facebook</a>
                <a class="footer-link" href="https://www.tiktok.com/@dvdangelucci" target="_blank">TikTok</a>
            </div>
            <div class="footer-legal">
                <h4 class="footer-heading">Rechtliches</h4>
                <a class="footer-link" href="./impressum.html">Impressum</a>
                <a class="footer-link" href="./agb.html">AGB</a>
                <a class="footer-link" href="./datenschutz.html">Datenschutz</a>
            </div>
            <div class="footer-kontakt">
                <h4 class="footer-heading">Kontakt</h4>
                <p>Email: info@angeluccifilmmedia.at</p>
                <p>Telefon: +43 123 456 789</p>
                <p>Österreich</p>
            </div>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-bottom">
            <p>© 2026 ESTEEMED videography. Alle Rechte vorbehalten.</p>
        </div>
    </footer>`;

    function injectTemplates() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = headerHTML;

            const page = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.MenuBar .link').forEach(function (link) {
                if (link.getAttribute('href') === './' + page) {
                    link.classList.add('active');
                }
            });

            const toggle = document.querySelector('.nav-toggle');
            const nav = document.querySelector('.MenuBar');
            if (toggle && nav) {
                toggle.addEventListener('click', function () {
                    const isOpen = nav.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', isOpen);
                });
                nav.querySelectorAll('.link').forEach(function (link) {
                    link.addEventListener('click', function () {
                        nav.classList.remove('open');
                        toggle.setAttribute('aria-expanded', 'false');
                    });
                });
            }
        }

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTemplates);
    } else {
        injectTemplates();
    }
})();
