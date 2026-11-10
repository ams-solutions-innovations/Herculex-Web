// Close the mobile menu after following an in-page link.
document.querySelectorAll('.site-header details.menu').forEach((menu) => {
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) menu.open = false;
  });
});
