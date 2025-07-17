// js/lesson.js
$(document).ready(function() {
  // Cache the owl image element
  const $owl = $('#owly');
  
  // Store the original image source
  const originalSrc = $owl.attr('src');
  
  // Path to the lesson owl image
  const lessonOwl = 'imgs/lesson.png';

  // Handle click on any lesson-tag
  $(document).on('click', '.lesson-tag', function(e) {
    e.preventDefault(); // Prevent default link behavior
    
    // Change the owl image
    $owl.attr('src', lessonOwl);
   $('.speech-bubble-right').html("<strong>Owly:</strong><br>great let's learn something new!<br>")
  
  });
  $(document).on('click', '#back-button', function(e) {
    e.preventDefault(); // Prevent default link behavior
    
    // Change the owl image
    $owl.attr('src', originalSrc);
   $('.speech-bubble-right').html("<strong>Owly:</strong><br>pick another lesson!<br>")
  
  });
});