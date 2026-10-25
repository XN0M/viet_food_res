const groups = ['predjedla', 'pho-rezance', 'hlavne', 'bento-bowls', 'sushi', 'dezerty', 'napoje'];
const group = document.body.dataset.previewGroup;
const page = Number(document.body.dataset.previewPage || 1);
const pages = Number(document.body.dataset.previewPages || 1);
const menuFile = (id, number = 1) => id === 'pho-rezance' && number === 1
  ? 'menu.html'
  : `menu-${id}${number > 1 ? `-${number}` : ''}.html`;
let toastTimer;
function notice() {
  const toast = document.getElementById('preview-toast');
  toast.textContent = 'Toto je len ukážka dizajnu. Objednávanie bude zapnuté v plnej verzii.';
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}
document.querySelectorAll('.vf-groups button').forEach((button, index) => {
  button.addEventListener('click', () => { location.href = `./${menuFile(groups[index])}`; });
});
document.querySelector('.vf-group-select')?.addEventListener('change', event => {
  const selected = event.currentTarget.value;
  if (groups.includes(selected)) location.href = `./${menuFile(selected)}`;
});
document.querySelectorAll('.vf-pagination button').forEach((button, index) => {
  button.addEventListener('click', () => {
    const next = index === 0 ? page - 1 : page + 1;
    if (group && next >= 1 && next <= pages) location.href = `./${menuFile(group, next)}`;
  });
});
document.querySelector('.vf-mobile-nav-button')?.addEventListener('click', event => {
  const nav = document.querySelector('.vf-mobile-nav');
  if (!nav) {
    const copy = document.querySelector('.vf-header nav')?.cloneNode(true);
    if (!copy) return;
    copy.className = 'vf-mobile-nav';
    copy.setAttribute('aria-label', 'Mobilná navigácia');
    document.querySelector('.vf-header')?.append(copy);
  } else nav.remove();
  event.currentTarget.setAttribute('aria-expanded', String(!!document.querySelector('.vf-mobile-nav')));
});
document.querySelectorAll('.vf-header-cart,.vf-gemini-hero-add,.vf-gemini-hero-image,.vf-gemini-card button,.vf-menu-item button,.vf-mobile-cart,.vf-search input').forEach(button => {
  button.addEventListener('click', notice);
});
