(function () {
    var headerHTML = `
    <header>
        <div class="logo">
            <a href="./index.html">
                <img src="./images/Logo weiß türkis.png" alt="ESTEEMED videography">
            </a>
        </div>
        <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="MenuBar">
            <a class="link" href="./index.html" data-i18n="nav.home">Home</a>
            <a class="link" href="./index.html#leistungen" data-i18n="nav.services">Leistungen</a>
            <a class="link" href="./portfolio.html" data-i18n="nav.portfolio">Portfolio</a>
            <a class="link" href="./kontakt.html" data-i18n="nav.contact">Kontakt</a>
        </nav>
        <button class="lang-btn" id="langToggle">
            <span class="lang-opt lang-active" data-lang="de" onclick="window.setLang('de')">DE</span>
            <span class="lang-sep">|</span>
            <span class="lang-opt" data-lang="en" onclick="window.setLang('en')">EN</span>
        </button>
    </header>`;

    var footerHTML = `
    <footer>
        <div class="footer-top">
            <div class="footer-brand">
                <div class="footer-logo">
                    <img class="logo" src="./images/Logo weiß türkis.png" alt="ESTEEMED videography">
                </div>
            </div>
            <div class="footer-links">
                <h4 class="footer-heading" data-i18n="footer.links">Links</h4>
                <a class="footer-link" href="./index.html" data-i18n="nav.home">Home</a>
                <a class="footer-link" href="./index.html#leistungen" data-i18n="nav.services">Leistungen</a>
                <a class="footer-link" href="./portfolio.html" data-i18n="nav.portfolio">Portfolio</a>
                <a class="footer-link" href="./kontakt.html" data-i18n="nav.contact">Kontakt</a>
            </div>
            <div class="footer-socials">
                <h4 class="footer-heading" data-i18n="footer.socials">Socials</h4>
                <a class="footer-link" href="https://www.instagram.com/esteemed.videography/" target="_blank">Instagram</a>
            </div>
            <div class="footer-kontakt">
                <h4 class="footer-heading" data-i18n="footer.contact">Kontakt</h4>
                <p>Email: info@esteemed-videography.com</p>
                <p>Telefon: +43 660 900 5151</p>
                <p data-i18n="footer.location">Österreich</p>
            </div>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-bottom">
            <p data-i18n="footer.rights">© 2026 ESTEEMED videography. Alle Rechte vorbehalten.</p>
        </div>
    </footer>`;

    function injectTemplates() {
        var headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = headerHTML;

            var page = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.MenuBar .link').forEach(function (link) {
                if (link.getAttribute('href') === './' + page) {
                    link.classList.add('active');
                }
            });

            var toggle = document.querySelector('.nav-toggle');
            var nav = document.querySelector('.MenuBar');
            if (toggle && nav) {
                toggle.addEventListener('click', function () {
                    var isOpen = nav.classList.toggle('open');
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

        var footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        }

        if (window.applyTranslations) window.applyTranslations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTemplates);
    } else {
        injectTemplates();
    }
})();
