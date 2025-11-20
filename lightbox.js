// Simple lightbox functionality for portfolio images
(function() {
  'use strict';

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <img class="lightbox-image" src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // Get all portfolio images
  const portfolioImages = document.querySelectorAll('.portfolio-image');

  // Open lightbox
  function openLightbox(img, caption) {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Add click handlers to all portfolio images
  portfolioImages.forEach(function(img) {
    // Make images look clickable
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', function() {
      // Find the caption (next sibling <p> with class portfolio-caption)
      let caption = '';
      let nextElement = img.nextElementSibling;
      
      // Check if next sibling is a caption
      if (nextElement && nextElement.classList.contains('portfolio-caption')) {
        caption = nextElement.textContent.trim();
      }
      
      // If image is in a grid, check parent's next sibling
      if (!caption && img.parentElement) {
        const parent = img.parentElement;
        const captionElement = parent.querySelector('.portfolio-caption');
        if (captionElement) {
          caption = captionElement.textContent.trim();
        }
      }
      
      openLightbox(img, caption);
    });
  });

  // Close on overlay click
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Close on close button click
  lightboxClose.addEventListener('click', closeLightbox);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Prevent closing when clicking on the image itself
  lightboxContent.addEventListener('click', function(e) {
    e.stopPropagation();
  });
})();

