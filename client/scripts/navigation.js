document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('burger')
    .addEventListener('click', function() {
      this.classList.toggle('active');
      document
        .getElementById('nav-items')
        .classList.toggle('active');
    });
});
