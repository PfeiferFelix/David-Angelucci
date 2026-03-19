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