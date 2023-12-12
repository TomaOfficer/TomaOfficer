document.addEventListener('DOMContentLoaded', function() {
    var lightboxImage = document.getElementById('lightbox-image'),
        lightbox = document.getElementById('lightbox'),
        triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var bigImageHref = this.getAttribute('href');
            lightboxImage.setAttribute('src', bigImageHref);
            lightbox.style.display = 'block';
        });
    });

    lightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
});
