document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.portfolio-showcase img');
  images.forEach(image => {
      image.classList.add('blur-image');
      image.addEventListener('click', function(e) {
          e.preventDefault();
          const password = prompt('Please enter the password to view the image:');
          if (password) {
              verifyPassword(password, image);
          }
      });
  });
});

function verifyPassword(password, image) {
  fetch('/verify_password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({password: password}),
  })
  .then(response => {
      console.log(response);
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Password verification failed');
      }
  })
  .then(data => {
      if (data.status === 'success') {
          image.classList.remove('blur-image');
      } else {
          alert('Incorrect password!');
      }
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while verifying the password.');
  });
}
