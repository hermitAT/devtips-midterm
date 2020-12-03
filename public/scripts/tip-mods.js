
$(document).ready(function() {


  $('.far fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": tip_id }
    })
      .done(function() {
        $likeIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": tip_id }
    })
      .done(function() {
        $likeIcon.removeClass('fas').addClass('far');
      });
  });

  $('.far fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": tip_id }
    })
      .done(function() {
        $bookmarkIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": tip_id }
    })
      .done(function() {
        $bookmarkIcon.removeClass('fas').addClass('far');
      });
  });

});
