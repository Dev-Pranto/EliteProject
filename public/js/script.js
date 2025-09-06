$('.banner_slider').slick({
  arrows: false,
  autoplay: true,
  fade:true,
})
var navLinks = document.getElementById('navLinks')
function showMenu() {
  navLinks.style.left = '0%'
  navLinks.style.boxShadow = '0px 1px 20px rgba(0,0,0,0.4)'
}
function hideMenu() {
  navLinks.style.left = '-90%'
  navLinks.style.boxShadow = '0px 1px 20px rgba(0,0,0,0.0)'
}
 
window.addEventListener('scroll', function () {
  var _0x159848 = document.querySelector('.fa-chevron-up')
  _0x159848.classList.toggle('arrowUp', window.scrollY > 500)
})