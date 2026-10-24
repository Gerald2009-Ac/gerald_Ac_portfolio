const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Portfolio enquiry: ${service}`);
  const body = encodeURIComponent(
    `Hello Gerald Ac Technologies,\n\nMy name is ${name}.\nMy email: ${email}\nService needed: ${service}\n\nProject details:\n${message}\n\nSent from your portfolio website.`
  );
  document.getElementById('formHint').textContent =
    'Your email app should open with the enquiry prepared. Review it and press Send to deliver it.';
  window.location.href = `mailto:geraldac404@gmail.com?subject=${subject}&body=${body}`;
});
