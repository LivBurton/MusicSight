// ----------NAVBAR TOGGLE---------------

const mainNav = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', function () {
  mainNav.classList.toggle('show');
  // console.log(mainNav.offsetHeight);
});
