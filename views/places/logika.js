document.addEventListener('DOMContentLoaded', function () {
    const active = document.getElementById('active');
    if (currentUser && place.author.equals(currentUser._id)) {
      active.style.display = 'block';
    } else {
      active.style.display = 'none';
    }
  });