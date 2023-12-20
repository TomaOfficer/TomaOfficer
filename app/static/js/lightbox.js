document.addEventListener('DOMContentLoaded', function() {
    var lightboxImage = document.getElementById('lightbox-image'),
        lightbox = document.getElementById('lightbox'),
        triggers = document.querySelectorAll('.lightbox-trigger');

    document.querySelectorAll('img.requires-password').forEach(image => {
        image.classList.add('blur-image');
    });

    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var clickedImage = this.querySelector('img');

            if (clickedImage.classList.contains('requires-password')) {
                // Image requires a password
                const password = prompt('Please enter the password to view the image:');
                if (password) {
                    verifyPassword(password, clickedImage, function(isVerified) {
                        if(isVerified) {
                            displayInLightbox(clickedImage);
                        }
                    });
                }
            } else {
                // No password required, display directly
                displayInLightbox(clickedImage);
            }
        });
    });

    lightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });

    function displayInLightbox(image) {
        var bigImageHref = image.closest('.lightbox-trigger').getAttribute('href');
        lightboxImage.setAttribute('src', bigImageHref);
        lightbox.style.display = 'block';
    }
});

function verifyPassword(password, image, callback) {
    fetch('/verify_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: password}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            image.classList.remove('blur-image');
            callback(true);
        } else {
            alert('Incorrect password!');
            callback(false);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while verifying the password.');
        callback(false);
    });
}
